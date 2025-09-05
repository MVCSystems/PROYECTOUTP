import { MessageType, ApiResponse } from "@/types/chatbot";
import { consultoriosApiService } from "@/services/consultorios-api.service";

// Funciones auxiliares para el procesamiento de mensajes
export const chatProcessingService = {
  // Procesamiento local de mensajes
  async handleLocalProcessing(
    userMessage: string,
    context: any,
    setContext: React.Dispatch<React.SetStateAction<any>>,
    updateLastBotMessage: (newText: string, suggestions?: string[]) => void,
    specialties: any[],
    doctors: any[],
    setSelectedSpecialty: React.Dispatch<React.SetStateAction<any>>,
    setDoctors: React.Dispatch<React.SetStateAction<any[]>>,
    setSelectedDoctor: React.Dispatch<React.SetStateAction<any>>,
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>,
    setAvailableTimes: React.Dispatch<React.SetStateAction<string[]>>,
    availableTimes: string[],
    setSelectedTime: React.Dispatch<React.SetStateAction<string>>,
    addMessage: (text: string, sender: 'user' | 'bot', isLoading?: boolean, suggestions?: string[]) => string
  ): Promise<boolean> {
    const messageLower = userMessage.toLowerCase();
    
    // Consulta de especialidades
    if (messageLower.includes('especialidad') || messageLower.includes('ver especialidades')) {
      try {
        const specialtiesData = await consultoriosApiService.getSpecialties();
        
        if (specialtiesData.length > 0) {
          const specialtyNames = specialtiesData.map(s => s.name).join(', ');
          const suggestions = specialtiesData
            .slice(0, Math.min(4, specialtiesData.length))
            .map(s => `Doctores en ${s.name}`);
          
          updateLastBotMessage(
            `Las especialidades disponibles son: ${specialtyNames}. ¿En cuál te gustaría reservar una cita?`,
            [...suggestions, 'Ver todos los doctores']
          );
          
          return true;
        } else {
          updateLastBotMessage(
            'Lo siento, no hay especialidades disponibles en este momento. Por favor, intenta más tarde.',
            ['Ver todos los doctores']
          );
          return true;
        }
      } catch (error) {
        console.error('Error al procesar especialidades:', error);
        updateLastBotMessage(
          'Lo siento, no se pudieron cargar las especialidades. Por favor, verifica tu conexión e intenta nuevamente.',
          ['Reintentar']
        );
        return true;
      }
    }
    
    // Consulta de doctores por especialidad
    let specialtyMatch = specialties.find(s => 
      messageLower.includes(s.name.toLowerCase()) || 
      messageLower.includes(`doctores en ${s.name.toLowerCase()}`)
    );
    
    // Si no encontramos una especialidad exacta, pero mencionan "pediatría", asumimos que es esa especialidad
    if (!specialtyMatch && (messageLower.includes('pediatría') || messageLower.includes('pediatria'))) {
      // Buscar especialidad de pediatría por nombre similar
      const pediatriaMatch = specialties.find(s => 
        s.name.toLowerCase().includes('pediatr') || 
        s.description?.toLowerCase().includes('pediatr') ||
        s.name.toLowerCase() === 'pediatría' || 
        s.name.toLowerCase() === 'pediatria'
      );
      
      if (pediatriaMatch) {
        specialtyMatch = pediatriaMatch;
        console.log('Encontrada especialidad de pediatría:', pediatriaMatch);
      }
    }
    
    if (specialtyMatch || messageLower.includes('doctor') || messageLower.includes('médico')) {
      try {
        let doctorsData;
        
        if (specialtyMatch) {
          setSelectedSpecialty(specialtyMatch);
          try {
            doctorsData = await consultoriosApiService.getDoctorsBySpecialty(specialtyMatch.id);
          } catch (error) {
            console.error('Error al obtener doctores por especialidad:', error);
            // En caso de error, intentamos obtener todos los doctores y filtrarlos
            const allDoctors = await consultoriosApiService.getAllDoctors();
            if (allDoctors && allDoctors.length > 0) {
              doctorsData = allDoctors.filter(d => d.specialty === specialtyMatch.id);
            } else {
              updateLastBotMessage(
                'Lo siento, no se pudieron obtener los doctores para esta especialidad. Por favor, intenta nuevamente.',
                ['Ver especialidades']
              );
              return true;
            }
          }
          
          if (!doctorsData || doctorsData.length === 0) {
            updateLastBotMessage(
              `Lo siento, no hay doctores disponibles para la especialidad de ${specialtyMatch.name} en este momento.`,
              ['Ver otras especialidades']
            );
            return true;
          }
        } else {
          doctorsData = await consultoriosApiService.getAllDoctors();
          if (!doctorsData || doctorsData.length === 0) {
            updateLastBotMessage(
              'Lo siento, no hay doctores disponibles en este momento.',
              ['Ver especialidades']
            );
            return true;
          }
        }
        
        if (doctorsData.length > 0) {
          setDoctors(doctorsData);
          
          const doctorsList = doctorsData
            .map(d => `${d.first_name} ${d.last_name}`)
            .join(', ');
            
          const suggestions = doctorsData
            .slice(0, Math.min(3, doctorsData.length))
            .map(d => `Horarios para Dr. ${d.last_name}`);
            
          updateLastBotMessage(
            specialtyMatch 
              ? `Doctores disponibles en ${specialtyMatch.name}: ${doctorsList}. ¿Con cuál te gustaría agendar?`
              : `Doctores disponibles: ${doctorsList}. ¿Con cuál te gustaría agendar?`,
            [...suggestions, 'Ver especialidades']
          );
          
          return true;
        }
      } catch (error) {
        console.error('Error al procesar doctores:', error);
        updateLastBotMessage(
          'Lo siento, hubo un error al obtener la información de los doctores. Por favor, intenta nuevamente.',
          ['Ver especialidades']
        );
        return true;
      }
    }
    
    // Consulta de horarios para un doctor específico
    const doctorMatch = doctors.find(d => 
      messageLower.includes(`${d.first_name.toLowerCase()}`) || 
      messageLower.includes(`${d.last_name.toLowerCase()}`) ||
      messageLower.includes(`dr. ${d.last_name.toLowerCase()}`) ||
      messageLower.includes(`dra. ${d.last_name.toLowerCase()}`) ||
      messageLower.includes(`horarios para ${d.first_name.toLowerCase()}`) ||
      messageLower.includes(`horarios para ${d.last_name.toLowerCase()}`)
    );
    
    if (doctorMatch || (messageLower.includes('horario') && context.doctor_id)) {
      try {
        const doctorToUse = doctorMatch || doctors.find(d => d.id === context.doctor_id);
        
        if (doctorToUse) {
          setSelectedDoctor(doctorToUse);
          
          // Obtener fechas disponibles de la API
          const availableDates = await consultoriosApiService.getAvailableDates(doctorToUse.id);
          
          if (!availableDates || availableDates.length === 0) {
            updateLastBotMessage(
              `Lo siento, no hay fechas disponibles para ${doctorToUse.first_name} ${doctorToUse.last_name} en este momento.`,
              ['Ver otro doctor', 'Ver especialidades']
            );
            return true;
          }
          
          const formattedDates = availableDates.map(dateObj => {
            return new Date(dateObj.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          });
          
          // Guardar las fechas en el contexto
          setContext({ 
            ...context, 
            doctor_id: doctorToUse.id,
            doctor_nombre: `${doctorToUse.first_name} ${doctorToUse.last_name}`,
            fechas_disponibles: availableDates.map(d => d.date)
          });
          
          const dateSuggestions = availableDates.slice(0, 3).map(dateObj => {
            const formattedDate = new Date(dateObj.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            });
            return `Cita el ${formattedDate}`;
          });
          
          updateLastBotMessage(
            `¿Qué día te gustaría agendar tu cita con ${doctorToUse.first_name} ${doctorToUse.last_name}? Tenemos disponibilidad en los siguientes días: ${formattedDates.join(', ')}`,
            [...dateSuggestions, 'Ver otro doctor']
          );
          
          return true;
        }
      } catch (error) {
        console.error('Error al procesar horarios:', error);
        updateLastBotMessage(
          'Lo siento, hubo un error al obtener los horarios disponibles. Por favor, intenta nuevamente.',
          ['Ver doctores', 'Ver especialidades']
        );
        return true;
      }
    }
    
    // Selección de fecha
    const dateRegex = /\b\d{4}-\d{2}-\d{2}\b/;
    const dateMatch = userMessage.match(dateRegex);
    const dateTextMatch = messageLower.includes('cita el') || messageLower.includes('día') || messageLower.includes('fecha');
    
    // Obtener fecha a partir del mensaje del usuario
    let selectedDate = '';
    
    if (dateMatch) {
      selectedDate = dateMatch[0];
    } else if (dateTextMatch && context.doctor_id && context.fechas_disponibles) {
      // Verificar si el mensaje contiene alguna fecha disponible del contexto
      const monthNames = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      
      const dayNames = [
        'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
      ];
      
      // Intentar encontrar un mes en el mensaje
      const monthMatch = monthNames.find(month => messageLower.includes(month));
      
      // Intentar encontrar un día de la semana en el mensaje
      const dayMatch = dayNames.find(day => messageLower.includes(day));
      
      // Buscar números del 1 al 31 en el mensaje (posibles días del mes)
      const dayNumberMatch = messageLower.match(/\b([1-9]|[12]\d|3[01])\b/);
      
      if (context.fechas_disponibles && context.fechas_disponibles.length > 0) {
        for (const date of context.fechas_disponibles) {
          const dateObj = new Date(date);
          const month = monthNames[dateObj.getMonth()];
          const day = dayNames[dateObj.getDay()];
          const dayNumber = dateObj.getDate();
          
          // Verificar si la fecha coincide con lo que el usuario mencionó
          if (
            (monthMatch && month === monthMatch) ||
            (dayMatch && day === dayMatch) ||
            (dayNumberMatch && parseInt(dayNumberMatch[0]) === dayNumber)
          ) {
            selectedDate = date;
            break;
          }
        }
        
        // Si no se encontró coincidencia pero hay una sugerencia que incluye "Cita el"
        if (!selectedDate && messageLower.includes('cita el') && context.fechas_disponibles.length > 0) {
          // Usar la primera fecha disponible
          selectedDate = context.fechas_disponibles[0];
        }
      }
    }
    
    if (selectedDate && context.doctor_id) {
      try {
        setSelectedDate(selectedDate);
        
        // Obtener horarios disponibles para esa fecha y doctor
        const availableAppointments = await consultoriosApiService.getAvailableAppointments(context.doctor_id, selectedDate);
        
        if (!availableAppointments || !availableAppointments.available || availableAppointments.available.length === 0) {
          updateLastBotMessage(
            `Lo siento, no hay horarios disponibles para la fecha ${selectedDate}. Por favor, elige otra fecha.`,
            ['Ver otras fechas']
          );
          return true;
        }
        
        setAvailableTimes(availableAppointments.available);
        
        // Formatear la fecha para mostrar al usuario
        const formattedDate = new Date(selectedDate).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        // Actualizar contexto
        setContext((prev: any) => ({
          ...prev,
          fecha: selectedDate,
          horarios_disponibles: availableAppointments.available.map((hora: string) => ({
            id: Math.floor(Math.random() * 1000) + 1,
            doctor_id: context.doctor_id,
            fecha: selectedDate,
            hora,
            disponible: true
          }))
        }));
        
        // Crear sugerencias de horarios
        const timeSuggestions = availableAppointments.available
          .slice(0, Math.min(5, availableAppointments.available.length))
          .map((time: string) => `Cita a las ${time}`);
        
        updateLastBotMessage(
          `Para el ${formattedDate} con ${context.doctor_nombre}, tenemos los siguientes horarios disponibles: ${availableAppointments.available.join(', ')}. ¿Qué horario prefieres?`,
          [...timeSuggestions, 'Ver otra fecha']
        );
        
        return true;
      } catch (error) {
        console.error('Error al procesar la fecha seleccionada:', error);
        updateLastBotMessage(
          'Lo siento, hubo un error al obtener los horarios para la fecha seleccionada. Por favor, intenta nuevamente.',
          ['Ver fechas disponibles', 'Ver doctores']
        );
        return true;
      }
    }
    
    // Selección de horario
    const timeRegex = /\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/;
    const timeMatch = userMessage.match(timeRegex);
    const timeTextMatch = messageLower.includes('cita a las') || messageLower.includes('horario') || messageLower.includes(' a las ');
    
    // Obtener horario a partir del mensaje del usuario
    let selectedTime = '';
    
    if (timeMatch) {
      selectedTime = timeMatch[0];
    } else if (timeTextMatch && context.horarios_disponibles && context.horarios_disponibles.length > 0) {
      // Extraer horas mencionadas en el mensaje (9, 10, 11, etc.)
      const hourMatch = messageLower.match(/\b([0-9]|1[0-9]|2[0-3])\b/);
      
      if (hourMatch) {
        const hour = parseInt(hourMatch[0]);
        
        // Buscar un horario disponible que coincida con la hora mencionada
        for (const horario of context.horarios_disponibles) {
          const horarioHour = parseInt(horario.hora.split(':')[0]);
          if (horarioHour === hour) {
            selectedTime = horario.hora;
            break;
          }
        }
      }
      
      // Si no se encontró coincidencia pero hay una sugerencia que incluye "Cita a las"
      if (!selectedTime && messageLower.includes('cita a las') && context.horarios_disponibles.length > 0) {
        // Usar el primer horario disponible
        selectedTime = context.horarios_disponibles[0].hora;
      }
    }
    
    if (selectedTime && context.doctor_id && context.fecha) {
      try {
        // Verificar que el horario esté disponible
        const isAvailable = context.horarios_disponibles && context.horarios_disponibles.some((h: any) => h.hora === selectedTime);
        
        if (!isAvailable) {
          updateLastBotMessage(
            `Lo siento, el horario ${selectedTime} no está disponible. Por favor, elige otro de los horarios disponibles.`,
            ['Ver horarios disponibles']
          );
          return true;
        }
        
        setSelectedTime(selectedTime);
        
        // Formatear fecha y hora para mostrar al usuario
        const formattedDate = new Date(context.fecha).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        // Actualizar contexto
        setContext((prev: any) => ({
          ...prev,
          hora: selectedTime,
          reserva_confirmada: true
        }));
        
        // Intentar reservar la cita
        try {
          // Llamar a la API para reservar la cita
          const reservationResponse = await consultoriosApiService.reserveAppointment(
            context.doctor_id, 
            context.fecha, 
            selectedTime
          );
          
          if (reservationResponse && reservationResponse.success) {
            updateLastBotMessage(
              `¡Perfecto! Tu cita ha sido reservada con ${context.doctor_nombre} para el ${formattedDate} a las ${selectedTime}. Te enviaremos un recordatorio 24 horas antes. ¿Puedo ayudarte con algo más?`,
              ['Ver mis citas', 'Reservar otra cita', 'No, gracias']
            );
          } else {
            updateLastBotMessage(
              `Lo siento, no se pudo completar la reserva. Por favor, intenta nuevamente o elige otro horario.`,
              ['Ver horarios disponibles', 'Ver otro doctor']
            );
          }
        } catch (error) {
          console.error('Error al reservar la cita:', error);
          updateLastBotMessage(
            'Lo siento, hubo un error al procesar tu reserva. Por favor, intenta nuevamente.',
            ['Ver horarios disponibles', 'Ver otro doctor']
          );
        }
        
        return true;
      } catch (error) {
        console.error('Error al procesar el horario seleccionado:', error);
        updateLastBotMessage(
          'Lo siento, hubo un error al confirmar el horario seleccionado. Por favor, intenta nuevamente.',
          ['Ver horarios disponibles', 'Ver doctores']
        );
        return true;
      }
    }
    
    return false;
  },

  handleFallbackResponse(
    userMessage: string,
    context: any,
    specialties: any[],
    doctors: any[],
    availableTimes: string[],
    addMessage: (text: string, sender: 'user' | 'bot', isLoading?: boolean, suggestions?: string[]) => string
  ): void {
    // Mensaje informando del error
    addMessage(
      'Lo siento, no puedo procesar tu solicitud en este momento porque los servicios no están disponibles. Por favor, verifica tu conexión o intenta más tarde.',
      'bot',
      false,
      ['Reintentar', 'Ver ayuda']
    );
  }
};
