/* Vera Vision — Login (mock) con selección de persona/rol */
import { useState } from 'react'
import { ArrowRight, View, UserMultiple, Location } from '@carbon/icons-react'
import { Btn } from '@renderer/components/primitives/Common'
import { useVV } from '@renderer/state/app-context'
import { vvAvatarColor } from '@renderer/data'

export function Login(): React.JSX.Element {
  const { login, empleados, asignaciones } = useVV()
  const [sel, setSel] = useState(empleados[0]?.id ?? 'marlen')
  const elegido = empleados.find((e) => e.id === sel)

  return (
    <div
      className="cds--g100"
      style={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        background: '#161616'
      }}
    >
      {/* Panel de marca con degradado y elementos visuales premium */}
      <div
        style={{
          flex: 1.2,
          background: 'linear-gradient(135deg, #001035 0%, #001d6c 50%, #161616 100%)',
          color: '#fff',
          padding: '56px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minWidth: 0,
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid #262626'
        }}
      >
        {/* Orbes de luz brillante de fondo (Estilo Glassmorphism/Premium Glow) */}
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(138,63,252,0.18) 0%, rgba(138,63,252,0) 70%)',
            top: '-5%',
            left: '10%',
            filter: 'blur(60px)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15,98,254,0.15) 0%, rgba(15,98,254,0) 70%)',
            bottom: '10%',
            right: '-5%',
            filter: 'blur(70px)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Header de Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 2, position: 'relative' }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <View size={20} style={{ color: '#78a9ff' }} />
          </span>
          <span style={{ fontSize: 18, letterSpacing: '0.05em' }}>
            <b style={{ fontWeight: 600, color: '#f4f4f4' }}>Opticalia</b>{' '}
            <span style={{ fontWeight: 300, opacity: 0.9 }}>VeraVision</span>
          </span>
        </div>

        {/* Mensaje Central */}
        <div style={{ zIndex: 2, position: 'relative', margin: '48px 0' }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 300,
              lineHeight: 1.15,
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
              color: '#f4f4f4'
            }}
          >
            Cada cliente,
            <br />
            <span
              style={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #a56eff 0%, #0f62fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              de vuelta a tiempo.
            </span>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: '#c6c6c6',
              maxWidth: 440,
              lineHeight: 1.6
            }}
          >
            La plataforma inteligente que automatiza la retención de tus pacientes ópticos mediante recordatorios oportunos de control visual anual, cumpleaños y adaptaciones de montura.
          </p>

          {/* Tarjeta flotante de KPIs premium */}
          <div
            style={{
              marginTop: 40,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '18px 24px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              maxWidth: 400
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(15,98,254,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#78a9ff'
              }}
            >
              <ArrowRight size={20} style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#8d8d8d', letterSpacing: '1px', fontWeight: 600 }}>
                Efectividad Promedio
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#f4f4f4' }}>92.4%</span>
                <span style={{ fontSize: 12, color: '#42be65', fontWeight: 600 }}>+4.5% esta semana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Panel */}
        <div style={{ fontSize: 12, color: '#8d8d8d', zIndex: 2, position: 'relative' }}>
          © 2026 Opticalia · Prototipo de Interacción Persona-Computadora (IPC)
        </div>
      </div>

      {/* Panel de acceso (Derecha) */}
      <div
        style={{
          flex: 0.8,
          background: 'var(--cds-background, #161616)',
          padding: '56px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'auto',
          minWidth: 420
        }}
      >
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 400,
              margin: '0 0 6px',
              color: 'var(--cds-text-primary, #f4f4f4)'
            }}
          >
            Iniciar sesión
          </h2>
          <p style={{ fontSize: 14, color: 'var(--cds-text-secondary, #c6c6c6)', margin: '0 0 32px' }}>
            Selecciona tu perfil de empleado para acceder al sistema.
          </p>

          {/* Listado de Empleados */}
          <div style={{ display: 'grid', gap: 14, marginBottom: 32 }}>
            {empleados.map((e) => {
              const on = sel === e.id
              const colorAcento = vvAvatarColor(e.id)
              const sede =
                e.rol === 'gerente' ? 'Todas las sedes' : (asignaciones[e.id] ?? 'CD Centrochía')
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSel(e.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    textAlign: 'left',
                    padding: 16,
                    cursor: 'pointer',
                    background: on ? 'var(--cds-layer-02, #262626)' : 'var(--cds-layer-01, #1e1e1e)',
                    border: on
                      ? `1.5px solid ${colorAcento}`
                      : '1.5px solid var(--cds-border-subtle-01, #393939)',
                    borderRadius: 8,
                    boxShadow: on
                      ? `0 6px 20px rgba(0,0,0,0.2), inset 0 0 0 1px ${colorAcento}`
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: on ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!on) {
                      e.currentTarget.style.borderColor = 'var(--cds-border-strong-01, #525252)'
                      e.currentTarget.style.background = 'var(--cds-layer-hover, #2d2d2d)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!on) {
                      e.currentTarget.style.borderColor = 'var(--cds-border-subtle-01, #393939)'
                      e.currentTarget.style.background = 'var(--cds-layer-01, #1e1e1e)'
                    }
                  }}
                >
                  {/* Avatar con degradado premium */}
                  <span
                    style={{
                      width: 46,
                      height: 46,
                      flexShrink: 0,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colorAcento} 0%, #393939 100%)`,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 600,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    {e.ini}
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--cds-text-primary, #f4f4f4)'
                      }}
                    >
                      {e.nombre}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        color: 'var(--cds-text-secondary, #c6c6c6)',
                        textTransform: 'capitalize',
                        marginTop: 4
                      }}
                    >
                      {e.rol === 'gerente' ? <View size={12} style={{ color: colorAcento }} /> : <UserMultiple size={12} style={{ color: colorAcento }} />}
                      <span style={{ color: on ? '#fff' : 'inherit', fontWeight: on ? 500 : 400 }}>{e.rol}</span>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <Location size={12} />
                      <span style={{ color: on ? '#fff' : 'inherit' }}>{sede}</span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <Btn
            kind="primary"
            size="lg"
            iconLeft={<ArrowRight size={20} />}
            onClick={() => login(sel)}
            style={{
              width: '100%',
              height: 48,
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 600
            }}
          >
            Entrar como {elegido?.nombre.split(' ')[0]}
          </Btn>

          <p
            style={{
              fontSize: 12,
              color: 'var(--cds-text-helper, #8d8d8d)',
              marginTop: 20,
              textAlign: 'center',
              lineHeight: 1.4
            }}
          >
            Acceso rápido sin contraseña para demostración del prototipo visual.
          </p>
        </div>
      </div>
    </div>
  )
}
