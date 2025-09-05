"use client";

import {
  Stethoscope,
  Search,
  Sun,
  Moon,
  Home,
  List,
  HeartPulse,
  CalendarCheck,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import MedicalSearch from "@/components/ui/medical-search";

// Navegación principal
const navLinks = [
  { href: "/", label: "Inicio", icon: <Home className="w-5 h-5 mr-2" /> },
  {
    href: "/servicios",
    label: "Servicios",
    icon: <List className="w-5 h-5 mr-2" />,
  },
  {
    href: "/especialidades",
    label: "Especialidades",
    icon: <HeartPulse className="w-5 h-5 mr-2" />,
  },
  {
    href: "/auth/login",
    label: "Reservar Cita",
    icon: <CalendarCheck className="w-5 h-5 mr-2" />,
  },
];

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  // Inicializar tema al cargar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  // Cambiar tema
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Abrir modal de búsqueda
  const handleSearchClick = () => {
    setShowSearch(true);
  };

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex-1 flex justify-center">
            <div className="hidden md:block">
              <Navigation />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 rounded-lg bg-muted text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setMobileNav(!mobileNav)}
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Controls
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              onSearchClick={handleSearchClick}
            />
          </div>
        </div>
      </nav>
      {/* Menú móvil */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 bg-primary/80 flex flex-col">
          <button
            className="self-end m-4 text-primary-foreground text-2xl"
            onClick={() => setMobileNav(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
          <div className="flex flex-col items-center gap-6 mt-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded flex items-center text-primary-foreground hover:bg-primary-foreground/10 hover:text-secondary font-medium text-xl transition-colors"
                onClick={() => setMobileNav(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* Modal de búsqueda médica */}
      {showSearch && (
        <div className="fixed left-0 right-0 top-16 md:top-20 z-50 flex justify-center items-start">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-xl mx-4 border border-border mt-2">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary">
                  Búsqueda Médica
                </h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-muted-foreground hover:text-primary text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
              <MedicalSearch />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Componente Logo
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-2 border-muted shadow">
        <Stethoscope className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-primary tracking-tight">
          MEDISOL
        </h1>
        <p className="text-xs text-secondary font-semibold">Salud y Vida</p>
      </div>
    </div>
  );
}

// Componente Navegación
function Navigation() {
  return (
    <div className="flex flex-wrap items-center gap-6 overflow-x-auto max-w-full">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-2 py-1 rounded flex items-center text-foreground hover:bg-muted hover:text-primary font-medium transition-colors"
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </div>
  );
}

// Componente Controles
function Controls({
  isDarkMode,
  onToggleTheme,
  onSearchClick,
}: {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSearchClick: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onSearchClick}
        className="p-2 rounded-lg bg-muted text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Búsqueda médica"
      >
        <Search className="h-5 w-5" />
      </button>
      <button
        onClick={onToggleTheme}
        className="p-2 rounded-lg bg-muted text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label={
          isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
        }
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
