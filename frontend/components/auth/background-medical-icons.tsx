import { LucideIcon } from "lucide-react";
import { Stethoscope, Heart, Shield, Pill, Activity, Syringe, UserRound, Thermometer, FlaskRound, Microscope } from "lucide-react";
import React from "react";

type IconProps = {
  Icon: LucideIcon;
  position: string;
  size: string;
  color: string;
  opacity: string;
  animation?: string;
  rotate?: string;
};

const BackgroundIcon = ({ Icon, position, size, color, opacity, animation, rotate }: IconProps) => (
  <div className={`absolute ${position} ${opacity} transition-all duration-700`}>
    <Icon
      className={`${size} ${animation || ""}`}
      style={{ color }}
      transform={rotate}
    />
  </div>
);

// Definición de los iconos con sus propiedades
const iconConfigs = [
  // Iconos principales - más visibles
  {
    Icon: Stethoscope,
    position: "top-12 sm:top-20 left-6 sm:left-16",
    size: "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24",
    color: "var(--primary)",
    opacity: "opacity-20 sm:opacity-25",
    animation: "animate-pulse"
  },
  {
    Icon: Heart,
    position: "top-10 right-10 sm:right-16",
    size: "w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18",
    color: "var(--primary)",
    opacity: "opacity-20 sm:opacity-25"
  },
  {
    Icon: Shield,
    position: "bottom-10 sm:bottom-24 left-8 sm:left-20",
    size: "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20",
    color: "var(--primary)",
    opacity: "opacity-20 sm:opacity-25"
  },
  
  // Iconos secundarios - alineados con el grid
  {
    Icon: Pill,
    position: "top-1/4 sm:top-1/5 right-1/5",
    size: "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14",
    color: "var(--secondary)",
    opacity: "opacity-10 sm:opacity-15"
  },
  {
    Icon: Activity,
    position: "bottom-1/5 right-1/4",
    size: "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16",
    color: "var(--secondary)",
    opacity: "opacity-10 sm:opacity-15"
  },
  {
    Icon: Syringe,
    position: "bottom-1/4 right-16",
    size: "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14",
    color: "var(--primary)",
    opacity: "opacity-10 sm:opacity-15",
    rotate: "rotate(45)"
  },
  
  // Iconos terciarios - sutil en el fondo
  {
    Icon: Thermometer,
    position: "top-1/2 left-1/6",
    size: "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12",
    color: "var(--secondary)",
    opacity: "opacity-8 sm:opacity-12"
  },
  {
    Icon: UserRound,
    position: "top-2/3 left-1/3",
    size: "w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14",
    color: "var(--primary)",
    opacity: "opacity-8 sm:opacity-12"
  },
  {
    Icon: FlaskRound,
    position: "top-1/5 left-1/4",
    size: "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14",
    color: "var(--primary)",
    opacity: "opacity-8 sm:opacity-12"
  },
  {
    Icon: Microscope,
    position: "bottom-1/6 right-1/3",
    size: "w-11 h-11 sm:w-13 sm:h-13 lg:w-16 lg:h-16",
    color: "var(--secondary)",
    opacity: "opacity-8 sm:opacity-12"
  }
];

export default function BackgroundMedicalIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {iconConfigs.map((config, index) => (
        <BackgroundIcon
          key={index}
          Icon={config.Icon}
          position={config.position}
          size={config.size}
          color={config.color}
          opacity={config.opacity}
          animation={config.animation}
          rotate={config.rotate}
        />
      ))}
    </div>
  );
}
