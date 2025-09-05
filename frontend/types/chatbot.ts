// Definir tipos para los mensajes y el estado del chat
export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  suggestions?: string[];
};

export type ApiResponse = {
  respuesta: string;
  sugerencias?: string[];
  contexto_actualizado?: any;
};

// Interfaces para las respuestas de la API de consultorios
export interface Specialty {
  id: number;
  name: string;
  description: string;
}

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialty: number;
  clinic: number;
  active: boolean;
}

export interface DoctorSchedule {
  id: number;
  doctor: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active: boolean;
}

export interface Appointment {
  id?: number;
  clinic: number;
  doctor: number;
  patient: number;
  service?: number;
  appointment_date: string;
  date: string;
  status?: string;
  notes?: string;
}

export interface AvailableDate {
  id?: number;
  doctor: number;
  date: string;
  available: boolean;
}
