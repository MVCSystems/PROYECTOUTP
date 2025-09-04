from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'modules', views.ModuleViewSet)
router.register(r'submodules', views.SubModuleViewSet)

urlpatterns = [
    # Rutas de API con router
    path('', include(router.urls)),
    
    # Autenticación
    path('register/', views.register_user, name='register'),
    path('login/', views.login, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.user_profile, name='user_profile'),
    
    # Verificación de acceso
    path('verify-access/', views.verify_module_access, name='verify_access'),
]