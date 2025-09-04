from django.urls import path
from .chat_endpoints import (
    get_especialidades, get_doctores_por_especialidad,
    get_horarios_disponibles, crear_cita_chatbot
)

urlpatterns = [
    # Endpoints públicos para el chatbot
    path('public/especialidades/', get_especialidades, name='get-especialidades'),
    path('public/doctores/especialidad/<int:especialidad_id>/', get_doctores_por_especialidad, name='get-doctores-por-especialidad'),
    path('public/horarios-disponibles/doctor/<int:doctor_id>/', get_horarios_disponibles, name='get-horarios-disponibles'),
    path('public/crear-cita/', crear_cita_chatbot, name='crear-cita-chatbot'),
]