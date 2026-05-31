/* Vera Vision — Empleados (panel de la gerente) */
import { Email, Phone, Location, Calendar } from '@carbon/icons-react'
import {
  PageHeader,
  Card,
  CardHead,
  Tag,
  CarbonSelect
} from '@renderer/components/primitives/Common'
import type { ToastData } from '@renderer/components/primitives/Common'
import { useVV } from '@renderer/state/app-context'
import { VV_SEDES, vvAvatarColor } from '@renderer/data'
import type { Sede } from '@renderer/data/types'

export function Empleados({ fireToast }: { fireToast: (t: ToastData) => void }): React.JSX.Element {
  const { empleados, asignaciones, setAsignacion } = useVV()
  const gerente = empleados.find((e) => e.rol === 'gerente')
  const asesoras = empleados.filter((e) => e.rol === 'asesora')

  return (
    <div>
      <PageHeader title="Empleados" helper="Tu equipo y la sede que cada asesora tiene asignada" />

      {gerente && (
        <Card style={{ marginBottom: 24 }}>
          <CardHead title="Gerencia" />
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar emp={gerente.ini} seed={gerente.id} size={56} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--cds-text-primary)' }}>
                {gerente.nombre}
              </div>
              <Row icon={<Email size={14} />}>{gerente.email}</Row>
              <Row icon={<Phone size={14} />}>{gerente.telefono}</Row>
            </div>
            <Tag color="purple">Gerente</Tag>
          </div>
        </Card>
      )}

      <div
        style={{
          fontSize: 12,
          letterSpacing: '.32px',
          textTransform: 'uppercase',
          color: 'var(--cds-text-helper)',
          margin: '0 0 12px'
        }}
      >
        Asesoras ({asesoras.length})
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 16
        }}
      >
        {asesoras.map((a) => {
          const sede = asignaciones[a.id] ?? 'CD Centrochía'
          return (
            <Card key={a.id}>
              <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar emp={a.ini} seed={a.id} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--cds-text-primary)' }}>
                    {a.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--cds-text-secondary)' }}>Asesora</div>
                </div>
                <Tag color="green">{sede}</Tag>
              </div>
              <div
                style={{
                  padding: '0 16px 12px',
                  display: 'grid',
                  gap: 4,
                  borderBottom: '1px solid var(--cds-border-subtle-01)'
                }}
              >
                <Row icon={<Email size={14} />}>{a.email}</Row>
                <Row icon={<Phone size={14} />}>{a.telefono}</Row>
                <Row icon={<Calendar size={14} />}>En el equipo desde {a.desde}</Row>
              </div>
              <div style={{ padding: 16 }}>
                <CarbonSelect
                  label="Sede asignada"
                  value={sede}
                  options={[...VV_SEDES]}
                  onChange={(v) => {
                    setAsignacion(a.id, v as Sede)
                    fireToast({
                      kind: 'success',
                      title: 'Sede actualizada',
                      message: `${a.nombre.split(' ')[0]} ahora ve solo ${v}.`
                    })
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--cds-text-helper)',
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Location size={12} />
                  Solo verá la información de su sede asignada.
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Row({
  icon,
  children
}: {
  icon: React.ReactNode
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: 'var(--cds-text-secondary)',
        marginTop: 4
      }}
    >
      <span style={{ color: 'var(--cds-icon-secondary)', display: 'flex' }}>{icon}</span>
      {children}
    </div>
  )
}

function Avatar({
  emp,
  seed,
  size
}: {
  emp: string
  seed: string
  size: number
}): React.JSX.Element {
  return (
    <span
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '50%',
        background: vvAvatarColor(seed),
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.34,
        fontWeight: 600
      }}
    >
      {emp}
    </span>
  )
}
