"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, Calendar, CalendarDays, Users, FileText, Stethoscope, User, ChevronRight } from "lucide-react"

export default function MedicalDashboard() {
  const [activeSection, setActiveSection] = useState("inicio")

  const navigationItems = [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "reservar", label: "Reservar", icon: Calendar },
    { id: "citas", label: "Mis Citas", icon: CalendarDays },
    { id: "dependientes", label: "Mis Dependientes", icon: Users },
    { id: "recetas", label: "Mis Recetas", icon: FileText },
  ]

  const serviceCards = [
    {
      title: "Reserva",
      subtitle: "Presencial",
      image: "/doctor-examining-baby-with-stethoscope-in-medical-.jpg",
      description: "Agenda tu cita presencial con nuestros especialistas",
    },
    {
      title: "Reserva",
      subtitle: "Teleconsulta",
      image: "/female-doctor-smiling-during-video-call-consultati.jpg",
      description: "Consulta médica virtual desde la comodidad de tu hogar",
    },
    {
      title: "Agregar",
      subtitle: "Dependientes",
      image: "/happy-family-with-father-holding-child-and-mother-.jpg",
      description: "Gestiona la salud de toda tu familia en un solo lugar",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">CJP</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Centro Javier Prado</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">CJP</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <User className="w-5 h-5" />
              <span className="font-medium">INVITADO</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-blue-600 mb-4 text-balance">BIENVENIDO(A)</h1>
              <p className="text-xl text-blue-500 font-medium">¡Continúa cuidando tu salud y la de toda tu familia!</p>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCards.map((service, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={`${service.title} ${service.subtitle}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{service.title}</h3>
                      <p className="text-xl font-semibold text-blue-200">{service.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                      Acceder
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Citas Rápidas</h3>
                <p className="text-gray-600">Agenda tu cita en minutos</p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Especialistas</h3>
                <p className="text-gray-600">Médicos certificados</p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Familia</h3>
                <p className="text-gray-600">Cuida a todos tus seres queridos</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
