from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superadmin', True)
        return self.create_user(email, password, **extra_fields)

class Module(models.Model):
    """Módulo principal del sistema (ej: clinicas_service, salones_service, chat_service)"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return self.name

class SubModule(models.Model):
    """Submódulo dentro de un módulo (ej: clínica específica, salón específico)"""
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='submodules')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        unique_together = ('module', 'code')
    def __str__(self):
        return f"{self.module.name} - {self.name}"

class Role(models.Model):
    """Rol de usuario (ej: admin_clinica, doctor, paciente, recepcionista, admin_salon, etc)"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    """Usuario personalizado con relaciones a módulos, submódulos y roles"""
    username = None  # Usar email como identificador principal
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150, default='')
    last_name = models.CharField(_('last name'), max_length=150, default='')
    is_superadmin = models.BooleanField(default=False)  # Superadmin global

    # Relaciones
    modules = models.ManyToManyField(Module, through='UserModuleAccess')
    roles = models.ManyToManyField(Role, blank=True)

    # Sobrescribir los campos que causan conflicto con related_name personalizado
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='custom_user_set',
        related_query_name='custom_user',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

class UserModuleAccess(models.Model):
    """Relación entre usuarios, módulos, submódulos y roles con permisos específicos"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    submodule = models.ForeignKey(SubModule, on_delete=models.CASCADE, null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, blank=True)

    # Permisos CRUD básicos
    can_view = models.BooleanField(default=True)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    date_assigned = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'module', 'submodule', 'role')

    def __str__(self):
        submodule_name = self.submodule.name if self.submodule else "Todos"
        role_name = self.role.name if self.role else "Sin rol"
        return f"{self.user.email} - {self.module.name} - {submodule_name} - {role_name}"