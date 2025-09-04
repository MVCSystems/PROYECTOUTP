from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from .models import CustomUser, Module, SubModule, UserModuleAccess
from .serializers import (
    UserSerializer, UserCreateSerializer, ModuleSerializer, 
    SubModuleSerializer, UserModuleAccessSerializer, LoginSerializer,
    AssignModuleSerializer
)

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]

class SubModuleViewSet(viewsets.ModelViewSet):
    queryset = SubModule.objects.all()
    serializer_class = SubModuleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = SubModule.objects.all()
        module_id = self.request.query_params.get('module_id')
        if module_id:
            queryset = queryset.filter(module_id=module_id)
        return queryset

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=True, methods=['post'])
    def assign_module(self, request, pk=None):
        user = self.get_object()
        serializer = AssignModuleSerializer(data=request.data)
        
        if serializer.is_valid():
            module_id = serializer.validated_data['module_id']
            submodule_id = serializer.validated_data.get('submodule_id')
            
            try:
                module = Module.objects.get(id=module_id)
                submodule = None
                
                if submodule_id:
                    submodule = SubModule.objects.get(id=submodule_id, module=module)
                
                # Crear o actualizar el acceso
                access, created = UserModuleAccess.objects.update_or_create(
                    user=user,
                    module=module,
                    submodule=submodule,
                    defaults={
                        'can_view': serializer.validated_data.get('can_view', True),
                        'can_create': serializer.validated_data.get('can_create', False),
                        'can_edit': serializer.validated_data.get('can_edit', False),
                        'can_delete': serializer.validated_data.get('can_delete', False),
                    }
                )
                
                return Response(
                    UserModuleAccessSerializer(access).data,
                    status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
                )
            
            except Module.DoesNotExist:
                return Response(
                    {"error": "Módulo no encontrado"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            except SubModule.DoesNotExist:
                return Response(
                    {"error": "Submódulo no encontrado o no pertenece al módulo especificado"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def remove_module(self, request, pk=None):
        user = self.get_object()
        module_id = request.data.get('module_id')
        submodule_id = request.data.get('submodule_id')
        
        if not module_id:
            return Response(
                {"error": "Se requiere module_id"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        filters = {
            'user': user,
            'module_id': module_id
        }
        
        if submodule_id:
            filters['submodule_id'] = submodule_id
        
        deleted, _ = UserModuleAccess.objects.filter(**filters).delete()
        
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response(
            {"error": "No se encontró el acceso especificado"}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        return Response({
            'user': UserSerializer(data['user']).data,
            'refresh': data['refresh'],
            'access': data['access']
        })
    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    return Response(UserSerializer(request.user).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_module_access(request):
    """Verifica si el usuario tiene acceso a un módulo/submódulo específico"""
    user = request.user
    module_code = request.data.get('module_code')
    submodule_code = request.data.get('submodule_code')
    
    if not module_code:
        return Response(
            {"error": "Se requiere module_code"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        module = Module.objects.get(code=module_code)
        filters = {
            'user': user,
            'module': module,
        }
        
        if submodule_code:
            try:
                submodule = SubModule.objects.get(code=submodule_code, module=module)
                filters['submodule'] = submodule
            except SubModule.DoesNotExist:
                return Response(
                    {"has_access": False, "error": "Submódulo no encontrado"}
                )
        
        # Verificar acceso directo
        access = UserModuleAccess.objects.filter(**filters).first()
        
        # Si no hay acceso directo, verificar acceso general al módulo (sin submódulo específico)
        if not access and submodule_code:
            access = UserModuleAccess.objects.filter(user=user, module=module, submodule=None).first()
        
        if access:
            return Response({
                "has_access": True,
                "permissions": {
                    "can_view": access.can_view,
                    "can_create": access.can_create,
                    "can_edit": access.can_edit,
                    "can_delete": access.can_delete
                }
            })
        
        return Response({"has_access": False})
    
    except Module.DoesNotExist:
        return Response(
            {"has_access": False, "error": "Módulo no encontrado"}
        )