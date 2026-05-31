/* Vera Vision — Configuración (con contenido real) */
import { useState } from 'react'
import { Light, Asleep, Location, Checkmark, UserAvatar, Notification, Settings } from '@carbon/icons-react'
import { PageHeader, Card, CardHead, Btn, Tag } from '@renderer/components/primitives/Common'
import { EmptyState, ErrorState, SkeletonBox } from '@renderer/components/primitives/States'
import type { VistaEstado } from '@renderer/components/primitives/States'
import { useVV, VV_ACENTOS } from '@renderer/state/app-context'
import { VV_SEDES } from '@renderer/data'
import type { ToastData } from '@renderer/components/primitives/Common'
import type { Motivo } from '@renderer/data/types'

export function Configuracion({
  fireToast
}: {
  fireToast: (t: ToastData) => void
}): React.JSX.Element {
  const { theme, toggleTheme, acento, setAcento, sede, setSede, user, data, templates, setTemplates } = useVV()
  const [estado, setEstado] = useState<VistaEstado>('ready')
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'email'>('whatsapp')

  return (
    <div>
      <PageHeader title="Configuración" helper="Personaliza la apariencia, tu sede y tu cuenta" />

      <DemoEstados value={estado} onChange={setEstado} />

      {estado === 'loading' && <ConfigSkeleton />}

      {estado === 'error' && (
        <ErrorState
          title="Fallo al cargar preferencias"
          message="No pudimos obtener la configuración de tu cuenta del servidor local. Inténtalo de nuevo."
          onRetry={() => setEstado('ready')}
        />
      )}

      {estado === 'empty' && (
        <EmptyState
          icon={<Settings size={28} />}
          title="Preferencias vacías"
          message="No hay configuraciones registradas para este perfil en la sede seleccionada."
          actionLabel="Cargar perfil por defecto"
          onAction={() => setEstado('ready')}
        />
      )}

      {estado === 'ready' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Apariencia */}
          <Card>
            <CardHead title="Apariencia" />
            <div style={{ padding: 16, display: 'grid', gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--cds-text-secondary)', marginBottom: 8 }}>
                  Tema
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn
                    kind={theme === 'g10' ? 'primary' : 'tertiary'}
                    size="md"
                    iconLeft={<Light size={16} />}
                    onClick={() => theme !== 'g10' && toggleTheme()}
                  >
                    Claro
                  </Btn>
                  <Btn
                    kind={theme === 'g100' ? 'primary' : 'tertiary'}
                    size="md"
                    iconLeft={<Asleep size={16} />}
                    onClick={() => theme !== 'g100' && toggleTheme()}
                  >
                    Oscuro
                  </Btn>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: 'var(--cds-text-secondary)', marginBottom: 8 }}>
                  Color de acento
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {VV_ACENTOS.map((a) => {
                    const on = a.hex === acento.hex
                    return (
                      <button
                        key={a.hex}
                        type="button"
                        title={a.nombre}
                        onClick={() => {
                          setAcento(a)
                          fireToast({ kind: 'success', title: 'Acento actualizado', message: a.nombre })
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: a.hex,
                          border: on ? '2px solid var(--cds-text-primary)' : '2px solid transparent',
                          outline: on ? '2px solid var(--cds-background)' : 'none',
                          outlineOffset: -4,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}
                      >
                        {on && <Checkmark size={20} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Sede */}
          <Card>
            <CardHead title="Sede activa" />
            <div style={{ padding: 16, display: 'grid', gap: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--cds-text-secondary)', marginBottom: 4 }}>
                Cambiar de sede actualiza la cartera, los KPIs y el historial.
              </div>
              {VV_SEDES.map((s) => {
                const on = s === sede
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSede(s)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                      background: 'var(--cds-layer-01)',
                      border: on
                        ? '1px solid var(--cds-border-interactive)'
                        : '1px solid var(--cds-border-subtle-01)',
                      fontFamily: 'IBM Plex Sans, system-ui, sans-serif'
                    }}
                  >
                    <Location size={20} style={{ color: 'var(--cds-link-primary)' }} />
                    <span style={{ flex: 1 }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--cds-text-primary)'
                        }}
                      >
                        {s}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--cds-text-secondary)' }}>
                        {s === sede ? `${data.clientes.length} clientes en cartera` : 'Tocar para activar'}
                      </span>
                    </span>
                    {on && <Tag color="green">Activa</Tag>}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Cuenta */}
          <Card>
            <CardHead title="Cuenta" />
            <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--cds-button-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 600
                }}
              >
                {user?.ini}
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--cds-text-primary)' }}>
                  {user?.nombre}
                </div>
                <div style={{ fontSize: 13, color: 'var(--cds-text-secondary)', textTransform: 'capitalize' }}>
                  {user?.rol} · Opticalia
                </div>
              </div>
              <span style={{ flex: 1 }} />
              <UserAvatar size={24} style={{ color: 'var(--cds-icon-secondary)' }} />
            </div>
          </Card>

          {/* Notificaciones (preferencias) */}
          <Card>
            <CardHead title="Notificaciones" />
            <div style={{ padding: 16, display: 'grid', gap: 12 }}>
              {[
                'Avisar cuando un cliente entra en riesgo',
                'Recordarme los envíos pendientes del día',
                'Notificar respuestas de clientes'
              ].map((t) => (
                <label
                  key={t}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--cds-text-primary)' }}
                >
                  <Notification size={16} style={{ color: 'var(--cds-link-primary)' }} />
                  {t}
                  <span style={{ flex: 1 }} />
                  <Tag color="green">Activa</Tag>
                </label>
              ))}
            </div>
          </Card>

          {/* Configurar mensajes predeterminados (Plantillas) */}
          <Card style={{ gridColumn: 'span 2' }}>
            <CardHead title="Configurar mensajes predeterminados (Plantillas)" />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <Btn
                  kind={selectedChannel === 'whatsapp' ? 'primary' : 'tertiary'}
                  size="sm"
                  onClick={() => setSelectedChannel('whatsapp')}
                >
                  WhatsApp
                </Btn>
                <Btn
                  kind={selectedChannel === 'email' ? 'primary' : 'tertiary'}
                  size="sm"
                  onClick={() => setSelectedChannel('email')}
                >
                  Email
                </Btn>
              </div>

              {user?.rol !== 'gerente' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: 'var(--cds-layer-accent-01)',
                    fontSize: 13,
                    color: 'var(--cds-text-secondary)',
                    marginBottom: 16,
                    borderLeft: '3px solid var(--cds-support-warning)'
                  }}
                >
                  Solo el perfil de <b>Gerente</b> ({data.clientes.length ? 'Marlen Vera' : 'Marlen Vera'}) puede editar las plantillas predeterminadas de envío.
                </div>
              )}

              <div style={{ display: 'grid', gap: 16 }}>
                {(['control', 'cumple', 'postventa'] as Motivo[]).map((mot) => {
                  const labels = {
                    control: 'Control Anual',
                    cumple: 'Cumpleaños',
                    postventa: 'Post-venta'
                  }
                  return (
                    <div key={mot}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 13,
                          fontWeight: 600,
                          marginBottom: 6,
                          color: 'var(--cds-text-primary)'
                        }}
                      >
                        {labels[mot]}
                      </label>
                      <textarea
                        disabled={user?.rol !== 'gerente'}
                        value={templates[selectedChannel][mot]}
                        onChange={(e) => {
                          const val = e.target.value
                          setTemplates((prev) => ({
                            ...prev,
                            [selectedChannel]: {
                              ...prev[selectedChannel],
                              [mot]: val
                            }
                          }))
                        }}
                        style={{
                          width: '100%',
                          height: 72,
                          padding: 10,
                          boxSizing: 'border-box',
                          background: 'var(--cds-field-01)',
                          border: '1px solid var(--cds-border-strong-01)',
                          color: 'var(--cds-text-primary)',
                          fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
                          fontSize: 14,
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                      <div style={{ fontSize: 11, color: 'var(--cds-text-helper)', marginTop: 4 }}>
                        Usa <code>[Cliente]</code> para insertar el nombre del cliente automáticamente.
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

/* Skeleton del panel de configuración completo */
function ConfigSkeleton(): React.JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <div style={{ padding: 16 }}>
            <SkeletonBox w="50%" h={18} />
            <SkeletonBox w="100%" h={80} style={{ marginTop: 16 }} />
          </div>
        </Card>
      ))}
      <Card style={{ gridColumn: 'span 2' }}>
        <div style={{ padding: 16 }}>
          <SkeletonBox w="30%" h={18} />
          <SkeletonBox w="100%" h={120} style={{ marginTop: 16 }} />
        </div>
      </Card>
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
