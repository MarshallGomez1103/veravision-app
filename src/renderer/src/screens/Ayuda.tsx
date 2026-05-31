/* Vera Vision — Ayuda y soporte */
import { useState } from 'react'
import { ChevronDown, Email, Chat, Phone, Document } from '@carbon/icons-react'
import { PageHeader, Card, CardHead, Btn } from '@renderer/components/primitives/Common'
import type { ToastData } from '@renderer/components/primitives/Common'

const FAQ: { q: string; a: string }[] = [
  {
    q: '¿Cómo creo un recordatorio para un cliente?',
    a: 'Usa el botón "Nuevo recordatorio" del header o de cualquier pantalla. Elige el tipo (control anual, cumpleaños o post-entrega), el cliente, la fecha y el canal. Verás una vista previa del mensaje antes de guardar.'
  },
  {
    q: '¿Qué significa que un cliente esté "en riesgo"?',
    a: 'Es un cliente que lleva varios meses sin contacto y podría no volver. VeraVision los resalta en amarillo para que priorices su seguimiento antes de perderlos (rojo).'
  },
  {
    q: '¿Cómo cambio entre la sede Centrochía y Tocancipá?',
    a: 'Desde el selector de sede arriba a la izquierda, o en Configuración → Sede activa. Al cambiar, la cartera, los KPIs y el historial se actualizan a esa sede.'
  },
  {
    q: '¿Los datos se guardan en internet?',
    a: 'No. Este prototipo funciona 100% en tu equipo; ningún dato sale de la máquina. Es una demostración visual del producto.'
  },
  {
    q: '¿Por dónde se envían los mensajes?',
    a: 'Por WhatsApp (verde, mejor tasa de lectura) o Email (azul, tono más formal). Puedes elegir el canal al crear cada recordatorio.'
  }
]

export function Ayuda({ fireToast }: { fireToast: (t: ToastData) => void }): React.JSX.Element {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div>
      <PageHeader
        title="Ayuda y soporte"
        helper="Resuelve dudas y contáctanos si necesitas más ayuda"
      />

      <div
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}
      >
        {/* FAQ */}
        <Card>
          <CardHead title="Preguntas frecuentes" />
          <div>
            {FAQ.map((f, i) => {
              const on = open === i
              return (
                <div
                  key={i}
                  style={{ borderTop: i ? '1px solid var(--cds-border-subtle-01)' : 'none' }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--cds-text-primary)'
                    }}
                  >
                    <span style={{ flex: 1 }}>{f.q}</span>
                    <ChevronDown
                      size={20}
                      style={{
                        transform: on ? 'rotate(180deg)' : 'none',
                        transition: 'transform 120ms'
                      }}
                    />
                  </button>
                  {on && (
                    <div
                      style={{
                        padding: '0 16px 16px',
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: 'var(--cds-text-secondary)'
                      }}
                    >
                      {f.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Contacto */}
        <div style={{ display: 'grid', gap: 24 }}>
          <Card>
            <CardHead title="Contáctanos" />
            <div style={{ padding: 16, display: 'grid', gap: 14 }}>
              {[
                { Icon: Chat, label: 'Chat en vivo', val: 'Lun–Vie, 8am–6pm' },
                { Icon: Email, label: 'soporte@veravision.co', val: 'Respuesta en 24 h' },
                { Icon: Phone, label: '+57 601 555 0123', val: 'Línea de soporte' }
              ].map(({ Icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'var(--cds-layer-accent-01)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cds-link-primary)',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <div
                      style={{ fontSize: 14, fontWeight: 600, color: 'var(--cds-text-primary)' }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cds-text-secondary)' }}>{val}</div>
                  </div>
                </div>
              ))}
              <Btn
                kind="primary"
                size="md"
                iconLeft={<Chat size={16} />}
                onClick={() =>
                  fireToast({
                    kind: 'info',
                    title: 'Chat de soporte',
                    message: 'Un asesor te atenderá en breve.'
                  })
                }
              >
                Iniciar chat
              </Btn>
            </div>
          </Card>

          <Card>
            <CardHead title="Recursos" />
            <div style={{ padding: 16, display: 'grid', gap: 10 }}>
              {[
                'Guía de inicio rápido',
                'Manual de la gerente',
                'Buenas prácticas de retención'
              ].map((r) => (
                <a
                  key={r}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 14,
                    color: 'var(--cds-link-primary)',
                    textDecoration: 'none'
                  }}
                >
                  <Document size={16} />
                  {r}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
