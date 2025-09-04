from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from clinicas.views import (
    ClinicaViewSet, EspecialidadViewSet, DoctorViewSet,
    PacienteViewSet, CitaViewSet
)

router = DefaultRouter()
router.register(r'clinicas', ClinicaViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'doctores', DoctorViewSet)
router.register(r'pacientes', PacienteViewSet)
router.register(r'citas', CitaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/clinicas/', include('api_chat.urls')), 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)