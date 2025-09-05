import { HospitalIcon, Home } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import BackgroundMedicalIcons from "@/components/auth/background-medical-icons";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="min-h-svh relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom right, var(--muted), var(--background), var(--muted))",
      }}
    >
      {/* Iconos de fondo médicos - Refactorizado */}
      <BackgroundMedicalIcons />
      
      {/* Botón de inicio en la parte superior */}
      <div className="absolute top-4 left-0 right-0 flex justify-center z-20">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center p-3 rounded-full hover:bg-background/80 transition-all duration-300 backdrop-blur-sm border border-border/30 shadow-md"
          style={{ color: "var(--primary)" }}
          title="Ir a la página principal"
        >
          <Home className="w-6 h-6" />
        </Link>
      </div>

      {/* Contenido principal - Responsive */}
      <div className="relative z-10 flex min-h-svh items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-center gap-8 mx-auto">
          {/* Logo y branding - Izquierda centrada */}
          <div className="flex-1 flex flex-col items-center justify-center text-center mb-6 sm:mb-0 mx-auto">
            <div className="relative mb-6">
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center mx-auto shadow-xl border-4 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--secondary))",
                  borderColor: "var(--background)",
                }}
              >
                {/* Efecto reflejo */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background:
                      "linear-gradient(to bottom right, transparent, var(--primary-foreground) 70%)",
                    borderRadius: "50%",
                  }}
                ></div>
                <HospitalIcon
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative z-10"
                  style={{ color: "var(--primary-foreground)" }}
                />
              </div>
              {/* Sombra inferior */}
              <div
                className="w-16 h-2 sm:w-20 sm:h-3 lg:w-24 lg:h-4 mx-auto rounded-full mt-2 blur-sm"
                style={{ backgroundColor: "var(--primary)", opacity: 0.3 }}
              ></div>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              MEDISOL
            </h1>
            <p
              className="text-lg sm:text-2xl lg:text-3xl font-medium mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              Vida y Salud
            </p>
            <div
              className="w-20 sm:w-32 lg:w-40 h-2 rounded-full mt-2 sm:mt-3"
              style={{
                background:
                  "linear-gradient(to right, var(--primary), var(--secondary))",
              }}
            ></div>
          </div>
          {/* Card del formulario - Derecha */}
          <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <div
              className="backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <LoginForm />
            </div>
            <div className="text-center mt-4 sm:mt-6 lg:mt-8">
              {/* Espacio reservado para contenido adicional */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
