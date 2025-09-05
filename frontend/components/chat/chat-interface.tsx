import React, { useState, useEffect, useRef } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageType, AvailableDate } from "@/types/chatbot";
import { consultoriosApiService } from "@/services/consultorios-api.service";
import { chatProcessingService } from "@/services/chat-processing.service";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import Suggestions from "./suggestions";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: `init-${Math.random().toString(36).substring(2, 9)}`,
      text: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: ["Reservar una cita", "Ver especialidades", "Buscar doctor"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<any>({});
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<any | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Cargar especialidades al inicio
  useEffect(() => {
    loadSpecialties();
  }, []);
  
  // Desactivamos el scroll automático
  useEffect(() => {
    // No hacer nada automáticamente
  }, [messages]);

  // Cargar especialidades médicas solo de la API
  const loadSpecialties = async () => {
    try {
      const data = await consultoriosApiService.getSpecialties();
      if (data && data.length > 0) {
        setSpecialties(data);
        console.log('Especialidades cargadas:', data);
      } else {
        // No hay datos de respaldo, se informa en consola
        console.error('La API no devolvió especialidades médicas');
        setSpecialties([]);
        // Informar al usuario que no hay especialidades disponibles
        addMessage('Lo siento, no hay especialidades médicas disponibles en este momento. Por favor, intenta más tarde.', 'bot');
      }
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
      setSpecialties([]);
      // Informar al usuario sobre el error
      addMessage('Lo siento, no se pudieron cargar las especialidades médicas. Por favor, verifica tu conexión e intenta nuevamente.', 'bot');
    }
  };

  // Cargar doctores por especialidad solo de la API
  const loadDoctorsBySpecialty = async (specialtyId: number) => {
    try {
      console.log(`Solicitando doctores para especialidad ${specialtyId}`);
      const data = await consultoriosApiService.getDoctorsBySpecialty(specialtyId);
      console.log(`Doctores recibidos para especialidad ${specialtyId}:`, data);
      
      if (data && data.length > 0) {
        setDoctors(data);
        return data;
      } else {
        console.error(`No se encontraron doctores para la especialidad ${specialtyId}`);
        setDoctors([]);
        // Informar al usuario que no hay doctores disponibles
        addMessage(`Lo siento, no hay doctores disponibles para esta especialidad en este momento.`, 'bot');
        return [];
      }
    } catch (error) {
      console.error('Error al cargar doctores:', error);
      setDoctors([]);
      // Informar al usuario sobre el error
      addMessage('Lo siento, no se pudieron cargar los doctores. Por favor, verifica tu conexión e intenta nuevamente.', 'bot');
      return [];
    }
  };

  // Cargar horarios disponibles solo de la API
  const loadAvailableAppointments = async (doctorId: number, date: string) => {
    try {
      const data = await consultoriosApiService.getAvailableAppointments(doctorId, date);
      console.log(`Horarios recibidos para doctor ${doctorId} en fecha ${date}:`, data);
      
      if (data && data.available && data.available.length > 0) {
        setAvailableTimes(data.available);
        return data.available;
      } else {
        console.error(`No hay horarios disponibles para el doctor ${doctorId} en la fecha ${date}`);
        setAvailableTimes([]);
        // Informar al usuario que no hay horarios disponibles
        addMessage(`Lo siento, no hay horarios disponibles para esta fecha. Por favor, selecciona otra fecha.`, 'bot');
        return [];
      }
    } catch (error) {
      console.error('Error al cargar horarios disponibles:', error);
      setAvailableTimes([]);
      // Informar al usuario sobre el error
      addMessage('Lo siento, no se pudieron cargar los horarios disponibles. Por favor, verifica tu conexión e intenta nuevamente.', 'bot');
      return [];
    }
  };
  
  // Cargar fechas disponibles para un doctor solo de la API
  const loadAvailableDates = async (doctorId: number) => {
    try {
      const data = await consultoriosApiService.getAvailableDates(doctorId);
      console.log(`Fechas recibidas para doctor ${doctorId}:`, data);
      
      if (data && data.length > 0) {
        setAvailableDates(data);
        return data;
      } else {
        console.error(`No hay fechas disponibles para el doctor ${doctorId}`);
        setAvailableDates([]);
        // Informar al usuario que no hay fechas disponibles
        addMessage(`Lo siento, no hay fechas disponibles para este doctor en este momento.`, 'bot');
        return [];
      }
    } catch (error) {
      console.error('Error al cargar fechas disponibles:', error);
      setAvailableDates([]);
      // Informar al usuario sobre el error
      addMessage('Lo siento, no se pudieron cargar las fechas disponibles. Por favor, verifica tu conexión e intenta nuevamente.', 'bot');
      return [];
    }
  };

  const addMessage = (text: string, sender: 'user' | 'bot', isLoading = false, suggestions?: string[]) => {
    const newMessage: MessageType = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text,
      sender,
      timestamp: new Date(),
      isLoading,
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateLastBotMessage = (newText: string, suggestions?: string[]) => {
    setMessages(prev => {
      const newMessages = [...prev];
      for (let i = newMessages.length - 1; i >= 0; i--) {
        if (newMessages[i].sender === 'bot' && newMessages[i].isLoading) {
          newMessages[i] = {
            ...newMessages[i],
            text: newText,
            isLoading: false,
            suggestions
          };
          break;
        }
      }
      return newMessages;
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Agregar mensaje del usuario
    addMessage(inputValue, 'user');
    
    // Limpiar input
    const userMessage = inputValue;
    setInputValue('');
    
    // Indicar que el bot está escribiendo
    setIsTyping(true);
    const loadingMsgId = addMessage('...', 'bot', true);
    
    try {
      // Primero intentamos procesar la entrada localmente
      const processLocally = await chatProcessingService.handleLocalProcessing(
        userMessage,
        context,
        setContext,
        updateLastBotMessage,
        specialties,
        doctors,
        setSelectedSpecialty,
        setDoctors,
        setSelectedDoctor,
        setSelectedDate,
        setAvailableTimes,
        availableTimes,
        setSelectedTime,
        addMessage
      );
      
      if (processLocally) {
        setIsTyping(false);
        return;
      }
      
      // Si no se pudo procesar localmente, llamamos a la API del chatbot
      try {
        const response = await fetch('http://localhost:8003/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mensaje: userMessage,
            contexto: context
          }),
        });
        
        if (!response.ok) {
          throw new Error('Error en la comunicación con el chatbot');
        }
        
        const data = await response.json();
        
        // Actualizar el mensaje del bot con la respuesta real
        updateLastBotMessage(data.respuesta, data.sugerencias);
        
        // Actualizar el contexto para la siguiente interacción
        if (data.contexto_actualizado) {
          setContext(data.contexto_actualizado);
        }
      } catch (apiError) {
        console.error('Error al comunicarse con la API del chatbot:', apiError);
        throw apiError; // Propagar el error para el manejo general
      }
    } catch (error) {
      console.error('Error general en el procesamiento del mensaje:', error);
      
      // Mensaje de error amigable
      updateLastBotMessage(
        'Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento. Por favor, verifica que los servicios estén disponibles e intenta nuevamente.',
        ["Reservar una cita", "Ver especialidades", "Buscar doctor"]
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Manejar clic en una sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleReset = () => {
    // Reiniciar todos los estados
    setContext({});
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);
    setAvailableDates([]);
    
    // Reiniciar el chat con mensaje inicial
    setMessages([{
      id: `init-${Math.random().toString(36).substring(2, 9)}`,
      text: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: ["Reservar una cita", "Ver especialidades", "Buscar doctor"]
    }]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Encabezado del chat */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/80 to-primary flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-background" />
          <h3 className="font-medium text-background">Asistente de Citas Médicas</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="hover:bg-primary-foreground/10 text-background"
          >
            <X className="h-4 w-4 mr-1" /> Reiniciar
          </Button>
        </div>
      </div>
      
      {/* Cuerpo del chat - mensajes */}
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      
      {/* Sugerencias */}
      {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].suggestions && (
        <Suggestions 
          suggestions={messages[messages.length - 1].suggestions} 
          onSuggestionClick={handleSuggestionClick} 
        />
      )}
      
      {/* Input de mensaje */}
      <MessageInput 
        inputValue={inputValue}
        isTyping={isTyping}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatInterface;
