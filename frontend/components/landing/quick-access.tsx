import { Calendar, Star, Shield, Stethoscope } from "lucide-react";
import Link from "next/link";

const options = [
  {
    href: "/servicios",
    title: "Servicios",
    icon: <Shield className="h-8 w-8" style={{ color: "var(--primary)" }} />,
    bg: { background: "linear-gradient(to bottom right, var(--muted), var(--background))" },
    iconBg: { backgroundColor: "var(--primary-foreground)" },
    text: "¿Qué podemos hacer por ti?Descubre todos nuestros servicios médicos.",
    border: { borderColor: "var(--border)" },
    hover: { borderColor: "var(--primary)" },
  },
  {
    href: "/especialidades",
    title: "Especialidades",
    icon: <Stethoscope className="h-8 w-8" style={{ color: "var(--secondary)" }} />,
    bg: { background: "linear-gradient(to bottom right, var(--muted), var(--background))" },
    iconBg: { backgroundColor: "var(--secondary-foreground)" },
    text: "Elige tu especialista y recibe atención personalizada.",
    border: { borderColor: "var(--border)" },
    hover: { borderColor: "var(--secondary)" },
  },
  {
    href: "/testimonios",
    title: "Testimonios",
    icon: <Star className="h-8 w-8" style={{ color: "var(--accent-foreground)" }} />,
    bg: { background: "linear-gradient(to bottom right, var(--muted), var(--background))" },
    iconBg: { backgroundColor: "var(--accent)" },
    text: "Conoce las historias y opiniones de nuestros pacientes.",
    border: { borderColor: "var(--border)" },
    hover: { borderColor: "var(--accent-foreground)" },
  },
  {
    href: "/contacto",
    title: "Contacto",
    icon: <Calendar className="h-8 w-8" style={{ color: "var(--primary)" }} />,
    bg: { background: "linear-gradient(to bottom right, var(--muted), var(--accent))" },
    iconBg: { backgroundColor: "var(--secondary-foreground)" },
    text: "¿Tienes dudas? Escríbenos o visítanos, estamos para ayudarte.",
    border: { borderColor: "var(--border)" },
    hover: { borderColor: "var(--primary)" },
  },
];

function Card({ href, title, icon, bg, iconBg, text, border, hover }: any) {
  return (
    <Link href={href} className="group">
      <div
        className="min-h-[320px] max-h-[320px] flex flex-col justify-between text-center rounded-xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 relative overflow-hidden"
        style={{
          ...bg,
          ...border,
        }}
      >
        {/* Efecto hover del borde */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 rounded-xl"
          style={{
            borderColor: hover.borderColor,
          }}
        ></div>
        
        {/* Decoración de fondo */}
        <div 
          className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>
        
        <div className="flex flex-col flex-1 justify-between relative z-10">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md relative"
            style={iconBg}
          >
            {/* Efecto reflejo */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(135deg, white, transparent 70%)",
                borderRadius: "0.75rem"
              }}
            ></div>
            <div className="relative z-10">
              {icon}
            </div>
          </div>
          <h3 
            className="text-xl font-semibold mb-3"
            style={{ color: "var(--foreground)" }}
          >
            {title}
          </h3>
          <p 
            className="flex-1 flex items-center justify-center text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ServiciosMedicos() {
  return (
    <section 
      className="py-12 pb-16 mt-0"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl font-bold mb-4 text-primary"
          >
            Servicios Médicos
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto text-foreground"
          >
            Todo lo que necesitas para cuidar tu salud en un solo lugar
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {options.map((opt) => (
            <Card key={opt.href} {...opt} />
          ))}
        </div>
      </div>
    </section>
  );
}
