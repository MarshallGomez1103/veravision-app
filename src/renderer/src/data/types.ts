/* Vera Vision — tipos de datos compartidos */

export type Sede = 'CD Centrochía' | 'CD Tocancipá'
export type SedeVista = Sede | 'Todas las sedes'
export type Rol = 'gerente' | 'asesora'

export interface Usuario {
  id: string
  nombre: string
  ini: string
  rol: Rol
  email: string
}

export interface Empleado extends Usuario {
  telefono: string
  desde: string
}

export interface Notificacion {
  id: string
  tipo: 'riesgo' | 'recordatorio' | 'respuesta' | 'sistema'
  titulo: string
  detalle: string
  fecha: string
  leida: boolean
}

export type Segmento = 'activo' | 'riesgo' | 'perdido'
export type Motivo = 'control' | 'cumple' | 'postventa'
export type Canal = 'WhatsApp' | 'Email'
export type EstadoRecordatorio = 'pendiente' | 'programado' | 'enviado'
export type EstadoHistorial = 'respondido' | 'leido' | 'entregado' | 'sin-leer'

export interface Cliente {
  id: string
  nombre: string
  ini: string
  seg: Segmento
  motivo: Motivo | null
  ultima: number
  tel: string
  email: string
  compra: string
  monto: number
  cumple: string
  canal: Canal
}

export interface Recordatorio {
  id: string
  cli: string
  tipo: Motivo
  estado: EstadoRecordatorio
  fecha: string
  dias: number
  canal: Canal
}

export interface MensajeHistorial {
  id: string
  cli: string
  tipo: Motivo
  estado: EstadoHistorial
  fecha: string
  canal: Canal
}

export interface KPIs {
  activos: number
  activosDelta: number
  riesgo: number
  riesgoCrit: number
  perdidos: number
  recuperados: number
  pendientes: number
  programados: number
  enviadosMes: number
  leidos: number
  tasaRespuesta: number
  tasaDelta: number
  ingresoMes: number
}

export interface SerieMensual {
  mes: string
  enviados: number
  respondidos: number
}

export interface SegmentoData {
  key: Segmento
  label: string
  valor: number
  color: string
}

export interface TipoData {
  label: string
  valor: number
  color: string
}

export interface SegConfig {
  label: string
  tag: 'green' | 'gray' | 'yellow' | 'red'
  status: 'active' | 'pending' | 'inactive' | 'failed'
}

export interface MotivoConfig {
  label: string
  icon: string
  tag: 'blue' | 'purple' | 'cyan'
}

export interface HistEstadoConfig {
  label: string
  status: 'active' | 'info' | 'inactive' | 'pending'
}
