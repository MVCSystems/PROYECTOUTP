"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  User, 
  Send, 
  Bot, 
  Stethoscope, 
  X, 
  MessageSquareText
} from "lucide-react";
import { useChatbot } from "./chat/chatbot-context";

// Tipos
interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
}

interface AppointmentData {
  specialty?: string;
  date?: string;
  time?: string;
  reason?: string;
  contact?: string;
}

// Componentes UI
const ChatMessage = ({ message }: { message: Message }) => {
  // Solo mostramos los mensajes del bot
  if (!message.isBot) return null;
  
  return (
    <div className="py-3 px-4 bg-accent rounded-md">
      <p className="text-sm text-accent-foreground">{message.content}</p>
    </div>
  );
};

const ChatOptions = ({
  options,
  onOptionClick,
}: {
  options: string[];
  onOptionClick: (option: string) => void;
}) => (
  <div className="flex flex-col gap-2 mt-3" role="group" aria-label="Opciones">
    {options.map((option, index) => (
      <Button
        key={index}
        variant="outline"
        className="w-full justify-start text-left py-3 px-4 rounded-xl bg-muted border-border hover:bg-secondary/10 transition-colors text-sm text-foreground shadow-sm"
        onClick={() => onOptionClick(option)}
        tabIndex={0}
      >
        {option}
      </Button>
    ))}
  </div>
);

