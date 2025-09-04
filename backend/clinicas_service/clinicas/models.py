from django.db import models

class Clinica(models.Model):
    """Modelo principal para clínicas/consultorios médicos"""
    nombre = models.CharField(max_length=200)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    logo = models.ImageField(upload_to='clinicas/logos/', blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    horario_apertura = models.TimeField()
    horario_cierre = models.TimeField()
    activo = models.BooleanField(default=True)
    
    # Referencias al servicio de autenticación
    auth_module_id = models.IntegerField(help_text="ID del módulo en auth_service")
    auth_submodule_id = models.IntegerField(help_text="ID del submódulo en auth_service")
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Clínica"
        verbose_name_plural = "Clínicas"
    
    def __str__(self):
        return self.nombre

class Especialidad(models.Model):
    """Especialidades médicas disponibles"""
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    icono = models.CharField(max_length=50, blank=True, null=True)
    clinica = models.ForeignKey(Clinica, on_delete=models.CASCADE, related_name='especialidades')
    activo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Especialidad"
        verbose_name_plural = "Especialidades"
        unique_together = ('nombre', 'clinica')
    
    def __str__(self):
        return f"{self.nombre} - {self.clinica.nombre}"

class Doctor(models.Model):
    """Médicos que atienden en las clínicas"""
    # Campos de información personal
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    foto = models.ImageField(upload_to='doctores/fotos/', blank=True, null=True)
    
    # Referencias profesionales
    especialidad = models.ForeignKey(Especialidad, on_delete=models.PROTECT, related_name='doctores')
    clinica = models.ForeignKey(Clinica, on_delete=models.CASCADE, related_name='doctores')
    numero_colegiado = models.CharField(max_length=50, blank=True, null=True)
    biografia = models.TextField(blank=True, null=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Referencia al usuario en auth_service
    auth_user_id = models.IntegerField(help_text="ID del usuario en auth_service")
    
    class Meta:
        verbose_name = "Doctor"
        verbose_name_plural = "Doctores"
        unique_together = ('numero_colegiado', 'clinica')
    
    def __str__(self):
        return f"Dr. {self.nombre} {self.apellidos}"

class Paciente(models.Model):
    """Pacientes registrados en el sistema"""
    # Campos de información personal
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    genero = models.CharField(max_length=10, choices=[
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro')
    ])
    email = models.EmailField()
    telefono = models.CharField(max_length=20)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    
    # Información médica básica
    tipo_sangre = models.CharField(max_length=10, blank=True, null=True)
    alergias = models.TextField(blank=True, null=True)
    
    # Referencias
    clinica = models.ForeignKey(Clinica, on_delete=models.CASCADE, related_name='pacientes')
    
    # Referencia al usuario en auth_service (si tiene cuenta)
    auth_user_id = models.IntegerField(null=True, blank=True, help_text="ID del usuario en auth_service")
    
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Paciente"
        verbose_name_plural = "Pacientes"
    
    def __str__(self):
        return f"{self.nombre} {self.apellidos}"

class Horario(models.Model):
    """Horarios de atención de los doctores"""
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='horarios')
    dia_semana = models.IntegerField(choices=[
        (0, 'Lunes'),
        (1, 'Martes'),
        (2, 'Miércoles'),
        (3, 'Jueves'),
        (4, 'Viernes'),
        (5, 'Sábado'),
        (6, 'Domingo')
    ])
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    activo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Horario"
        verbose_name_plural = "Horarios"
        unique_together = ('doctor', 'dia_semana', 'hora_inicio')
    
    def __str__(self):
        dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        return f"{self.doctor} - {dias[self.dia_semana]} {self.hora_inicio} a {self.hora_fin}"

class Cita(models.Model):
    """Citas médicas programadas"""
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='citas')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='citas')
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    motivo = models.TextField()
    notas = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=[
        ('programada', 'Programada'),
        ('confirmada', 'Confirmada'),
        ('reprogramada', 'Reprogramada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
        ('ausente', 'Paciente Ausente')
    ], default='programada')
    
    # Para integración con el sistema de chat
    chat_session_id = models.CharField(max_length=100, blank=True, null=True)
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Cita"
        verbose_name_plural = "Citas"
    
    def __str__(self):
        return f"{self.paciente} con {self.doctor} - {self.fecha} {self.hora_inicio}"