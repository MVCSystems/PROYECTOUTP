
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Shield, Users, Stethoscope, ArrowLeft, CheckCircle, Calendar, EyeIcon } from "lucide-react"
import Link from "next/link"

export default function ServiciosPage() {
  return (

      <section 
        id="main-content" 
        className="relative pt-8 lg:pt-16 pb-12 lg:pb-16"
        style={{
          background: "linear-gradient(to bottom right, var(--muted), var(--background), var(--muted))"
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge 
              className="text-lg px-6 py-3 rounded-full shadow bg-muted text-foreground border-border mb-6"
            >
              <Stethoscope 
                className="w-5 h-5 mr-2 text-primary"
                aria-hidden="true" 
              />
              Nuestros Servicios
            </Badge>
            <h1 className="text-5xl font-bold text-foreground mb-8">Servicios Médicos Integrales</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
              Ofrecemos una experiencia médica moderna, segura y completamente accesible para todos nuestros pacientes,
              especialmente diseñada para adultos mayores y personas con discapacidades.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-20">
            <Card className="border border-border/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="w-24 h-24 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Clock className="h-12 w-12 text-teal-600" />
                </div>
                <CardTitle className="text-2xl text-card-foreground mb-4">Disponibilidad 24/7</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Agenda tu cita en cualquier momento del día o la noche. Nuestro asistente virtual está siempre
                  disponible para ayudarte con un diseño intuitivo y fácil de usar para todas las edades.
                </p>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Asistente virtual 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Confirmación inmediata
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Recordatorios automáticos
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-card-foreground mb-4">Datos Completamente Seguros</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Tu información médica está protegida con los más altos estándares de seguridad internacional,
                  confidencialidad absoluta y cumplimiento normativo HIPAA.
                </p>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Encriptación de extremo a extremo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Cumplimiento HIPAA
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Servidores seguros certificados
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="w-24 h-24 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Users className="h-12 w-12 text-teal-600" />
                </div>
                <CardTitle className="text-2xl text-card-foreground mb-4">Especialistas Certificados</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Accede a una amplia red de médicos especialistas certificados con experiencia comprobada en atención a
                  adultos mayores y pacientes con necesidades especiales de accesibilidad.
                </p>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Médicos certificados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Experiencia en accesibilidad
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Atención personalizada
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="px-10 py-5 text-xl h-auto focus:ring-4 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              <EyeIcon className="mr-3 h-7 w-7" />
              Ver mas servicios
            </Button>
          </div>
        </div>
      </section>
  )
}
