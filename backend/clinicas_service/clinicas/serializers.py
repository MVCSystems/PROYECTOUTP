from rest_framework import serializers
from .models import Clinica, Especialidad, Doctor, Paciente, Horario, Cita

class ClinicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinica
        fields = ['id', 'nombre', 'direccion', 'telefono', 'email', 'logo', 
                  'descripcion', 'horario_apertura', 'horario_cierre', 'activo']

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre', 'descripcion', 'icono', 'clinica', 'activo']

class HorarioSerializer(serializers.ModelSerializer):
    dia_semana_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Horario
        fields = ['id', 'dia_semana', 'dia_semana_nombre', 'hora_inicio', 'hora_fin', 'activo']
    
    def get_dia_semana_nombre(self, obj):
        dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        return dias[obj.dia_semana]

class DoctorSerializer(serializers.ModelSerializer):
    especialidad_nombre = serializers.ReadOnlyField(source='especialidad.nombre')
    clinica_nombre = serializers.ReadOnlyField(source='clinica.nombre')
    horarios = HorarioSerializer(many=True, read_only=True)
    
    class Meta:
        model = Doctor
        fields = ['id', 'nombre', 'apellidos', 'email', 'telefono', 'foto',
                  'especialidad', 'especialidad_nombre', 'clinica', 'clinica_nombre',
                  'numero_colegiado', 'biografia', 'activo', 'horarios']

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id', 'nombre', 'apellidos', 'fecha_nacimiento', 'genero',
                  'email', 'telefono', 'direccion', 'tipo_sangre', 'alergias',
                  'clinica', 'fecha_registro']

class CitaSerializer(serializers.ModelSerializer):
    doctor_nombre = serializers.SerializerMethodField()
    paciente_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Cita
        fields = ['id', 'paciente', 'paciente_nombre', 'doctor', 'doctor_nombre',
                  'fecha', 'hora_inicio', 'hora_fin', 'motivo', 'notas',
                  'estado', 'chat_session_id', 'fecha_creacion']
    
    def get_doctor_nombre(self, obj):
        return f"Dr. {obj.doctor.nombre} {obj.doctor.apellidos}"
    
    def get_paciente_nombre(self, obj):
        return f"{obj.paciente.nombre} {obj.paciente.apellidos}"