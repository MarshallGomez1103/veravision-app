/* Vera Vision — Dashboard (Inicio) */
import { useState } from 'react'
import { View, Time, Star, Download, Add } from '@carbon/icons-react'
import {
  PageHeader,
  MetricTile,
  CardHead,
  Card,
  LegendDot,
  Status,
  Avatar,
  Tag,
  Btn
} from '@renderer/components/primitives/Common'
import { GroupedBarChart, DonutChart } from '@renderer/components/primitives/Charts'
import { EmptyState, ErrorState, SkeletonBox } from '@renderer/components/primitives/States'
import type { VistaEstado } from '@renderer/components/primitives/States'
import { VV_MOTIVO, VV_HIST_ESTADO, VV_TITULO } from '@renderer/data'
import { useVV } from '@renderer/state/app-context'
import type { Cliente } from '@renderer/data/types'
import type { Page } from '@renderer/App'

interface DashboardProps {
  onNav: (p: Page) => void
  onCrear: () => void
  onAbrirCliente: (cli: Cliente) => void
}

export function Dashboard({ onNav, onCrear, onAbrirCliente }: DashboardProps): React.JSX.Element {
  const { data } = useVV()
  const [estado, setEstado] = useState<VistaEstado>('ready')
  const k = data.kpi
  const atencion = data.recordatorios.filter((r) => r.estado === 'pendiente').slice(0, 4)
  const reciente = data.historial.slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Inicio"
        helper="Resumen de actividad y relación con clientes · 22 de abril, 2026"
      >
        <Btn kind="tertiary" size="md" iconLeft={<Download size={16} />}>
          Exportar
        </Btn>
        <Btn kind="primary" size="md" iconLeft={<Add size={16} />} onClick={onCrear}>
          Nuevo recordatorio
        </Btn>
      </PageHeader>

      <DemoEstados value={estado} onChange={setEstado} />

      {estado === 'loading' && <DashboardSkeleton />}

      {estado === 'error' && (
        <ErrorState
          title="Error al cargar el resumen de actividad"
          message="No se pudieron obtener las estadísticas de la sede de Opticalia. Revisa tu conexión con la red interna y vuelve a intentarlo."
          onRetry={() => setEstado('ready')}
        />
      )}

      {estado === 'empty' && (
        <EmptyState
          icon={<View size={28} />}
          title="Sede sin datos de actividad"
          message="Esta sede no cuenta con actividad de clientes ni recordatorios programados todavía. Registra clientes o empieza a programar recordatorios para ver las métricas."
          actionLabel="Programar primer recordatorio"
          onAction={onCrear}
        />
      )}

      {estado === 'ready' && (
        <>
          {/* KPIs */}
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
              label="Clientes activos"
              value={k.activos}
              delta={`${k.activosDelta} este mes`}
              deltaDir="up"
              spark={[120, 124, 128, 131, 136, 142]}
              sparkColor="#0f62fe"
            />
            <MetricTile
              label="En riesgo de pérdida"
              value={k.riesgo}
              foot={`${k.riesgoCrit} críticos`}
              accent="var(--cds-support-warning)"
              spark={[44, 42, 41, 40, 39, 38]}
              sparkColor="var(--cds-support-warning)"
            />
            <MetricTile
              label="Recordatorios pendientes"
              value={k.pendientes}
              foot={`${k.programados} programados`}
              spark={[9, 11, 10, 13, 14, 15]}
              sparkColor="#0f62fe"
            />
            <MetricTile
              label="Tasa de respuesta"
              value={k.tasaRespuesta}
              unit="%"
              delta={`${k.tasaDelta}%`}
              deltaDir="up"
              spark={[26, 28, 27, 30, 32, 34]}
              sparkColor="var(--cds-support-success)"
            />
          </div>

          {/* Gráficas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 24,
              marginBottom: 24
            }}
          >
            <Card>
              <CardHead
                title="Mensajes enviados vs. respondidos"
                action="Ver historial"
                onAction={() => onNav('historial')}
              />
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 24, marginBottom: 4 }}>
                  <LegendDot color="#0f62fe" label="Enviados" />
                  <LegendDot color="#78a9ff" label="Respondidos" />
                </div>
                <GroupedBarChart data={data.serie} height={236} />
              </div>
            </Card>

            <Card>
              <CardHead title="Cartera por segmento" />
              <div
                style={{
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 18
                }}
              >
                <DonutChart
                  data={data.segmentos}
                  centerValue={k.activos + k.riesgo + k.perdidos}
                  centerLabel="clientes"
                />
                <div style={{ display: 'grid', gap: 10, width: '100%' }}>
                  {data.segmentos.map((s) => (
                    <LegendDot key={s.key} color={s.color} label={s.label} value={s.valor} />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Atención + Actividad */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <Card>
              <CardHead
                title="Requiere atención hoy"
                action="Ver todos"
                onAction={() => onNav('recordatorios')}
              />
              <div>
                {atencion.map((r, i) => {
                  const cli = data.cliente(r.cli)
                  if (!cli) return null
                  const mot = VV_MOTIVO[r.tipo]
                  const MIcon = r.tipo === 'control' ? View : r.tipo === 'cumple' ? Star : Time
                  return (
                    <div
                      key={r.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        borderTop: i ? '1px solid var(--cds-border-subtle-01)' : 'none'
                      }}
                    >
                      <Avatar ini={cli.ini} size={32} seed={cli.id} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: 'var(--cds-text-primary)'
                          }}
                        >
                          {cli.nombre}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--cds-text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {mot.label} · {r.dias > 0 ? `${r.dias} meses sin contacto` : 'hoy'}
                        </div>
                      </div>
                      <Tag color={mot.tag} icon={<MIcon size={12} />}>
                        {mot.label}
                      </Tag>
                      <Btn kind="ghost" size="sm" onClick={onCrear}>
                        Enviar
                      </Btn>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card>
              <CardHead
                title="Actividad reciente"
                action="Ver historial"
                onAction={() => onNav('historial')}
              />
              <div>
                {reciente.map((h, i) => {
                  const cli = data.cliente(h.cli)
                  if (!cli) return null
                  const est = VV_HIST_ESTADO[h.estado]
                  return (
                    <div
                      key={h.id}
                      onClick={() => onAbrirCliente(cli)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderTop: i ? '1px solid var(--cds-border-subtle-01)' : 'none'
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'var(--cds-layer-hover-01)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Avatar ini={cli.ini} size={32} seed={cli.id} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: 'var(--cds-text-primary)'
                          }}
                        >
                          {cli.nombre}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--cds-text-secondary)' }}>
                          {VV_TITULO[h.tipo]} · {h.canal}
                        </div>
                      </div>
                      <Status kind={est.status} size={13}>
                        {est.label}
                      </Status>
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--cds-text-helper)',
                          width: 48,
                          textAlign: 'right'
                        }}
                      >
                        {h.fecha}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

/* Skeleton del Dashboard completo */
function DashboardSkeleton(): React.JSX.Element {
  return (
    <div>
      {/* KPIs Skeleton */}
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
            <SkeletonBox w="50%" h={12} style={{ marginTop: 12 }} />
          </div>
        ))}
      </div>

      {/* Gráficas Skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 24,
          marginBottom: 24
        }}
      >
        <div
          style={{
            background: 'var(--cds-layer-01)',
            border: '1px solid var(--cds-border-subtle-01)',
            padding: 16,
            height: 310,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <SkeletonBox w="30%" h={16} />
          <SkeletonBox w="100%" h="80%" />
        </div>

        <div
          style={{
            background: 'var(--cds-layer-01)',
            border: '1px solid var(--cds-border-subtle-01)',
            padding: 16,
            height: 310,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center'
          }}
        >
          <div style={{ width: '100%' }}>
            <SkeletonBox w="55%" h={16} />
          </div>
          <SkeletonBox w={140} h={140} style={{ borderRadius: '50%', marginTop: 12 }} />
          <div style={{ width: '100%', display: 'grid', gap: 8, marginTop: 12 }}>
            <SkeletonBox w="90%" h={12} />
            <SkeletonBox w="80%" h={12} />
          </div>
        </div>
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
