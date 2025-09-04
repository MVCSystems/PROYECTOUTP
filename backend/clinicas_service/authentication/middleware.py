from django.http import JsonResponse
from .auth_service import AuthServiceClient

class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.auth_client = AuthServiceClient()
        
        # Rutas que no requieren autenticación
        self.public_paths = [
            '/api/docs',
            '/api/schema',
            '/admin',
            '/api/clinicas/public'
        ]
    
    def __call__(self, request):
        # Verificar si es una ruta pública
        if any(request.path_info.startswith(path) for path in self.public_paths):
            return self.get_response(request)
        
        # Verificar si hay un token de autenticación
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({
                'error': 'No se proporcionó un token de autenticación válido'
            }, status=401)
        
        token = auth_header.replace('Bearer ', '')
        
        # Verificar el token con auth_service
        user_data = self.auth_client.verify_token(token)
        if not user_data:
            return JsonResponse({
                'error': 'Token inválido o expirado'
            }, status=401)
        
        # Verificar acceso al módulo clinicas_service
        access_data = self.auth_client.verify_module_access(token, 'clinicas_service')
        if not access_data.get('has_access', False):
            return JsonResponse({
                'error': 'No tienes acceso al módulo de clínicas'
            }, status=403)
        
        # Agregar los datos del usuario a la solicitud
        request.user_data = user_data
        request.user_permissions = access_data.get('permissions', {})
        
        return self.get_response(request)