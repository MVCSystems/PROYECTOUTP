from django.contrib import admin
from .models import CustomUser, Module, SubModule, UserModuleAccess, Role

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'is_active')

@admin.register(SubModule)
class SubModuleAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'module', 'is_active')
    list_filter = ('module', 'is_active')

@admin.register(UserModuleAccess)
class UserModuleAccessAdmin(admin.ModelAdmin):
    list_display = ('user', 'module', 'submodule', 'can_view', 'can_create', 'can_edit', 'can_delete')
    list_filter = ('module', 'can_view', 'can_create', 'can_edit', 'can_delete')

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)