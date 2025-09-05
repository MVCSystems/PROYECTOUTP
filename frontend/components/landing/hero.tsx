import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, CheckCircle, Eye, Shield, Star } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section 
      id="main-content" 
      className="relative pt-8 lg:pt-16 pb-12 lg:pb-16"
      style={{
        background: "linear-gradient(to bottom right, var(--muted), var(--background), var(--muted))"
      }}
    >
      {/* Imagen de fondo */}
      {/* <div className="absolute inset-0 w-full h-full z-0">
        <img src="/hero-bg.jpg" alt="Centro médico" className="w-full h-full object-cover opacity-10 dark:opacity-5" />
      </div> */}
      {/* Capa de superposición para mejorar contraste */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge 
              className="text-lg px-6 py-3 rounded-full shadow bg-muted text-foreground border-border"
            >
              <Award 
                className="w-5 h-5 mr-2 text-primary"
                aria-hidden="true" 
              />
              Atención médica 24/7
            </Badge>
          </div>
          <h2 
            className="text-4xl lg:text-6xl font-bold mb-8 text-balance leading-tight text-foreground"
          >
            Tu salud, nuestra prioridad
          </h2>
          <p 
            className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto text-muted-foreground"
          >
            Agenda tu cita fácil y rápido. Te acompañamos en cada paso.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button
              size="lg"
              className="px-10 py-5 text-xl h-auto focus:ring-4 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-secondary text-primary-foreground"
              aria-describedby="agendar-descripcion"
            >
              <Calendar 
                className="mr-3 h-7 w-7 text-primary-foreground" 
                aria-hidden="true" 
              />
              Agendar Cita
            </Button>
            <Link href="/especialidades">
              <Button
                variant="outline"
                size="lg"
                className="border-2 px-10 py-5 text-xl h-auto focus:ring-4 focus:ring-primary/20 rounded-xl shadow-lg hover:shadow-xl transition-all border-primary text-primary bg-background"
              >
                <Eye 
                  className="mr-3 h-7 w-7 text-primary" 
                  aria-hidden="true" 
                />
                Especialidades
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle 
                className="w-6 h-6 text-secondary" 
                aria-hidden="true" 
              />
              <span className="text-lg font-medium">Atención rápida y sin colas</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-primary" aria-hidden="true" />
              <span className="text-lg font-medium">Trato humano y profesional</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" aria-hidden="true" />
              <span className="text-lg font-medium">Tus datos y salud protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
