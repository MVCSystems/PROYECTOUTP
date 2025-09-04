from rest_framework import serializers
from .models import CustomUser, Module, SubModule, UserModuleAccess
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'name', 'code', 'description', 'is_active']

class SubModuleSerializer(serializers.ModelSerializer):
    module_name = serializers.ReadOnlyField(source='module.name')
    
    class Meta:
        model = SubModule
        fields = ['id', 'module', 'module_name', 'name', 'code', 'description', 'is_active']

class UserModuleAccessSerializer(serializers.ModelSerializer):
    module_name = serializers.ReadOnlyField(source='module.name')
    submodule_name = serializers.ReadOnlyField(source='submodule.name', allow_null=True)
    
    class Meta:
        model = UserModuleAccess
        fields = ['id', 'module', 'module_name', 'submodule', 'submodule_name', 
                 'can_view', 'can_create', 'can_edit', 'can_delete']

class UserSerializer(serializers.ModelSerializer):
    module_access = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 'module_access']
        read_only_fields = ['id']
    
    def get_module_access(self, obj):
        user_module_access = UserModuleAccess.objects.filter(user=obj)
        return UserModuleAccessSerializer(user_module_access, many=True).data

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user or not user.is_active:
            raise serializers.ValidationError("Credenciales incorrectas o usuario inactivo")
        
        refresh = RefreshToken.for_user(user)
        return {
            'user': user,
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

class AssignModuleSerializer(serializers.Serializer):
    module_id = serializers.IntegerField(required=True)
    submodule_id = serializers.IntegerField(required=False, allow_null=True)
    can_view = serializers.BooleanField(default=True)
    can_create = serializers.BooleanField(default=False)
    can_edit = serializers.BooleanField(default=False)
    can_delete = serializers.BooleanField(default=False)