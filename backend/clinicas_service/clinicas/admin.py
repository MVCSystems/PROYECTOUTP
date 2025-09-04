from django.contrib import admin
from clinicas.models import Clinica, Especialidad, Doctor, Paciente, Horario, Cita

@admin.register(Clinica)
class ClinicaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'direccion', 'telefono', 'email', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre', 'direccion')

@admin.register(Especialidad)
class EspecialidadAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'clinica', 'activo')
    list_filter = ('clinica', 'activo')
    search_fields = ('nombre',)

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellidos', 'especialidad', 'clinica', 'email', 'activo')
    list_filter = ('especialidad', 'clinica', 'activo')
    search_fields = ('nombre', 'apellidos', 'email')

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellidos', 'fecha_nacimiento', 'email', 'clinica')
    list_filter = ('clinica', 'genero')
    search_fields = ('nombre', 'apellidos', 'email')

@admin.register(Horario)
class HorarioAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'get_dia_semana', 'hora_inicio', 'hora_fin', 'activo')
    list_filter = ('doctor', 'dia_semana', 'activo')
    
    def get_dia_semana(self, obj):
        dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        return dias[obj.dia_semana]
    get_dia_semana.short_description = 'Día'

@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'doctor', 'fecha', 'hora_inicio', 'estado')
    list_filter = ('estado', 'fecha', 'doctor')
    search_fields = ('paciente__nombre', 'paciente__apellidos', 'doctor__nombre', 'doctor__apellidos')
    date_hierarchy = 'fecha'