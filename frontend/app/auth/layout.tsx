import { Stethoscope, Heart, Shield, Pill, Activity, Clipboard } from "lucide-react";
import "@/app/background-icons.css";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Contenido de autenticación */}
      <div className="relative z-10 flex-grow">
        {children}
      </div>
      
      {/* Iconos decorativos en el fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 opacity-40">
          <Stethoscope 
            className="w-20 h-20 lg:w-28 lg:h-28 animate-pulse"
            color="#3182ce" 
          />
        </div>
        
        <div className="absolute top-40 right-20 opacity-40">
          <Heart 
            className="w-16 h-16 lg:w-20 lg:h-20"
            color="#3182ce" 
          />
        </div>
        
        <div className="absolute bottom-32 left-20 opacity-40">
          <Shield 
            className="w-18 h-18 lg:w-24 lg:h-24"
            color="#3182ce" 
          />
        </div>
        
        <div className="absolute top-1/2 left-12 opacity-40">
          <Pill 
            className="w-14 h-14 lg:w-16 lg:h-16"
            color="#805ad5" 
          />
        </div>
        
        <div className="absolute top-80 left-1/2 transform -translate-x-1/2 opacity-40">
          <Activity 
            className="w-20 h-20 lg:w-24 lg:h-24"
            color="#805ad5" 
          />
        </div>
        
        <div className="absolute bottom-40 right-16 opacity-40">
          <Clipboard 
            className="w-14 h-14 lg:w-18 lg:h-18"
            color="#3182ce" 
          />
        </div>
      </div>
    </div>
  );
}
