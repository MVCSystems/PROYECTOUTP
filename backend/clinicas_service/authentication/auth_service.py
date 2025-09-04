import requests
import os
import jwt
from django.conf import settings
from datetime import datetime

class AuthServiceClient:
    """Cliente para interactuar con el servicio de autenticación (auth_service)"""
    
    def __init__(self):
        self.base_url = settings.AUTH_SERVICE_URL
        self.service_token = settings.AUTH_SERVICE_TOKEN
    
    def verify_token(self, token):
        """Verifica si un token de usuario es válido"""
        try:
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(f"{self.base_url}/api/auth/verify-token/", headers=headers)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Error verificando token: {str(e)}")
            return None
    
    def verify_module_access(self, token, module_code, submodule_code=None):
        """Verifica si un usuario tiene acceso a un módulo/submódulo específico"""
        try:
            headers = {'Authorization': f'Bearer {token}'}
            data = {
                'module_code': module_code,
                'submodule_code': submodule_code
            }
            
            response = requests.post(
                f"{self.base_url}/api/auth/verify-access/",
                json=data,
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
            return {"has_access": False, "error": "Error de comunicación con auth_service"}
        except Exception as e:
            print(f"Error verificando acceso a módulo: {str(e)}")
            return {"has_access": False, "error": str(e)}
    
    def get_user_info(self, user_id):
        """Obtiene información detallada de un usuario"""
        try:
            headers = {'Authorization': f'Bearer {self.service_token}'}
            response = requests.get(f"{self.base_url}/api/auth/users/{user_id}/", headers=headers)
            
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Error obteniendo información de usuario: {str(e)}")
            return None