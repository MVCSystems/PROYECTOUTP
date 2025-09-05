import { FloatingChatbot } from "@/components/chat/floating-chatbot";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Brain,
  Eye,
  Stethoscope,
  ArrowLeft,
  Calendar,
  Award,
  EyeIcon,
} from "lucide-react";
import Link from "next/link";

export default function EspecialidadesPage() {
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
            Especialidades Médicas
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-8">
            Nuestras Áreas de Especialización
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
            Contamos con especialistas certificados en las principales áreas
            médicas para brindarte la mejor atención personalizada, accesible y
            de alta calidad.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-12 mb-20">
          <Card className="bg-card/50 border border-border/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Heart className="h-10 w-10 text-red-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-card-foreground mb-4">
                    Cardiología
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Cuidado especializado del corazón y sistema cardiovascular
                    con tecnología de vanguardia y tratamientos personalizados
                    para cada paciente.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-red-600" />
                      <span className="text-muted-foreground">
                        Electrocardiogramas avanzados
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-red-600" />
                      <span className="text-muted-foreground">
                        Ecocardiografías 3D
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-red-600" />
                      <span className="text-muted-foreground">
                        Monitoreo cardíaco 24h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border border-border/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Brain className="h-10 w-10 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-card-foreground mb-4">
                    Neurología
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Especialistas en sistema nervioso y trastornos neurológicos
                    con diagnóstico avanzado y tratamientos innovadores.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span className="text-muted-foreground">
                        Resonancias magnéticas
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span className="text-muted-foreground">
                        Electroencefalogramas
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span className="text-muted-foreground">
                        Tratamientos especializados
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border border-border/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Eye className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-card-foreground mb-4">
                    Oftalmología
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Cuidado integral de la vista y salud ocular con equipos de
                    última generación y cirugías especializadas.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-muted-foreground">
                        Cirugía de cataratas
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-muted-foreground">
                        Tratamiento de glaucoma
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-muted-foreground">
                        Exámenes de retina
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border border-border/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Stethoscope className="h-10 w-10 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-card-foreground mb-4">
                    Medicina General
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Atención médica integral, preventiva y de seguimiento
                    personalizado para toda la familia con enfoque en
                    accesibilidad.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span className="text-muted-foreground">
                        Chequeos preventivos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span className="text-muted-foreground">
                        Medicina familiar
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span className="text-muted-foreground">
                        Seguimiento personalizado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="px-10 py-5 text-xl h-auto focus:ring-4 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-secondary text-primary-foreground"
          >
            <EyeIcon className="mr-3 h-7 w-7" />
            Ver mas especialidades
          </Button>
        </div>
      </div>
    </section>
  );
}
