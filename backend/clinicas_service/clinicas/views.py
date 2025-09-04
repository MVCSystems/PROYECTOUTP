from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import datetime, timedelta
from .models import Clinica, Especialidad, Doctor, Paciente, Horario, Cita
from .serializers import (
    ClinicaSerializer, EspecialidadSerializer, DoctorSerializer,
    PacienteSerializer, HorarioSerializer, CitaSerializer
)

class ClinicaViewSet(viewsets.ModelViewSet):
    queryset = Clinica.objects.filter(activo=True)
    serializer_class = ClinicaSerializer
    
    @action(detail=True, methods=['get'])
    def especialidades(self, request, pk=None):
        clinica = self.get_object()
        especialidades = Especialidad.objects.filter(clinica=clinica, activo=True)
        serializer = EspecialidadSerializer(especialidades, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def doctores(self, request, pk=None):
        clinica = self.get_object()
        doctores = Doctor.objects.filter(clinica=clinica, activo=True)
        
        # Filtrar por especialidad si se proporciona
        especialidad_id = request.query_params.get('especialidad')
        if especialidad_id:
            doctores = doctores.filter(especialidad_id=especialidad_id)
        
        serializer = DoctorSerializer(doctores, many=True)
        return Response(serializer.data)

class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.filter(activo=True)
    serializer_class = EspecialidadSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por clínica si se proporciona
        clinica_id = self.request.query_params.get('clinica')
        if clinica_id:
            queryset = queryset.filter(clinica_id=clinica_id)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def doctores(self, request, pk=None):
        especialidad = self.get_object()
        doctores = Doctor.objects.filter(especialidad=especialidad, activo=True)
        serializer = DoctorSerializer(doctores, many=True)
        return Response(serializer.data)

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.filter(activo=True)
    serializer_class = DoctorSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por clínica y/o especialidad
        clinica_id = self.request.query_params.get('clinica')
        especialidad_id = self.request.query_params.get('especialidad')
        
        if clinica_id:
            queryset = queryset.filter(clinica_id=clinica_id)
        
        if especialidad_id:
            queryset = queryset.filter(especialidad_id=especialidad_id)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def horarios(self, request, pk=None):
        doctor = self.get_object()
        horarios = Horario.objects.filter(doctor=doctor, activo=True)
        serializer = HorarioSerializer(horarios, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def citas_disponibles(self, request, pk=None):
        doctor = self.get_object()
        fecha = request.query_params.get('fecha')
        
        if not fecha:
            return Response({"error": "Debe proporcionar una fecha"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
            dia_semana = fecha_obj.weekday()  # 0 es lunes, 6 es domingo
            
            # Obtener los horarios para ese día de la semana
            horarios = Horario.objects.filter(doctor=doctor, dia_semana=dia_semana, activo=True)
            
            # Obtener citas ya programadas para ese día
            citas_existentes = Cita.objects.filter(
                doctor=doctor,
                fecha=fecha_obj,
                estado__in=['programada', 'confirmada', 'reprogramada']
            )
            
            # Generar slots disponibles (asumiendo citas de 30 minutos)
            slots_disponibles = []
            
            for horario in horarios:
                hora_actual = horario.hora_inicio
                while hora_actual < horario.hora_fin:
                    # Verificar si ya existe una cita en este horario
                    cita_existente = citas_existentes.filter(hora_inicio=hora_actual).exists()
                    
                    if not cita_existente:
                        # Calcular hora de fin (30 minutos después)
                        hora_fin = (datetime.combine(fecha_obj, hora_actual) + timedelta(minutes=30)).time()
                        
                        slots_disponibles.append({
                            "hora_inicio": hora_actual.strftime('%H:%M'),
                            "hora_fin": hora_fin.strftime('%H:%M')
                        })
                    
                    # Avanzar 30 minutos
                    hora_actual = (datetime.combine(fecha_obj, hora_actual) + timedelta(minutes=30)).time()
            
            return Response(slots_disponibles)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Si no es staff, solo ver pacientes de su propia clínica
        if not self.request.user_permissions.get('can_view', False):
            return Paciente.objects.none()
        
        # Filtrar por clínica
        clinica_id = self.request.query_params.get('clinica')
        if clinica_id:
            queryset = queryset.filter(clinica_id=clinica_id)
        
        return queryset

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all().order_by('-fecha', 'hora_inicio')
    serializer_class = CitaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar según el rol del usuario
        if not self.request.user_permissions.get('can_view', False):
            return Cita.objects.none()
        
        # Filtros adicionales
        doctor_id = self.request.query_params.get('doctor')
        paciente_id = self.request.query_params.get('paciente')
        fecha = self.request.query_params.get('fecha')
        estado = self.request.query_params.get('estado')
        
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        
        if paciente_id:
            queryset = queryset.filter(paciente_id=paciente_id)
        
        if fecha:
            queryset = queryset.filter(fecha=fecha)
        
        if estado:
            queryset = queryset.filter(estado=estado)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        cita = self.get_object()
        estado = request.data.get('estado')
        
        if not estado:
            return Response({"error": "Debe proporcionar un estado"}, status=status.HTTP_400_BAD_REQUEST)
        
        if estado not in [e[0] for e in Cita._meta.get_field('estado').choices]:
            return Response({"error": "Estado inválido"}, status=status.HTTP_400_BAD_REQUEST)
        
        cita.estado = estado
        cita.save()
        
        return Response(CitaSerializer(cita).data)