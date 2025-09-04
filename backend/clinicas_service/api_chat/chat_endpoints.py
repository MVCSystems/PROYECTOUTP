from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from clinicas.models import Especialidad, Doctor, Horario, Cita, Paciente
from clinicas.serializers import (
    EspecialidadSerializer, DoctorSerializer, CitaSerializer
)
from datetime import datetime, timedelta
import json

# Estos endpoints son públicos para ser consumidos por el chatbot
@api_view(['GET'])
@permission_classes([AllowAny])
def get_especialidades(request):
    """Retorna todas las especialidades disponibles"""
    especialidades = Especialidad.objects.filter(activo=True)
    serializer = EspecialidadSerializer(especialidades, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctores_por_especialidad(request, especialidad_id):
    """Retorna doctores por especialidad"""
    doctores = Doctor.objects.filter(
        especialidad_id=especialidad_id,
        activo=True
    )
    serializer = DoctorSerializer(doctores, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_horarios_disponibles(request, doctor_id):
    """Retorna horarios disponibles para un doctor y fecha específicos"""
    fecha_str = request.query_params.get('fecha')
    
    if not fecha_str:
        return Response(
            {"error": "Se requiere el parámetro 'fecha' (formato: YYYY-MM-DD)"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            {"error": "Formato de fecha inválido. Use YYYY-MM-DD"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        doctor = Doctor.objects.get(id=doctor_id, activo=True)
    except Doctor.DoesNotExist:
        return Response(
            {"error": "Doctor no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Obtener el día de la semana (0=Lunes, 6=Domingo)
    dia_semana = fecha.weekday()
    
    # Obtener horarios del doctor para ese día
    horarios = Horario.objects.filter(
        doctor=doctor,
        dia_semana=dia_semana,
        activo=True
    )
    
    if not horarios:
        return Response({"disponible": [], "mensaje": "El doctor no atiende este día"})
    
    # Obtener citas ya programadas para ese día
    citas_ocupadas = Cita.objects.filter(
        doctor=doctor,
        fecha=fecha,
        estado__in=['programada', 'confirmada', 'reprogramada']
    ).values_list('hora_inicio', flat=True)
    
    # Generar horarios disponibles
    disponibles = []
    
    for horario in horarios:
        hora_actual = horario.hora_inicio
        while hora_actual < horario.hora_fin:
            # Verificar si este horario ya está ocupado
            if hora_actual not in citas_ocupadas:
                hora_fin = (datetime.combine(fecha, hora_actual) + timedelta(minutes=30)).time()
                disponibles.append({
                    "hora_inicio": hora_actual.strftime('%H:%M'),
                    "hora_fin": hora_fin.strftime('%H:%M')
                })
            
            # Avanzar 30 minutos
            hora_actual = (datetime.combine(fecha, hora_actual) + timedelta(minutes=30)).time()
    
    return Response({
        "disponible": disponibles,
        "mensaje": f"{len(disponibles)} horarios disponibles"
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def crear_cita_chatbot(request):
    """Crea una cita desde el chatbot"""
    try:
        # Validar datos requeridos
        required_fields = ['doctor_id', 'fecha', 'hora_inicio', 'nombre', 'apellidos', 
                          'email', 'telefono', 'motivo']
        
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {"error": f"El campo '{field}' es requerido"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Obtener doctor
        try:
            doctor = Doctor.objects.get(id=request.data['doctor_id'], activo=True)
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Convertir fecha y hora
        fecha = datetime.strptime(request.data['fecha'], '%Y-%m-%d').date()
        hora_inicio = datetime.strptime(request.data['hora_inicio'], '%H:%M').time()
        
        # Calcular hora_fin (30 minutos después)
        hora_fin = (datetime.combine(fecha, hora_inicio) + timedelta(minutes=30)).time()
        
        # Verificar si la hora está disponible
        if Cita.objects.filter(
            doctor=doctor,
            fecha=fecha,
            hora_inicio=hora_inicio,
            estado__in=['programada', 'confirmada', 'reprogramada']
        ).exists():
            return Response(
                {"error": "La hora seleccionada ya no está disponible"},
                status=status.HTTP_409_CONFLICT
            )
        
        # Buscar o crear paciente
        paciente, created = Paciente.objects.get_or_create(
            email=request.data['email'],
            defaults={
                'nombre': request.data['nombre'],
                'apellidos': request.data['apellidos'],
                'telefono': request.data['telefono'],
                'fecha_nacimiento': request.data.get('fecha_nacimiento', '1900-01-01'),
                'genero': request.data.get('genero', 'O'),
                'clinica': doctor.clinica
            }
        )
        
        # Si el paciente ya existía, actualizar sus datos
        if not created:
            paciente.nombre = request.data['nombre']
            paciente.apellidos = request.data['apellidos']
            paciente.telefono = request.data['telefono']
            paciente.save()
        
        # Crear la cita
        cita = Cita.objects.create(
            paciente=paciente,
            doctor=doctor,
            fecha=fecha,
            hora_inicio=hora_inicio,
            hora_fin=hora_fin,
            motivo=request.data['motivo'],
            notas=request.data.get('notas', ''),
            estado='programada',
            chat_session_id=request.data.get('chat_session_id')
        )
        
        return Response({
            "success": True,
            "message": "Cita creada exitosamente",
            "cita": CitaSerializer(cita).data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )