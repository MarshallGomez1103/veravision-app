/* Vera Vision — estado global de la app (auth, sede, roles, tema, acento) */
import { createContext, useContext, useMemo, useState } from 'react'
import { vvDataset, VV_EMPLEADOS } from '@renderer/data'
import type { Dataset } from '@renderer/data'
import type { Empleado, Sede, SedeVista } from '@renderer/data/types'

export interface Acento {
  nombre: string
  hex: string
  hover: string
}

export const VV_ACENTOS: Acento[] = [
  { nombre: 'Azul IBM', hex: '#0f62fe', hover: '#0353e9' },
  { nombre: 'Verde esmeralda', hex: '#198038', hover: '#0e6027' },
  { nombre: 'Morado', hex: '#8a3ffc', hover: '#6929c4' },
  { nombre: 'Magenta', hex: '#d02670', hover: '#9f1853' },
  { nombre: 'Teal', hex: '#007d79', hover: '#005d5d' }
]

export type Theme = 'g10' | 'g100'

import type { Motivo } from '@renderer/data/types'

interface VVState {
  user: Empleado | null
  empleados: Empleado[]
  login: (id: string) => void
  logout: () => void
  sede: SedeVista
  setSede: (s: SedeVista) => void
  puedeCambiarSede: boolean
  asignaciones: Record<string, Sede>
  setAsignacion: (asesoraId: string, sede: Sede) => void
  theme: Theme
  toggleTheme: () => void
  acento: Acento
  setAcento: (a: Acento) => void
  data: Dataset
  templates: {
    whatsapp: Record<Motivo, string>
    email: Record<Motivo, string>
  }
  setTemplates: React.Dispatch<
    React.SetStateAction<{
      whatsapp: Record<Motivo, string>
      email: Record<Motivo, string>
    }>
  >
}

const VVContext = createContext<VVState | null>(null)

export function VVProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<Empleado | null>(null)
  const [asignaciones, setAsignaciones] = useState<Record<string, Sede>>({
    francia: 'CD Centrochía',
    alejandra: 'CD Tocancipá'
  })
  const [sedeGerente, setSedeGerente] = useState<SedeVista>('Todas las sedes')
  const [theme, setTheme] = useState<Theme>('g10')
  const [acento, setAcento] = useState<Acento>(VV_ACENTOS[0])
  const [templates, setTemplates] = useState<{
    whatsapp: Record<Motivo, string>
    email: Record<Motivo, string>
  }>({
    whatsapp: {
      control:
        'Hola [Cliente], en Opticalia notamos que ya pasó un año de tu último control visual. Te invitamos a agendar tu examen anual. La primera cita no tiene costo.',
      cumple:
        '¡Feliz cumpleaños, [Cliente]! Como cliente de Opticalia tienes 20% de descuento en monturas durante todo tu mes. Te esperamos.',
      postventa:
        'Hola [Cliente], queremos saber cómo va tu adaptación a tus nuevos lentes. Si sientes alguna molestia, agenda una revisión sin costo con nosotros.'
    },
    email: {
      control:
        'Estimado/a [Cliente], le saludamos de Opticalia. Le recordamos que ha transcurrido un año desde su examen visual anterior. Le sugerimos agendar su control preventivo anual sin costo.',
      cumple:
        'Estimado/a [Cliente], de parte de todo el equipo de Opticalia le deseamos un feliz cumpleaños. Queremos celebrar con usted obsequiándole un 20% de descuento en monturas durante este mes.',
      postventa:
        'Estimado/a [Cliente], le escribimos para realizar el seguimiento de adaptación a sus nuevos lentes. Si presenta alguna incomodidad, no dude en agendar una cita de control sin costo.'
    }
  })

  // La sede efectiva: la asesora queda fija a su sede asignada; la gerente elige.
  const sede: SedeVista =
    user?.rol === 'asesora' ? (asignaciones[user.id] ?? 'CD Centrochía') : sedeGerente

  const data = useMemo(() => vvDataset(sede), [sede])

  const value: VVState = {
    user,
    empleados: VV_EMPLEADOS,
    login: (id) => {
      const emp = VV_EMPLEADOS.find((e) => e.id === id)
      if (emp) {
        setUser(emp)
        if (emp.rol === 'gerente') setSedeGerente('Todas las sedes')
      }
    },
    logout: () => setUser(null),
    sede,
    setSede: (s) => {
      if (user?.rol === 'gerente') setSedeGerente(s)
    },
    puedeCambiarSede: user?.rol === 'gerente',
    asignaciones,
    setAsignacion: (asesoraId, s) => setAsignaciones((a) => ({ ...a, [asesoraId]: s })),
    theme,
    toggleTheme: () => setTheme((t) => (t === 'g100' ? 'g10' : 'g100')),
    acento,
    setAcento,
    data,
    templates,
    setTemplates
  }

  return <VVContext.Provider value={value}>{children}</VVContext.Provider>
}

export function useVV(): VVState {
  const ctx = useContext(VVContext)
  if (!ctx) throw new Error('useVV debe usarse dentro de <VVProvider>')
  return ctx
}

/* Variables CSS que aplica el acento elegido (recolorean botones, links, foco, activos) */
export function acentoVars(a: Acento): React.CSSProperties {
  const hex = a.hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return {
    ['--cds-button-primary' as string]: a.hex,
    ['--cds-button-primary-hover' as string]: a.hover,
    ['--cds-button-primary-active' as string]: a.hover,
    ['--cds-link-primary' as string]: a.hex,
    ['--cds-link-primary-hover' as string]: a.hover,
    ['--cds-border-interactive' as string]: a.hex,
    ['--cds-interactive' as string]: a.hex,
    ['--cds-focus' as string]: a.hex,
    ['--vv-accent' as string]: a.hex,
    ['--vv-accent-rgb' as string]: `${r}, ${g}, ${b}`
  } as React.CSSProperties
}
