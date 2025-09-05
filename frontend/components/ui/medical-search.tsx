"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { 
  Search, 
  Stethoscope, 
  Calendar, 
  MapPin, 
  Clock,
  User,
  FileText,
  Phone,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
// import useSWR from "swr";
// import { fetcher } from "@/lib/axios";

// Datos médicos de ejemplo (reemplazar con APIs del backend)
const mockMedicalData = {
  especialidades: [
    { id: 1, nombre: "Cardiología", descripcion: "Enfermedades del corazón", disponible: true },
    { id: 2, nombre: "Pediatría", descripcion: "Medicina infantil", disponible: true },
    { id: 3, nombre: "Dermatología", descripcion: "Enfermedades de la piel", disponible: true },
    { id: 4, nombre: "Neurología", descripcion: "Sistema nervioso", disponible: false },
    { id: 5, nombre: "Ginecología", descripcion: "Salud femenina", disponible: true },
    { id: 6, nombre: "Traumatología", descripcion: "Huesos y articulaciones", disponible: true },
  ],
  medicos: [
    { id: 1, nombre: "Dr. Juan Pérez", especialidad: "Cardiología", disponible: true, horario: "Lunes a Viernes 8:00-16:00" },
    { id: 2, nombre: "Dra. María González", especialidad: "Pediatría", disponible: true, horario: "Martes a Sábado 9:00-17:00" },
    { id: 3, nombre: "Dr. Carlos Ruiz", especialidad: "Dermatología", disponible: false, horario: "Lunes a Miércoles 10:00-14:00" },
    { id: 4, nombre: "Dra. Ana Torres", especialidad: "Ginecología", disponible: true, horario: "Lunes a Viernes 14:00-20:00" },
  ],
  servicios: [
    { id: 1, nombre: "Exámenes de Laboratorio", categoria: "Diagnóstico", precio: "S/. 50-200", disponible: true },
    { id: 2, nombre: "Radiografías", categoria: "Imagenología", precio: "S/. 80-150", disponible: true },
    { id: 3, nombre: "Ecografías", categoria: "Imagenología", precio: "S/. 120-250", disponible: true },
    { id: 4, nombre: "Electrocardiograma", categoria: "Cardiología", precio: "S/. 60", disponible: true },
    { id: 5, nombre: "Consulta de Emergencia", categoria: "Urgencias", precio: "S/. 100", disponible: true },
  ],
  informacion: [
    { id: 1, titulo: "Preparación para exámenes de sangre", categoria: "Guía", contenido: "Ayuno de 8-12 horas" },
    { id: 2, titulo: "Síntomas de infarto", categoria: "Emergencia", contenido: "Dolor en el pecho, dificultad para respirar" },
    { id: 3, titulo: "Vacunas requeridas", categoria: "Prevención", contenido: "Calendario de vacunación infantil" },
    { id: 4, titulo: "Cuidados post-operatorios", categoria: "Recuperación", contenido: "Instrucciones después de cirugía" },
  ]
};

// Interfaces para tipado
interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  disponible: boolean;
}

interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  disponible: boolean;
  horario: string;
}

interface Servicio {
  id: number;
  nombre: string;
  categoria: string;
  precio: string;
  disponible: boolean;
}

interface Informacion {
  id: number;
  titulo: string;
  categoria: string;
  contenido: string;
}

interface SearchResults {
  especialidades: Especialidad[];
  medicos: Medico[];
  servicios: Servicio[];
  informacion: Informacion[];
}

