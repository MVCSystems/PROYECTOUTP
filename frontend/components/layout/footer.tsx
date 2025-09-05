import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Tipo para los enlaces rápidos
type QuickLinkItem = {
  href: string;
  label: string;
};

// Tipo para los enlaces sociales
type SocialLinkProps = {
  href: string;
  title: string;
  icon: React.ReactNode;
  hoverColor: string;
};

// Componente principal del footer
const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background border-border mt-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          <ContactSection />
          <MapSection />
          <QuickLinks />
        </div>

        <div className="mt-12 pt-6 border-t text-center border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MEDISOL - Salud y Bienestar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Sección de contacto con información y redes sociales
const ContactSection = () => {
  // Datos de contacto
  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      text: "Av. Salud N°123, Lima, Perú",
    },
    {
      icon: <Phone className="w-5 h-5 text-primary" />,
      text: "(01) 234-5678",
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      text: "contacto@medisol.pe",
    },
    {
      icon: <Clock className="w-5 h-5 text-secondary" />,
      text: "Lunes a Viernes: 8:00 - 20:00, Sábados: 8:00 - 14:00",
    },
  ];

  // Redes sociales
  const socialLinks = [
    {
      href: "#",
      title: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      hoverColor: "hover:bg-primary hover:text-primary-foreground",
    },
    {
      href: "#",
      title: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      hoverColor: "hover:bg-primary hover:text-primary-foreground",
    },
    {
      href: "#",
      title: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      hoverColor: "hover:bg-secondary hover:text-secondary-foreground",
    },
  ];

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h4 className="mb-5 text-lg font-bold text-primary">Contacto</h4>
        <div className="space-y-4">
          {contactInfo.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <span className="text-sm text-foreground leading-relaxed">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {socialLinks.map((link) => (
          <SocialLink
            key={link.title}
            href={link.href}
            title={link.title}
            icon={link.icon}
            hoverColor={link.hoverColor}
          />
        ))}
      </div>
    </div>
  );
};

// Sección de enlaces rápidos
const QuickLinks = () => {
  // Lista de enlaces rápidos
  const links: QuickLinkItem[] = [
    { href: "/", label: "Inicio" },
    { href: "/servicios", label: "Servicios Médicos" },
    { href: "/especialidades", label: "Especialidades" },
    { href: "/citas", label: "Reservar Cita" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <div>
      <h4 className="mb-5 text-lg font-bold text-primary">Enlaces Rápidos</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block px-3 py-2 rounded-md text-foreground hover:bg-muted hover:text-primary font-medium transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Sección del mapa con la ubicación
const MapSection = () => {
  return (
    <div>
      <h4 className="mb-5 text-lg font-bold text-primary">Ubicación</h4>

      {/* Mapa embebido */}
      <div className="rounded-lg overflow-hidden shadow-md border border-border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.3147534643143!2d-77.04289468460892!3d-12.046374491458035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c6f7e0d41aab%3A0x9d9e51d7b0b4b1c5!2sLima%2C%20Peru!5e0!3m2!1sen!2spe!4v1642536789123!5m2!1sen!2spe"
          width="100%"
          height="200"
          className="border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación MEDISOL"
        ></iframe>
      </div>

      {/* Información de emergencias */}
      <div className="mt-5 p-4 bg-muted rounded-lg shadow-sm">
        <p className="text-sm text-primary font-semibold mb-1">
          Emergencias 24/7
        </p>
        <p className="text-sm text-foreground">
          Atención médica de urgencia disponible las 24 horas
        </p>
      </div>
    </div>
  );
};

// Componente para enlaces de redes sociales
const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  title,
  icon,
  hoverColor,
}) => (
  <Link
    href={href}
    className={`
      p-3
      rounded-lg
      transition-all
      duration-200
      bg-muted
      text-primary
      hover:shadow-md
      ${hoverColor}
    `}
    title={title}
    aria-label={title}
  >
    {icon}
  </Link>
);

export default Footer;
