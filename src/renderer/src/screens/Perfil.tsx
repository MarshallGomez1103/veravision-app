/* Vera Vision — Mi Perfil: información personal, estadísticas de rendimiento y actividad */
import { useState } from 'react'
import {
  UserAvatar,
  Email,
  Phone,
  Calendar,
  Enterprise
} from '@carbon/icons-react'
import { PageHeader, Card, CardHead, Tag } from '@renderer/components/primitives/Common'
import { EmptyState, ErrorState, SkeletonBox } from '@renderer/components/primitives/States'
import type { VistaEstado } from '@renderer/components/primitives/States'
import { useVV } from '@renderer/state/app-context'
import type { ToastData } from '@renderer/components/primitives/Common'

export function Perfil({
  fireToast
}: {
  fireToast: (t: ToastData) => void
}): React.JSX.Element {
  const { user, data } = useVV()
  const [estado, setEstado] = useState<VistaEstado>('ready')

  // Obtener estadísticas de rendimiento simuladas basadas en el usuario
  const stats = {
    gerente: [
      { label: 'Sedes coordinadas', value: '2', sub: 'Centrochía y Tocancipá' },
      { label: 'Plantillas activas', value: '6', sub: '3 WhatsApp · 3 Email' },
      { label: 'Mensajes totales enviados', value: '184', sub: 'Este mes' },
      { label: 'Tasa de efectividad', value: '92%', sub: '+4.5% vs. mes anterior' }
    ],
    asesora: [
      { label: 'Clientes en seguimiento', value: '45', sub: 'Asignados en tu sede' },
      { label: 'Recordatorios enviados', value: '38', sub: 'Este mes por ti' },
      { label: 'Tasa de lectura', value: '88%', sub: 'WhatsApp & Email' },
      { label: 'Clientes reactivados', value: '12', sub: 'Retornaron este mes' }
    ]
  }[user?.rol === 'gerente' ? 'gerente' : 'asesora']

  // Actividades recientes simuladas
  const actividades = {
    gerente: [
      { text: 'Consultó el reporte de efectividad consolidado', time: 'hace 10 minutos', icon: '📊' },
      { text: 'Modificó plantilla predeterminada de WhatsApp para Control Anual', time: 'hace 1 hora', icon: '📝' },
      { text: 'Asignó a asesora Alejandra Chiquito a la sede CD Tocancipá', time: 'hace 3 horas', icon: '📍' },
      { text: 'Inició sesión en la consola administrativa de VeraVision', time: 'hace 5 horas', icon: '🔑' }
    ],
    asesora: [
      { text: 'Envió recordatorio de control anual a María López por WhatsApp', time: 'hace 5 minutos', icon: '💬' },
      { text: 'Registró confirmación de asistencia de Carlos Ruiz para examen', time: 'hace 45 minutos', icon: '✅' },
      { text: 'Creó borrador de recordatorio de cumpleaños para Ana Torres', time: 'hace 2 horas', icon: '🎂' },
      { text: 'Inició sesión en la sede activa de CD Centrochía', time: 'hace 4 horas', icon: '💻' }
    ]
  }[user?.rol === 'gerente' ? 'gerente' : 'asesora']

  return (
    <div>
      <PageHeader
        title="Mi Perfil"
        helper="Información de tu cuenta, estadísticas de rendimiento y actividad reciente"
      />

      <DemoEstados value={estado} onChange={setEstado} />

      {estado === 'loading' && <PerfilSkeleton />}

      {estado === 'error' && (
        <ErrorState
          title="Fallo al cargar información del perfil"
          message="No pudimos conectar con el servidor local para obtener tus estadísticas de rendimiento. Inténtalo de nuevo."
          onRetry={() => setEstado('ready')}
        />
      )}

      {estado === 'empty' && (
        <EmptyState
          icon={<UserAvatar size={28} />}
          title="Perfil sin datos"
          message="No se encontraron registros de rendimiento ni actividad reciente asociados a tu cuenta de usuario."
          actionLabel="Re-vincular cuenta"
          onAction={() => {
            setEstado('ready')
            fireToast({
              kind: 'success',
              title: 'Cuenta vinculada',
              message: 'Los datos del usuario se cargaron correctamente.'
            })
          }}
        />
      )}

      {estado === 'ready' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
          {/* Tarjeta de información personal */}
          <Card>
            <div
              style={{
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderBottom: '1px solid var(--cds-border-subtle-01)'
              }}
            >
              {/* Avatar grande y estilizado */}
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--vv-accent, #0f62fe) 0%, #393939 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  marginBottom: 16
                }}
              >
                {user?.ini}
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 600,
                  color: 'var(--cds-text-primary)'
                }}
              >
                {user?.nombre}
              </h2>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Tag color={user?.rol === 'gerente' ? 'green' : 'blue'}>
                  {user?.rol === 'gerente' ? 'Gerente' : 'Asesora'}
                </Tag>
                <Tag color="gray">Opticalia</Tag>
              </div>
            </div>

            <div style={{ padding: 24, display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Enterprise size={18} style={{ color: 'var(--cds-icon-secondary)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: 'var(--cds-text-helper)' }}>Sede asignada</div>
                  <div style={{ fontSize: 14, color: 'var(--cds-text-primary)', fontWeight: 500 }}>
                    {user?.rol === 'gerente' ? 'Sedes Globales' : data.clientes.length > 20 ? 'CD Centrochía' : 'CD Tocancipá'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Email size={18} style={{ color: 'var(--cds-icon-secondary)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: 'var(--cds-text-helper)' }}>Correo corporativo</div>
                  <div style={{ fontSize: 14, color: 'var(--cds-text-primary)' }}>
                    {user?.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Phone size={18} style={{ color: 'var(--cds-icon-secondary)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: 'var(--cds-text-helper)' }}>Teléfono directo</div>
                  <div style={{ fontSize: 14, color: 'var(--cds-text-primary)' }}>
                    {user?.telefono}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={18} style={{ color: 'var(--cds-icon-secondary)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: 'var(--cds-text-helper)' }}>Miembro desde</div>
                  <div style={{ fontSize: 14, color: 'var(--cds-text-primary)' }}>
                    {user?.desde}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div style={{ display: 'grid', gap: 24 }}>
            {/* Tarjeta de métricas de rendimiento */}
            <Card>
              <CardHead title="Rendimiento de Gestión" />
              <div
                style={{
                  padding: 20,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 16
                }}
              >
                {stats?.map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--cds-layer-02)',
                      border: '1px solid var(--cds-border-subtle-01)',
                      padding: 16,
                      borderRadius: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--cds-text-secondary)' }}>
                      {stat.label}
                    </span>
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: 'var(--cds-link-primary)'
                      }}
                    >
                      {stat.value}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--cds-text-helper)' }}>
                      {stat.sub}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tarjeta de actividad reciente */}
            <Card>
              <CardHead title="Bitácora de Actividad Reciente" />
              <div style={{ padding: '8px 20px 20px' }}>
                <div style={{ display: 'grid', gap: 12 }}>
                  {actividades?.map((act, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                        padding: '12px 0',
                        borderBottom: i < actividades.length - 1 ? '1px solid var(--cds-border-subtle-01)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: 20, marginTop: 2 }}>{act.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, color: 'var(--cds-text-primary)' }}>
                          {act.text}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--cds-text-helper)', marginTop: 4 }}>
                          {act.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

/* Skeleton del panel de perfil completo */
function PerfilSkeleton(): React.JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
      <Card>
        <div
          style={{
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderBottom: '1px solid var(--cds-border-subtle-01)'
          }}
        >
          {/* Avatar circular skeleton */}
          <SkeletonBox w={96} h={96} style={{ borderRadius: '50%', marginBottom: 16 }} />
          <SkeletonBox w="60%" h={18} />
          <SkeletonBox w="40%" h={12} style={{ marginTop: 12 }} />
        </div>
        <div style={{ padding: 24, display: 'grid', gap: 20 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <SkeletonBox w={18} h={18} />
              <div style={{ flex: 1 }}>
                <SkeletonBox w="30%" h={10} />
                <SkeletonBox w="70%" h={12} style={{ marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 24 }}>
        <Card>
          <div style={{ padding: 16 }}>
            <SkeletonBox w="25%" h={16} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                marginTop: 16
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--cds-layer-02)', padding: 16 }}>
                  <SkeletonBox w="50%" h={12} />
                  <SkeletonBox w="30%" h={28} style={{ marginTop: 12 }} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: 16 }}>
            <SkeletonBox w="30%" h={16} />
            <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12 }}>
                  <SkeletonBox w={24} h={24} style={{ borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <SkeletonBox w="80%" h={12} />
                    <SkeletonBox w="20%" h={10} style={{ marginTop: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
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