export default function MedicalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    especialidades: [],
    medicos: [],
    servicios: [],
    informacion: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para filtrar resultados médicos
  const filterMedicalResults = useCallback((term: string) => {
    if (term.length < 2) {
      setResults({ especialidades: [], medicos: [], servicios: [], informacion: [] });
      return false;
    }

    setIsLoading(true);
    const termLower = term.toLowerCase();

    // Simular delay de API
    setTimeout(() => {
      // Filtrar especialidades
      const filteredEspecialidades = mockMedicalData.especialidades.filter(item =>
        item.nombre.toLowerCase().includes(termLower) ||
        item.descripcion.toLowerCase().includes(termLower)
      );

      // Filtrar médicos
      const filteredMedicos = mockMedicalData.medicos.filter(item =>
        item.nombre.toLowerCase().includes(termLower) ||
        item.especialidad.toLowerCase().includes(termLower)
      );

      // Filtrar servicios
      const filteredServicios = mockMedicalData.servicios.filter(item =>
        item.nombre.toLowerCase().includes(termLower) ||
        item.categoria.toLowerCase().includes(termLower)
      );

      // Filtrar información
      const filteredInformacion = mockMedicalData.informacion.filter(item =>
        item.titulo.toLowerCase().includes(termLower) ||
        item.categoria.toLowerCase().includes(termLower) ||
        item.contenido.toLowerCase().includes(termLower)
      );

      setResults({
        especialidades: filteredEspecialidades,
        medicos: filteredMedicos,
        servicios: filteredServicios,
        informacion: filteredInformacion,
      });

      setIsLoading(false);
    }, 300);

    return true;
  }, []);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      setIsOpen(true);
      filterMedicalResults(value);
    } else {
      setIsOpen(false);
    }
  };

  // Manejar clic en el botón de búsqueda
  const handleSearchClick = () => {
    if (searchTerm.length >= 2) {
      setIsOpen(!isOpen);
    } else {
      // Enfocar el input si no hay texto
      inputRef.current?.focus();
    }
  };

  // Verificar si hay resultados
  const hasResults = 
    results.especialidades.length > 0 ||
    results.medicos.length > 0 ||
    results.servicios.length > 0 ||
    results.informacion.length > 0;

  // Manejar navegación a diferentes secciones
  const handleEspecialidadClick = (especialidad: Especialidad) => {
    setIsOpen(false);
    // Navegar a /especialidades/[id] o mostrar modal de citas
    window.location.href = `/especialidades/${especialidad.id}`;
  };

  const handleMedicoClick = (medico: Medico) => {
    setIsOpen(false);
    // Navegar a perfil del médico o reservar cita
    window.location.href = `/medicos/${medico.id}`;
  };

  const handleServicioClick = (servicio: Servicio) => {
    setIsOpen(false);
    // Navegar a información del servicio
    window.location.href = `/servicios/${servicio.id}`;
  };

  const handleInformacionClick = (info: Informacion) => {
    setIsOpen(false);
    // Navegar a artículo de información
    window.location.href = `/informacion/${info.id}`;
  };

  // Mantener focus cuando se abre el popover
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <div className="flex">
        <PopoverAnchor className="flex-1">
          <Input
            ref={inputRef}
            placeholder="Buscar médicos, especialidades, servicios..."
            className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </PopoverAnchor>
        <Button
          className="rounded-l-none bg-blue-600 hover:bg-blue-700"
          onClick={handleSearchClick}
          type="button"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <PopoverContent
        className="w-[650px] p-0 glass-medical shadow-2xl rounded-2xl border-0"
        align="start"
        sideOffset={8}
      >
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-spin">
                  <div className="absolute inset-2 rounded-full bg-white"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full medical-pulse"></div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Buscando información médica</h3>
            <p className="text-gray-600">Consultando base de datos de especialistas...</p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        ) : hasResults ? (
          <div className="max-h-[750px] overflow-y-auto custom-scrollbar">
            
            {/* Especialidades */}
            {results.especialidades.length > 0 && (
              <div className="p-6 border-b border-gray-100/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 gradient-especialidades rounded-2xl flex items-center justify-center shadow-lg">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">Especialidades Médicas</h3>
                    <p className="text-sm text-gray-600">Encuentra el especialista que necesitas</p>
                  </div>
                  <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {results.especialidades.length} disponibles
                  </div>
                </div>
                <div className="grid gap-4">
                  {results.especialidades.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleEspecialidadClick(item)}
                      className="medical-card group relative p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 hover:from-blue-100/90 hover:to-indigo-100/90 rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-[1.02] border border-blue-100/50 hover:border-blue-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                            <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                              {item.nombre}
                            </h4>
                          </div>
                          <p className="text-gray-600 text-base leading-relaxed pl-6">{item.descripcion}</p>
                        </div>
                        <div className="ml-6 flex flex-col items-end gap-3">
                          {item.disponible ? (
                            <div className="flex items-center gap-2 status-available px-3 py-1.5 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span className="text-sm font-bold">Disponible</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 status-unavailable px-3 py-1.5 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span className="text-sm font-bold">No disponible</span>
                            </div>
                          )}
                          <Calendar className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Médicos */}
            {results.medicos.length > 0 && (
              <div className="p-6 border-b border-gray-100/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 gradient-medicos rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">Nuestros Médicos</h3>
                    <p className="text-sm text-gray-600">Profesionales de la salud especializados</p>
                  </div>
                  <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    {results.medicos.length} doctores
                  </div>
                </div>
                <div className="grid gap-4">
                  {results.medicos.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleMedicoClick(item)}
                      className="medical-card group relative p-5 bg-gradient-to-r from-emerald-50/80 to-green-50/80 hover:from-emerald-100/90 hover:to-green-100/90 rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-[1.02] border border-emerald-100/50 hover:border-emerald-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
                              {item.nombre.split(' ').map(n => n[0]).join('')}
                            </div>
                            {item.disponible && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors mb-1">
                              {item.nombre}
                            </h4>
                            <p className="text-emerald-600 font-semibold text-base mb-3">{item.especialidad}</p>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="h-4 w-4" />
                              <p className="text-sm font-medium">{item.horario}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {item.disponible ? (
                            <div className="flex items-center gap-2 status-available px-3 py-1.5 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span className="text-sm font-bold">Disponible</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 status-unavailable px-3 py-1.5 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span className="text-sm font-bold">Ocupado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios */}
            {results.servicios.length > 0 && (
              <div className="p-6 border-b border-gray-100/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 gradient-servicios rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">Servicios Médicos</h3>
                    <p className="text-sm text-gray-600">Servicios y procedimientos disponibles</p>
                  </div>
                  <div className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                    {results.servicios.length} servicios
                  </div>
                </div>
                <div className="grid gap-4">
                  {results.servicios.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleServicioClick(item)}
                      className="medical-card group relative p-5 bg-gradient-to-r from-purple-50/80 to-violet-50/80 hover:from-purple-100/90 hover:to-violet-100/90 rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-[1.02] border border-purple-100/50 hover:border-purple-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors mb-3">
                            {item.nombre}
                          </h4>
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                              {item.categoria}
                            </span>
                            <span className="text-2xl font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                              {item.precio}
                            </span>
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col items-end gap-3">
                          {item.disponible ? (
                            <div className="flex items-center gap-2 status-available px-3 py-1.5 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span className="text-sm font-bold">Disponible</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 status-unavailable px-3 py-1.5 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span className="text-sm font-bold">No disponible</span>
                            </div>
                          )}
                          <MapPin className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información Médica */}
            {results.informacion.length > 0 && (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 gradient-informacion rounded-2xl flex items-center justify-center shadow-lg">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">Información Médica</h3>
                    <p className="text-sm text-gray-600">Guías, consejos y recursos de salud</p>
                  </div>
                  <div className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                    {results.informacion.length} artículos
                  </div>
                </div>
                <div className="grid gap-4">
                  {results.informacion.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleInformacionClick(item)}
                      className="medical-card group relative p-5 bg-gradient-to-r from-orange-50/80 to-amber-50/80 hover:from-orange-100/90 hover:to-amber-100/90 rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-[1.02] border border-orange-100/50 hover:border-orange-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                              {item.categoria}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-800 group-hover:text-orange-700 transition-colors mb-3">
                            {item.titulo}
                          </h4>
                          <p className="text-gray-600 text-base leading-relaxed">{item.contenido}</p>
                        </div>
                        <div className="ml-6">
                          <FileText className="h-6 w-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : searchTerm.length >= 2 ? (
          <div className="p-10 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Sin resultados</h3>
            <p className="text-gray-500 mb-2 text-lg">No se encontraron resultados para "{searchTerm}"</p>
            <p className="text-gray-400">
              Intenta buscar por especialidad, nombre del médico o servicio médico
            </p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">¿Qué estás buscando?</h3>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="group p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 hover:from-blue-100 hover:via-blue-200 hover:to-indigo-200 rounded-2xl transition-all duration-500 cursor-pointer hover:shadow-xl hover:scale-105">
                <div className="w-16 h-16 gradient-especialidades rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <p className="text-base font-bold text-blue-700 mb-1">Especialidades</p>
                <p className="text-sm text-blue-600">Encuentra tu especialista</p>
              </div>
              <div className="group p-6 bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-100 hover:from-emerald-100 hover:via-green-200 hover:to-emerald-200 rounded-2xl transition-all duration-500 cursor-pointer hover:shadow-xl hover:scale-105">
                <div className="w-16 h-16 gradient-medicos rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <p className="text-base font-bold text-emerald-700 mb-1">Médicos</p>
                <p className="text-sm text-emerald-600">Conoce a nuestro equipo</p>
              </div>
              <div className="group p-6 bg-gradient-to-br from-purple-50 via-violet-100 to-purple-100 hover:from-purple-100 hover:via-violet-200 hover:to-purple-200 rounded-2xl transition-all duration-500 cursor-pointer hover:shadow-xl hover:scale-105">
                <div className="w-16 h-16 gradient-servicios rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <p className="text-base font-bold text-purple-700 mb-1">Servicios</p>
                <p className="text-sm text-purple-600">Explora nuestros servicios</p>
              </div>
              <div className="group p-6 bg-gradient-to-br from-orange-50 via-amber-100 to-orange-100 hover:from-orange-100 hover:via-amber-200 hover:to-orange-200 rounded-2xl transition-all duration-500 cursor-pointer hover:shadow-xl hover:scale-105">
                <div className="w-16 h-16 gradient-informacion rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <p className="text-base font-bold text-orange-700 mb-1">Información</p>
                <p className="text-sm text-orange-600">Guías y consejos médicos</p>
              </div>
            </div>
            <p className="text-gray-500 text-base">
              Comienza escribiendo para buscar especialidades, médicos, servicios o información médica
            </p>
          </div>
        )}

        <div className="p-6 bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 border-t border-gray-200/50 flex items-center justify-between rounded-b-2xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg">
              <Phone className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-bold">Emergencias 24/7</span>
            </div>
            <span className="text-lg font-bold text-red-600">(01) 234-5678</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">Presiona</p>
            <kbd className="px-2 py-1 bg-gray-200 text-gray-600 rounded font-mono text-sm shadow-sm">ESC</kbd>
            <p className="text-sm text-gray-500">para cerrar</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}