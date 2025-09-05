import { Specialty, Doctor, DoctorSchedule, Appointment, AvailableDate } from "@/types/chatbot";

// API Service para interactuar con los endpoints de consultorios
class ConsultoriosApiService {
  // URL base
  private readonly baseUrl: string = 'http://localhost:8002'; // Se quitó la barra al final
  
  // Función genérica para hacer llamadas a la API
  async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      console.log(`Llamando a API: ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        console.error(`Error API: ${response.status} - ${response.statusText}`);
        throw new Error(`Error API: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Respuesta de ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }
  
  // Obtener todas las especialidades
  async getSpecialties(): Promise<Specialty[]> {
    console.log("Solicitando especialidades...");
    const specialties = await this.fetchApi<Specialty[]>('/api/specialties/');
    console.log("Especialidades recibidas:", specialties);
    return specialties;
  }
  
  // Obtener doctores por especialidad
  async getDoctorsBySpecialty(specialtyId: number): Promise<Doctor[]> {
    console.log(`Solicitando doctores para especialidad ${specialtyId}...`);
    const doctors = await this.fetchApi<Doctor[]>(`/api/doctors/?specialty=${specialtyId}`);
    console.log(`Doctores para especialidad ${specialtyId}:`, doctors);
    return doctors;
  }
  
  // Obtener todos los doctores
  async getAllDoctors(): Promise<Doctor[]> {
    console.log("Solicitando todos los doctores...");
    const doctors = await this.fetchApi<Doctor[]>('/api/doctors/');
    console.log("Todos los doctores:", doctors);
    return doctors;
  }
  
  // Obtener horarios disponibles por doctor
  async getDoctorSchedules(doctorId: number): Promise<DoctorSchedule[]> {
    console.log(`Solicitando horarios para doctor ${doctorId}...`);
    const schedules = await this.fetchApi<DoctorSchedule[]>(`/api/schedules/?doctor=${doctorId}&active=true`);
    console.log(`Horarios para doctor ${doctorId}:`, schedules);
    return schedules;
  }
  
  // Crear una nueva cita
  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    console.log("Creando cita:", appointmentData);
    const appointment = await this.fetchApi<Appointment>('/api/appointments/', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
    console.log("Cita creada:", appointment);
    return appointment;
  }
  
  // Obtener citas disponibles para un doctor en una fecha específica
  async getAvailableAppointments(doctorId: number, date: string): Promise<{available: string[]}> {
    try {
      console.log(`Obteniendo horarios disponibles para doctor ${doctorId} en fecha ${date}...`);
      
      // Obtener los horarios del doctor para el día de la semana
      const schedules = await this.getDoctorSchedules(doctorId);
      
      // Obtener las citas ya programadas para ese doctor y fecha
      const bookedAppointments = await this.fetchApi<any[]>(`/api/appointments/?doctor=${doctorId}&date=${date}`);
      console.log(`Citas programadas para doctor ${doctorId} en fecha ${date}:`, bookedAppointments);
      
      // Calcular día de la semana (0=domingo, 6=sábado)
      const dayOfWeek = new Date(date).getDay();
      console.log(`Día de la semana para ${date}: ${dayOfWeek}`);
      
      // Filtrar horarios por día de la semana (0=lunes, 6=domingo)
      // Ajustamos el día de la semana porque getDay devuelve 0 para domingo
      const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      console.log(`Día de la semana ajustado: ${adjustedDayOfWeek}`);
      
      const daySchedules = schedules.filter(s => s.day_of_week === adjustedDayOfWeek);
      console.log(`Horarios filtrados para día ${adjustedDayOfWeek}:`, daySchedules);
      
      if (!daySchedules.length) {
        console.log(`No hay horarios definidos para el día ${adjustedDayOfWeek}`);
        return { available: [] };
      }
      
      // Generar slots de tiempo disponibles (asumiendo citas de 30 minutos)
      const availableSlots: string[] = [];
      const bookedTimes = bookedAppointments.map((a: any) => {
        const dateObj = new Date(a.appointment_date);
        return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
      });
      
      console.log(`Horarios ya reservados:`, bookedTimes);
      
      daySchedules.forEach(schedule => {
        console.log(`Procesando horario: ${schedule.start_time} - ${schedule.end_time}`);
        
        const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
        const [endHour, endMinute] = schedule.end_time.split(':').map(Number);
        
        let currentHour = startHour;
        let currentMinute = startMinute;
        
        // Generar slots de 30 minutos
        while (
          (currentHour < endHour) || 
          (currentHour === endHour && currentMinute < endMinute)
        ) {
          const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
          
          if (!bookedTimes.includes(timeString)) {
            availableSlots.push(timeString);
          }
          
          // Avanzar 30 minutos
          currentMinute += 30;
          if (currentMinute >= 60) {
            currentHour += 1;
            currentMinute -= 60;
          }
        }
      });
      
      console.log(`Horarios disponibles generados:`, availableSlots);
      return { available: availableSlots };
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error);
      return { available: [] };
    }
  }
  
  // Obtener fechas disponibles para un doctor en los próximos 30 días
  async getAvailableDates(doctorId: number): Promise<AvailableDate[]> {
    try {
      console.log(`Solicitando fechas disponibles para doctor ${doctorId}...`);
      const dates = await this.fetchApi<AvailableDate[]>(`/api/available-dates/?doctor=${doctorId}`);
      console.log(`Fechas disponibles para doctor ${doctorId}:`, dates);
      return dates;
    } catch (error) {
      console.error('Error al obtener fechas disponibles:', error);
      return [];
    }
  }

  // Reservar una cita
  async reserveAppointment(doctorId: number, date: string, time: string): Promise<{success: boolean, message?: string, appointmentId?: number}> {
    try {
      console.log(`Reservando cita para doctor ${doctorId} en fecha ${date} a las ${time}...`);
      
      const appointmentData = {
        doctor: doctorId,
        appointment_date: `${date}T${time}:00`,
        patient_name: 'Usuario del Chat',
        patient_email: 'usuario@example.com',
        patient_phone: '123456789',
        notes: 'Reservado a través del chatbot'
      };
      
      console.log('Datos de la cita:', appointmentData);
      
      const result = await this.createAppointment(appointmentData);
      console.log('Resultado de la reserva:', result);
      
      return { 
        success: true, 
        message: 'Cita reservada con éxito',
        appointmentId: result.id
      };
    } catch (error) {
      console.error('Error al reservar cita:', error);
      return { 
        success: false, 
        message: 'No se pudo reservar la cita. Por favor, inténtalo de nuevo.' 
      };
    }
  }
}

export const consultoriosApiService = new ConsultoriosApiService();