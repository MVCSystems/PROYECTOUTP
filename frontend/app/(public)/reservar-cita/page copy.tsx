"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/chat/chatbot-context";

export default function ReservaCitaPage() {
  // Aplicar el mismo estilo de fondo que en el Hero
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openChatbot } = useChatbot();

  useEffect(() => {
    // Mostrar el modal automáticamente al cargar la página
    setIsModalOpen(true);
  }, []);

  const handleStartChat = () => {
    setIsModalOpen(false);
    openChatbot();
  };

  return (
    <section
      className="relative pt-8 lg:pt-16 pb-12 lg:pb-16"
      style={{
        background: "linear-gradient(to bottom right, var(--muted), var(--background), var(--muted))"
      }}
    >
      <div className="container mx-auto px-4 py-12 text-foreground relative z-10">
        {/* Modal de instrucciones */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Bot className="h-5 w-5 text-primary" />
              Instrucciones para Reservar
            </DialogTitle>
            <DialogDescription>
              Te guiaremos paso a paso para reservar tu cita médica.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                1
              </div>
              <p className="text-sm text-foreground">
                Selecciona la especialidad médica
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                2
              </div>
              <p className="text-sm text-foreground">
                Elige fecha y hora disponible
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                3
              </div>
              <p className="text-sm text-foreground">
                Confirma tus datos de contacto
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStartChat} className="w-full">
              Iniciar Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Encabezado de la página */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Reserva tu Cita Médica
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Nuestro asistente virtual te ayuda a programar tu cita de manera
          rápida y sencilla.
        </p>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="mx-auto flex items-center gap-2"
        >
          <Bot className="h-4 w-4" />
          <span>Ver instrucciones</span>
        </Button>
      </div>

      {/* Sección principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna izquierda - Información */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información sobre el servicio */}
          <div className="bg-muted rounded-xl shadow-lg p-6 border border-border transition-colors">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-foreground">
              <Bot className="mr-2 h-5 w-5 text-primary" />
              <span>Nuestro Servicio de Citas</span>
            </h2>

            <div className="max-w-none">
              <p className="text-foreground">
                Hemos modernizado el proceso de reserva de citas médicas con
                nuestro chatbot, eliminando largas llamadas y formularios
                complicados.
              </p>
              <p className="mt-3 text-foreground">
                Si prefieres atención personalizada, contáctanos directamente:
              </p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-primary">📞</span> (01) 123-4567
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-primary">✉️</span> citas@medisol.com
                </li>
              </ul>
            </div>
          </div>

          {/* Ventajas del chatbot */}
          <div className="bg-muted rounded-xl shadow-lg p-6 border border-border transition-colors">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-foreground">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              <span>Ventajas de Nuestro Asistente</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Benefit
                title="Disponible 24/7"
                description="Reserva en cualquier momento del día o la noche."
              />
              <Benefit
                title="Proceso Simple"
                description="El chatbot te guía paso a paso."
              />
              <Benefit
                title="Respuesta Inmediata"
                description="Confirmación instantánea de tu cita."
              />
              <Benefit
                title="Recordatorios"
                description="Avisos automáticos de tu cita."
              />
            </div>
          </div>
        </div>

        {/* Columna derecha - Visual */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Ilustración del chatbot */}
            <div className="bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-xl shadow-lg p-6 border border-border flex flex-col items-center justify-center text-center transition-colors bg-background">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-10 w-10 text-primary" />
              </div>

              <h3 className="text-lg font-medium mb-2 text-foreground dark:text-foreground">
                Asistente Médico
              </h3>

              <p className="text-muted-foreground dark:text-muted-foreground mb-4 text-sm">
                Listo para ayudarte con tu reserva médica.
              </p>

              <button
                onClick={() => openChatbot()}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl shadow-lg hover:shadow-xl font-medium transition-all w-full"
              >
                <span>Iniciar Chat</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preguntas frecuentes */}
      <div className="mt-10 bg-muted rounded-xl shadow-lg p-6 border border-border transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-center text-foreground">
          Preguntas Frecuentes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FAQ
            question="¿Puedo modificar mi cita?"
            answer="Sí, puedes reprogramar o cancelar citas existentes a través del chatbot."
          />
          <FAQ
            question="¿Qué información necesito?"
            answer="Ten a mano tu DNI, información de contacto y motivo de consulta."
          />
          <FAQ
            question="¿Para todas las especialidades?"
            answer="Sí, el chatbot gestiona citas para todas las especialidades disponibles."
          />
          <FAQ
            question="¿Y si hay problemas?"
            answer="Siempre puedes contactarnos por teléfono o email para asistencia personal."
          />
        </div>
      </div>
      </div>
    </section>
  );
}

// Componentes auxiliares
type BenefitProps = {
  title: string;
  description: string;
};

const Benefit = ({ title, description }: BenefitProps) => (
  <div className="p-3 border border-border/50 rounded-lg bg-background transition-colors shadow">
    <h3 className="font-medium text-primary text-sm mb-1">{title}</h3>
    <p className="text-xs text-foreground">
      {description}
    </p>
  </div>
);

type FAQProps = {
  question: string;
  answer: string;
};

const FAQ = ({ question, answer }: FAQProps) => (
  <div className="border-b border-border pb-3 transition-colors">
    <h3 className="font-medium mb-1 text-sm text-foreground">
      {question}
    </h3>
    <p className="text-xs text-muted-foreground">
      {answer}
    </p>
  </div>
);
