"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function RegisterForm({ onClose }: { onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-slate-700 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700" aria-label="Cerrar registro"><X className="w-5 h-5" /></button>
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-6 text-center">Registro de Usuario</h2>
      <form className="space-y-4" onSubmit={e => {e.preventDefault(); onClose();}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipoDoc">Tipo Doc</Label>
            <select id="tipoDoc" className="w-full h-10 rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-600 dark:focus:border-blue-400">
              <option value="dni">DNI</option>
              <option value="ce">Carnet de Extranjería</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>
          <div>
            <Label htmlFor="dni">N° Documento</Label>
            <Input id="dni" type="text" maxLength={12} required placeholder="Ingrese su número" />
          </div>
          <div>
            <Label htmlFor="nombres">Nombres</Label>
            <Input id="nombres" type="text" required placeholder="Nombres" />
          </div>
          <div>
            <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
            <Input id="apellidoPaterno" type="text" required placeholder="Apellido paterno" />
          </div>
          <div>
            <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
            <Input id="apellidoMaterno" type="text" required placeholder="Apellido materno" />
          </div>
          <div>
            <Label htmlFor="celular">Celular</Label>
            <Input id="celular" type="tel" required placeholder="999999999" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="usuario@email.com" />
          </div>
          <div>
            <Label htmlFor="departamento">Departamento</Label>
            <Input id="departamento" type="text" required placeholder="Departamento" />
          </div>
          <div>
            <Label htmlFor="provincia">Provincia</Label>
            <Input id="provincia" type="text" required placeholder="Provincia" />
          </div>
          <div>
            <Label htmlFor="distrito">Distrito</Label>
            <Input id="distrito" type="text" required placeholder="Distrito" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" type="text" required placeholder="Dirección completa" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type={showPassword ? 'text' : 'password'} required placeholder="Contraseña" className="pr-10" />
            <button type="button" className="absolute right-2 top-8 text-gray-500 dark:text-gray-400" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="relative">
            <Label htmlFor="repeatPassword">Repetir Contraseña</Label>
            <Input id="repeatPassword" type={showRepeatPassword ? 'text' : 'password'} required placeholder="Repetir contraseña" className="pr-10" />
            <button type="button" className="absolute right-2 top-8 text-gray-500 dark:text-gray-400" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
              {showRepeatPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-lg shadow-md hover:shadow-lg transition-all">Registrar</Button>
      </form>
    </div>
  )
}
