/* Vera Vision — Historial de mensajes */
import { Download, View, Renew, Copy, Time } from '@carbon/icons-react'
import {
  PageHeader,
  MetricTile,
  Tabs,
  Status,
  Avatar,
  OverflowMenu,
  Btn
} from '@renderer/components/primitives/Common'
import type { ToastData } from '@renderer/components/primitives/Common'
import { EmptyState, ErrorState, SkeletonBox } from '@renderer/components/primitives/States'
import type { VistaEstado } from '@renderer/components/primitives/States'
import { VV_HIST_ESTADO, VV_TITULO, vvFmtMonto } from '@renderer/data'
import { useVV } from '@renderer/state/app-context'
import type { Cliente } from '@renderer/data/types'
import { useState } from 'react'
import type { Page } from '@renderer/App'

interface HistorialProps {
  onAbrirCliente: (cli: Cliente) => void
  fireToast: (t: ToastData) => void
  onNav: (p: Page) => void
}

export function Historial({ onAbrirCliente, fireToast, onNav }: HistorialProps): React.JSX.Element {
  const { data } = useVV()
  const [estado, setEstado] = useState<VistaEstado>('ready')
  const [tab, setTab] = useState('todos')
  const [query, setQuery] = useState('')
  const k = data.kpi

  const counts = {
    todos: data.historial.length,
    respondido: data.historial.filter((h) => h.estado === 'respondido').length,
    leido: data.historial.filter((h) => h.estado === 'leido').length,
    'sin-leer': data.historial.filter((h) => h.estado === 'sin-leer').length
  }

  const tabs = [
    { value: 'todos', label: 'Todos', count: counts.todos },
    { value: 'respondido', label: 'Respondidos', count: counts.respondido },
    { value: 'leido', label: 'Leídos', count: counts.leido },
    { value: 'sin-leer', label: 'Sin leer', count: counts['sin-leer'] }
  ]

  const rows = data.historial
    .filter((h) => tab === 'todos' || h.estado === tab)
    .filter((h) => {
      const c = data.cliente(h.cli)
      return !query || (c?.nombre ?? '').toLowerCase().includes(query.toLowerCase())
    })

  return (
    <div>
      <PageHeader title="Historial" helper="Registro de todos los mensajes enviados a tus clientes">
        <Btn
          kind="tertiary"
          size="md"
          iconLeft={<Download size={16} />}
          onClick={() =>
            fireToast({
              kind: 'info',
              title: 'Exportando reporte',
              message: 'Generando CSV del historial…'
            })
          }
        >
          Exportar reporte
        </Btn>
      </PageHeader>

      <DemoEstados value={estado} onChange={setEstado} />

      {estado === 'loading' && <HistorialSkeleton />}

      {estado === 'error' && (
        <ErrorState
          title="Fallo de conexión con la bitácora"
          message="Ocurrió un error al cargar la base de datos histórica de mensajes. Verifica tu acceso al servidor local o reintenta la operación."
          onRetry={() => setEstado('ready')}
        />
      )}

      {estado === 'empty' && (
        <EmptyState
          icon={<Time size={28} />}
          title="Historial de envíos vacío"
          message="Aún no se ha registrado ningún envío de mensajes en esta sede. En cuanto comiences a enviar recordatorios automáticos por WhatsApp o Email a tus clientes, verás las bitácoras aquí."
          actionLabel="Ir a Recordatorios"
          onAction={() => onNav('recordatorios')}
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
              label="Enviados este mes"
              value={k.enviadosMes}
              delta="11%"
              deltaDir="up"
              spark={[31, 44, 38, 41, 46, 48]}
            />
            <MetricTile
              label="Leídos"
              value={k.leidos}
              foot={`${Math.round((k.leidos / k.enviadosMes) * 100)}% del total`}
              accent="var(--cds-support-info)"
            />
            <MetricTile
              label="Respondidos"
              value={data.historial.filter((h) => h.estado === 'respondido').length + 12}
              delta="3"
              deltaDir="up"
              accent="var(--cds-support-success)"
            />
            <MetricTile
              label="Reactivaciones"
              value={k.recuperados}
              unit="clientes"
              foot={`${vvFmtMonto(18400000)} en ventas`}
            />
          </div>

          <Tabs tabs={tabs} active={tab} onChange={setTab} style={{ marginBottom: 0 }} />

          <div
            style={{
              background: 'var(--cds-layer-01)',
              border: '1px solid var(--cds-border-subtle-01)',
              borderTop: 'none'
            }}
          >
            <div
              style={{
                height: 48,
                borderBottom: '1px solid var(--cds-border-subtle-01)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 16,
                  color: 'var(--cds-icon-primary)',
                  pointerEvents: 'none',
                  display: 'flex'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M29 27.586l-7.552-7.552A11 11 0 1027.586 29zm-17-4a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por cliente…"
                style={{
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  background: 'transparent',
                  padding: '0 16px 0 44px',
                  fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
                  fontSize: 14,
                  color: 'var(--cds-text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--cds-layer-accent-01)', height: 48 }}>
                    {['Cliente', 'Tipo de mensaje', 'Canal', 'Estado', 'Fecha'].map((header) => (
                      <th
                        key={header}
                        style={{
                          textAlign: 'left',
                          padding: '0 16px',
                          fontWeight: 600,
                          color: 'var(--cds-text-primary)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {header}
                      </th>
                    ))}
                    <th style={{ width: 48 }} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((h) => {
                    const cli = data.cliente(h.cli)
                    if (!cli) return null
                    const est = VV_HIST_ESTADO[h.estado]
                    const MotIcon = h.tipo === 'control' ? View : h.tipo === 'cumple' ? View : Time

                    return (
                      <tr
                        key={h.id}
                        style={{
                          height: 56,
                          borderTop: '1px solid var(--cds-border-subtle-01)'
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = 'var(--cds-layer-hover-01)')
                        }
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '0 16px' }}>
                          <span
                            onClick={() => onAbrirCliente(cli)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 12,
                              cursor: 'pointer'
                            }}
                          >
                            <Avatar ini={cli.ini} size={32} seed={cli.id} />
                            <span
                              style={{
                                color: 'var(--cds-link-primary)',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {cli.nombre}
                            </span>
                          </span>
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 8,
                              color: 'var(--cds-text-primary)'
                            }}
                          >
                            <MotIcon size={16} />
                            {VV_TITULO[h.tipo]}
                          </span>
                        </td>
                        <td style={{ padding: '0 16px', color: 'var(--cds-text-secondary)' }}>
                          {h.canal}
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          <Status kind={est.status}>{est.label}</Status>
                        </td>
                        <td
                          style={{
                            padding: '0 16px',
                            color: 'var(--cds-text-secondary)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {h.fecha}
                        </td>
                        <td style={{ padding: '0 8px' }}>
                          <OverflowMenu
                            items={[
                              {
                                label: 'Ver perfil',
                                icon: <View size={16} />,
                                onClick: () => onAbrirCliente(cli)
                              },
                              {
                                label: 'Reenviar mensaje',
                                icon: <Renew size={16} />,
                                onClick: () =>
                                  fireToast({
                                    kind: 'success',
                                    title: 'Mensaje reenviado',
                                    message: `A ${cli.nombre} por ${h.canal}.`
                                  })
                              },
                              {
                                label: 'Copiar contenido',
                                icon: <Copy size={16} />,
                                onClick: () => {}
                              }
                            ]}
                          />
                        </td>
                      </tr>
                    )
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: 48,
                          textAlign: 'center',
                          color: 'var(--cds-text-helper)'
                        }}
                      >
                        Sin mensajes en este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div
              style={{
                height: 40,
                borderTop: '1px solid var(--cds-border-subtle-01)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: 13,
                color: 'var(--cds-text-secondary)'
              }}
            >
              {rows.length} mensajes
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* Skeleton específico para el historial de mensajes */
function HistorialSkeleton(): React.JSX.Element {
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
          background: 'var(--cds-layer-01)',
          border: '1px solid var(--cds-border-subtle-01)'
        }}
      >
        <div style={{ height: 48, background: 'var(--cds-layer-accent-01)' }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderTop: '1px solid var(--cds-border-subtle-01)'
            }}
          >
            <SkeletonBox w={32} h={32} style={{ borderRadius: '50%' }} />
            <SkeletonBox w="25%" h={14} />
            <SkeletonBox w="15%" h={14} />
            <SkeletonBox w="15%" h={14} />
            <span style={{ flex: 1 }} />
            <SkeletonBox w="10%" h={14} />
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