const ChatInput = ({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => (
  <div className="border-t border-border p-3 bg-card transition-colors duration-300">
    <form onSubmit={onSubmit} className="flex gap-2 items-center">
      <Input
        value={value}
        onChange={onChange}
        placeholder="Cuéntanos cómo podemos ayudarte..."
        className="flex-1 h-10 text-sm border-border rounded-xl focus-visible:ring-ring"
      />
      <Button
        type="submit"
        disabled={!value.trim()}
        size="icon"
        className="h-10 w-10 rounded-xl bg-secondary hover:bg-secondary/90"
      >
        <Send className="h-4 w-4 text-secondary-foreground" />
      </Button>
    </form>
    <p className="text-[10px] text-muted-foreground mt-2 text-center">
      La IA puede producir información inexacta
    </p>
  </div>
);

// Componente principal
export function FloatingChatbot() {
  const { isOpen, openChatbot, closeChatbot } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Asistente de Citas Médicas. ¿En qué puedo ayudarte?",
      isBot: true,
      timestamp: new Date(),
      options: [
        "Quiero agendar una cita",
        "Necesito reagendar mi cita",
        "Quiero cancelar mi cita",
        "Ver mis próximas citas",
        "Especialidades disponibles"
      ],
    },
  ]);
  const [commonQuestions] = useState([
    "Quiero agendar una cita médica",
    "¿Qué especialidades tienen disponibles?",
    "Necesito ayuda para elegir un médico"
  ]);
  const [inputValue, setInputValue] = useState("");
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({});
  const [currentStep, setCurrentStep] = useState("inicio");

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simular respuesta del bot (500ms)
    setTimeout(() => {
      handleBotResponse(content);
    }, 500);
  };

  const handleBotResponse = (userInput: string) => {
    let botResponse: Message;
    const updatedData = { ...appointmentData };

    switch (currentStep) {
      case "inicio":
        if (userInput.toLowerCase().includes("agendar")) {
          botResponse = {
            id: Date.now().toString(),
            content: "¿Qué especialidad médica necesitas?",
            isBot: true,
            timestamp: new Date(),
            options: [
              "Medicina General",
              "Cardiología",
              "Dermatología", 
              "Pediatría",
              "Ginecología",
              "Otra especialidad"
            ],
          };
          setCurrentStep("specialty");
        } else if (userInput.toLowerCase().includes("reagendar") || userInput.toLowerCase().includes("cambiar")) {
          botResponse = {
            id: Date.now().toString(),
            content: "Para reagendar tu cita, necesito algunos datos. ¿Podrías proporcionarme el número de cita o fecha?",
            isBot: true,
            timestamp: new Date(),
          };
          setCurrentStep("reagendar");
        } else if (userInput.toLowerCase().includes("cancelar")) {
          botResponse = {
            id: Date.now().toString(),
            content: "Lamento que necesites cancelar tu cita. ¿Podrías indicarme el número de cita o la fecha programada?",
            isBot: true,
            timestamp: new Date(),
          };
          setCurrentStep("cancelar");
        } else if (userInput.toLowerCase().includes("próximas") || userInput.toLowerCase().includes("mis citas")) {
          botResponse = {
            id: Date.now().toString(),
            content: "Para ver tus citas programadas, necesito verificar tu identidad. ¿Podrías proporcionarme tu número de documento?",
            isBot: true,
            timestamp: new Date(),
          };
          setCurrentStep("verificar");
        } else if (userInput.toLowerCase().includes("especialidades")) {
          botResponse = {
            id: Date.now().toString(),
            content: "Contamos con las siguientes especialidades médicas:",
            isBot: true,
            timestamp: new Date(),
            options: [
              "Medicina General",
              "Cardiología",
              "Dermatología",
              "Pediatría",
              "Ginecología",
              "Traumatología",
              "Oftalmología",
              "Ver todas las especialidades"
            ],
          };
          setCurrentStep("mostrar_especialidades");
        } else {
          botResponse = {
            id: Date.now().toString(),
            content: "¿En qué más puedo ayudarte?",
            isBot: true,
            timestamp: new Date(),
            options: [
              "Agendar cita",
              "Ver especialidades",
              "Contactar a un asesor",
              "Información de horarios"
            ],
          };
          setCurrentStep("inicio");
        }
        break;

      case "specialty":
        updatedData.specialty = userInput;
        setAppointmentData(updatedData);
        botResponse = {
          id: Date.now().toString(),
          content: "¿Qué día prefieres para tu cita?",
          isBot: true,
          timestamp: new Date(),
          options: [
            "Hoy",
            "Mañana",
            "Esta semana",
            "Próxima semana"
          ],
        };
        setCurrentStep("date");
        break;

      case "date":
        updatedData.date = userInput;
        setAppointmentData(updatedData);
        botResponse = {
          id: Date.now().toString(),
          content: "Selecciona el horario que prefieres:",
          isBot: true,
          timestamp: new Date(),
          options: ["Mañana (8-12h)", "Tarde (14-18h)", "Noche (18-20h)"],
        };
        setCurrentStep("time");
        break;

      default:
        botResponse = {
          id: Date.now().toString(),
          content: "¿En qué más puedo ayudarte?",
          isBot: true,
          timestamp: new Date(),
          options: [
            "Agendar cita",
            "Ver especialidades",
            "Contactar a un asesor"
          ],
        };
    }

    setMessages((prev) => [...prev, botResponse]);
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-5 right-5 z-50">
        <Button
          onClick={() => (isOpen ? closeChatbot() : openChatbot())}
          size="lg"
          className="h-14 w-14 rounded-full shadow-xl transition-all duration-300 bg-secondary hover:bg-secondary/90"
          aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-5 w-5 text-secondary-foreground" />
          ) : (
            <div className="relative">
              <Bot className="h-5 w-5 text-secondary-foreground" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-accent-foreground rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-accent-foreground rounded-full" />
            </div>
          )}
        </Button>
      </div>

      {/* Ventana del chat */}
      {isOpen && (
        <div
          id="chatbot-window"
          className="fixed bottom-24 right-5 z-40 w-80 max-h-[calc(100vh-120px)] shadow-xl rounded-lg overflow-hidden bg-background border border-border transition-colors duration-300"
        >
          <div className="flex flex-col h-full max-h-[600px]">
            {/* Header */}
            <div className="bg-card border-b border-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-secondary/10 p-1.5 rounded-full">
                  <Stethoscope className="h-5 w-5 text-secondary" />
                </div>
                <h1 className="font-medium text-card-foreground">Asistente Médico</h1>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-muted"
                  onClick={closeChatbot}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto bg-muted p-4 space-y-4 transition-colors duration-300">
              {/* Mensaje principal */}
              <div className="bg-accent p-4 rounded-md">
                <p className="text-sm text-accent-foreground">
                  {messages[0].content}
                </p>
              </div>

              {/* Preguntas comunes */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground px-1">Las preguntas más comunes son:</p>
                {commonQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left py-3 px-4 rounded-lg bg-card border-border hover:bg-secondary/10 text-sm text-card-foreground"
                    onClick={() => handleOptionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>

              {/* Mensajes y opciones */}
              {messages.length > 1 && messages.slice(1).map((message) => (
                <div key={message.id} className="space-y-2">
                  <ChatMessage message={message} />
                  {message.options && (
                    <ChatOptions
                      options={message.options}
                      onOptionClick={handleOptionClick}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Input area */}
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </>
  );
}
