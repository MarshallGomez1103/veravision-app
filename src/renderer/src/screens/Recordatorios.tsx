/* Vera Vision — Recordatorios */
import { useState } from 'react'
import {
  Add,
  View,
  Time,
  Email,
  Notification,
  Calendar,
  CheckmarkOutline
} from '@carbon/icons-react'
import {
  PageHeader,
  MetricTile,
  Tabs,
  Status,
  Avatar,
  Tag,
  Btn
} from '@renderer/components/primitives/Common'
import type { ToastData } from '@renderer/components/primitives/Common'
import { EmptyState, ErrorState, SkeletonBox } from '@renderer/components/primitives/States'
import type { VistaEstado } from '@renderer/components/primitives/States'
import { VV_MOTIVO, VV_TITULO } from '@renderer/data'
import { useVV } from '@renderer/state/app-context'
import type { Page } from '@renderer/App'

interface RecordatoriosProps {
  onCrear: () => void
  fireToast: (t: ToastData) => void
  onNav: (p: Page) => void
}

export function Recordatorios({ onCrear, fireToast }: RecordatoriosProps): React.JSX.Element {
  const { data } = useVV()
  const [estado, setEstado] = useState<VistaEstado>('ready')
  const [tab, setTab] = useState('pendiente')
  const [enviados, setEnviados] = useState<Record<string, boolean>>({})
  const [enviandoIds, setEnviandoIds] = useState<Record<string, string>>({})
  const k = data.kpi

  const counts = {
    pendiente: data.recordatorios.filter((r) => r.estado === 'pendiente').length,
    programado: data.recordatorios.filter((r) => r.estado === 'programado').length,
    enviado: data.recordatorios.filter((r) => r.estado === 'enviado').length
  }

  const tabs = [
    { value: 'pendiente', label: 'Pendientes', count: counts.pendiente },
    { value: 'programado', label: 'Programados', count: counts.programado },
    { value: 'enviado', label: 'Enviados', count: counts.enviado }
  ]

  const rows = data.recordatorios.filter((r) => r.estado === tab)
  const EMOJI: Record<string, string> = { control: '👁️', cumple: '🎂', postventa: '📦' }

  const enviar = (rId: string, cliNombre: string, tipo: string, canal: string): void => {
    // Simular psicología del tiempo:
    // Menor a 1s: no se muestra nada (aquí dura más).
    // Entre 2s y 5s: Spinner + texto dinámico
    setEnviandoIds((prev) => ({ ...prev, [rId]: 'Conectando...' }))

    setTimeout(() => {
      setEnviandoIds((prev) => ({
        ...prev,
        [rId]: `Preparando ${canal === 'Email' ? 'correo' : 'WhatsApp'}...`
      }))
    }, 1000)

    setTimeout(() => {
      setEnviandoIds((prev) => ({ ...prev, [rId]: 'Enviando...' }))
    }, 2000)

    setTimeout(() => {
      setEnviandoIds((prev) => {
        const copy = { ...prev }
        delete copy[rId]
        return copy
      })
      setEnviados((e) => ({ ...e, [rId]: true }))
      fireToast({
        kind: 'success',
        title: 'Mensaje enviado',
        message: `${VV_TITULO[tipo]} enviado a ${cliNombre} por ${canal}.`
      })
    }, 3200)
  }

  return (
    <div>
      <PageHeader
        title="Recordatorios"
        helper="Mensajes automáticos para retener y reactivar clientes"
      >
        <Btn kind="primary" size="md" iconLeft={<Add size={16} />} onClick={onCrear}>
          Nuevo recordatorio
        </Btn>
      </PageHeader>

      <DemoEstados value={estado} onChange={setEstado} />

      {estado === 'loading' && <RecordatoriosSkeleton />}

      {estado === 'error' && (
        <ErrorState
          title="Error al cargar recordatorios"
          message="No pudimos conectar con el servidor de mensajería para obtener la lista. Revisa tu conexión de red local de la sede de Opticalia y vuelve a intentarlo."
          onRetry={() => setEstado('ready')}
        />
      )}

      {estado === 'empty' && (
        <EmptyState
          icon={<CheckmarkOutline size={28} style={{ color: 'var(--cds-support-success)' }} />}
          title="¡Bandeja al día! (Inbox Cero)"
          message="No tienes ningún recordatorio pendiente de envío para hoy en esta sede. Todos tus clientes han sido contactados a tiempo."
          actionLabel="Programar nuevo recordatorio"
          onAction={onCrear}
        />
      )}

      {estado === 'ready' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1,
              background: 'var(--cds-border-subtle-01)',
              marginBottom: 24
            }}
          >
            <MetricTile
              label="Pendientes de envío"
              value={k.pendientes}
              foot="requieren tu acción"
              accent="var(--cds-support-warning)"
            />
            <MetricTile label="Programados" value={k.programados} foot="próximos 7 días" />
            <MetricTile label="Enviados este mes" value={k.enviadosMes} delta="11%" deltaDir="up" />
            <MetricTile
              label="Tasa de lectura"
              value={Math.round((k.leidos / k.enviadosMes) * 100)}
              unit="%"
              foot={`${k.leidos} leídos`}
              accent="var(--cds-support-success)"
            />
          </div>

          <Tabs tabs={tabs} active={tab} onChange={setTab} style={{ marginBottom: 20 }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: 16
            }}
          >
            {rows.map((r) => {
              const cli = data.cliente(r.cli)
              if (!cli) return null
              const mot = VV_MOTIVO[r.tipo]
              const done = enviados[r.id] || r.estado === 'enviado'
              const MIcon = r.tipo === 'control' ? View : r.tipo === 'cumple' ? View : Time
              const CIcon = r.canal === 'Email' ? Email : Notification

              return (
                <div
                  key={r.id}
                  style={{
                    background: 'var(--cds-layer-01)',
                    border: '1px solid var(--cds-border-subtle-01)',
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <Avatar ini={cli.ini} size={40} seed={cli.id} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'var(--cds-text-primary)'
                        }}
                      >
                        {cli.nombre}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: 'var(--cds-text-secondary)',
                          marginTop: 2
                        }}
                      >
                        {EMOJI[r.tipo]} {VV_TITULO[r.tipo]}
                        {r.dias > 0 ? ` · ${r.dias} meses sin contacto` : ''}
                      </div>
                    </div>
                    {done ? (
                      <Status kind="active" size={13}>
                        Enviado
                      </Status>
                    ) : (
                      <Tag color={r.estado === 'programado' ? 'blue' : 'gray'}>
                        {r.estado === 'programado' ? 'Programado' : 'Pendiente'}
                      </Tag>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      fontSize: 13,
                      color: 'var(--cds-text-secondary)'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <MIcon size={14} />
                      {mot.label}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <CIcon size={14} />
                      {r.canal}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} />
                      {r.fecha}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 0, marginTop: 'auto' }}>
                    <Btn
                      kind="tertiary"
                      size="md"
                      onClick={onCrear}
                      style={{ flex: 1, justifyContent: 'flex-start' }}
                    >
                      Personalizar
                    </Btn>
                    <Btn
                      kind="primary"
                      size="md"
                      disabled={done || !!enviandoIds[r.id]}
                      onClick={() => enviar(r.id, cli.nombre, r.tipo, r.canal)}
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      {enviandoIds[r.id] ? (
                        <>
                          <span className="vv-spinner" />
                          <span>{enviandoIds[r.id]}</span>
                        </>
                      ) : done ? (
                        'Enviado'
                      ) : (
                        'Enviar ahora'
                      )}
                    </Btn>
                  </div>
                </div>
              )
            })}
          </div>

          {rows.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--cds-text-helper)' }}>
              No hay recordatorios en este estado.
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* Skeleton específico para las tarjetas de recordatorio */
function RecordatoriosSkeleton(): React.JSX.Element {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'var(--cds-border-subtle-01)',
          marginBottom: 24
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: 'var(--cds-layer-01)', padding: 16, minHeight: 110 }}>
            <SkeletonBox w="60%" h={12} />
            <SkeletonBox w="40%" h={28} style={{ marginTop: 16 }} />
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 16
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: 'var(--cds-layer-01)',
              border: '1px solid var(--cds-border-subtle-01)',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <SkeletonBox w={40} h={40} style={{ borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <SkeletonBox w="50%" h={14} />
                <SkeletonBox w="70%" h={12} style={{ marginTop: 6 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <SkeletonBox w={80} h={12} />
              <SkeletonBox w={60} h={12} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <SkeletonBox w="50%" h={32} />
              <SkeletonBox w="50%" h={32} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Selector local de estados para la demo */
function DemoEstados({
  value,
  onChange
}: {
  value: VistaEstado
  onChange: (v: VistaEstado) => void
}): React.JSX.Element {
  const opciones: { k: VistaEstado; label: string }[] = [
    { k: 'ready', label: 'Con datos' },
    { k: 'loading', label: 'Cargando' },
    { k: 'empty', label: 'Vacío' },
    { k: 'error', label: 'Error' }
  ]
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        flexWrap: 'wrap'
      }}
    >
      <span style={{ fontSize: 12, color: 'var(--cds-text-helper)' }}>Demo de estados:</span>
      <div style={{ display: 'inline-flex', border: '1px solid var(--cds-border-subtle-01)' }}>
        {opciones.map((o, i) => {
          const on = value === o.k
          return (
            <button
              key={o.k}
              type="button"
              onClick={() => onChange(o.k)}
              style={{
                height: 32,
                padding: '0 14px',
                border: 'none',
                borderLeft: i ? '1px solid var(--cds-border-subtle-01)' : 'none',
                background: on ? 'var(--cds-button-primary)' : 'var(--cds-layer-01)',
                color: on ? 'var(--cds-text-on-color)' : 'var(--cds-text-secondary)',
                fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
