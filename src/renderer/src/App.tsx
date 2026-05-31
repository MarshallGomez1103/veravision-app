/* Vera Vision — App: auth-gate, routing, tema, acento, overlays */
import { useMemo, useState } from 'react'
import { AppHeader, AppSideNav } from '@renderer/components/layout/AppShell'
import {
  Modal,
  SidePanel,
  Toast,
  CrearRecordatorioForm,
  ClienteDetalle,
  Avatar,
  Btn
} from '@renderer/components/primitives/Common'
import type { ToastData } from '@renderer/components/primitives/Common'
import { Dashboard } from '@renderer/screens/Dashboard'
import { Clientes } from '@renderer/screens/Clientes'
import { Recordatorios } from '@renderer/screens/Recordatorios'
import { Historial } from '@renderer/screens/Historial'
import { Configuracion } from '@renderer/screens/Configuracion'
import { Ayuda } from '@renderer/screens/Ayuda'
import { Empleados } from '@renderer/screens/Empleados'
import { Login } from '@renderer/screens/Login'
import { Perfil } from '@renderer/screens/Perfil'
import { VVProvider, useVV, acentoVars } from '@renderer/state/app-context'
import { VV_NOTIFICACIONES } from '@renderer/data'
import type { Cliente, Motivo, Notificacion } from '@renderer/data/types'
import { Add, Close, Search, Notification as BellIcon, CheckmarkOutline } from '@carbon/icons-react'

export type Page =
  | 'dashboard'
  | 'clientes'
  | 'recordatorios'
  | 'historial'
  | 'empleados'
  | 'config'
  | 'ayuda'
  | 'perfil'

interface FormState {
  tipo: Motivo
  cliente: string
  fecha: string
  canal: 'WhatsApp' | 'Email'
  mensaje: string
}

const VV_TITULO_MAP: Record<string, string> = {
  control: 'Control visual anual',
  cumple: 'Tarjeta de cumpleaños',
  postventa: 'Seguimiento de adaptación'
}

function App(): React.JSX.Element {
  return (
    <VVProvider>
      <Shell />
    </VVProvider>
  )
}

function Shell(): React.JSX.Element {
  const { user } = useVV()
  if (!user) return <Login />
  return <AppInner />
}

function AppInner(): React.JSX.Element {
  const { theme, acento, data, templates } = useVV()
  const [page, setPage] = useState<Page>('dashboard')
  const [navOpen, setNavOpen] = useState(true)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [modal, setModal] = useState(false)

  function formInicial(): FormState {
    const selectedCli = data.clientes[0]
    const nombre = selectedCli?.nombre ?? ''
    const canal = selectedCli?.canal ?? 'WhatsApp'
    const tipo = 'control'
    const templateMessage = templates[canal === 'WhatsApp' ? 'whatsapp' : 'email'][tipo]
    const firstName = nombre ? nombre.split(' ')[0] : 'cliente'
    const mensaje = templateMessage.replace(/\[Cliente\]/g, firstName)

    return {
      tipo,
      cliente: nombre,
      fecha: '3 de junio, 2026',
      canal,
      mensaje
    }
  }

  const [form, setForm] = useState<FormState>(formInicial())
  const [toast, setToast] = useState<ToastData | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [notis, setNotis] = useState<Notificacion[]>(VV_NOTIFICACIONES)

  const unread = useMemo(() => notis.filter((n) => !n.leida).length, [notis])

  const fireToast = (x: ToastData): void => {
    setToast(x)
    clearTimeout((window as Window & { __vt?: ReturnType<typeof setTimeout> }).__vt)
    ;(window as Window & { __vt?: ReturnType<typeof setTimeout> }).__vt = setTimeout(
      () => setToast(null),
      4000
    )
  }

  const nav = (p: Page): void => {
    setPage(p)
    setCliente(null)
  }

  const abrirCrear = (cli?: Cliente): void => {
    const selectedCli = cli || data.clientes[0]
    const nombre = selectedCli?.nombre ?? ''
    const canal = selectedCli?.canal ?? 'WhatsApp'
    const tipo = 'control'
    const templateMessage = templates[canal === 'WhatsApp' ? 'whatsapp' : 'email'][tipo]
    const firstName = nombre ? nombre.split(' ')[0] : 'cliente'
    const mensaje = templateMessage.replace(/\[Cliente\]/g, firstName)

    setForm({
      tipo,
      cliente: nombre,
      fecha: '3 de junio, 2026',
      canal,
      mensaje
    })
    setModal(true)
  }

  const setF = (patch: Partial<FormState>): void => {
    setForm((f) => {
      const next = { ...f, ...patch }
      if (patch.cliente !== undefined || patch.tipo !== undefined || patch.canal !== undefined) {
        const canalKey = next.canal === 'WhatsApp' ? 'whatsapp' : 'email'
        const rawTemplate = templates[canalKey][next.tipo]
        const firstName = next.cliente ? next.cliente.split(' ')[0] : 'cliente'
        next.mensaje = rawTemplate.replace(/\[Cliente\]/g, firstName)
      }
      return next
    })
  }

  const guardarRecordatorio = (): void => {
    setModal(false)
    fireToast({
      kind: 'success',
      title: 'Recordatorio creado',
      message: `${VV_TITULO_MAP[form.tipo]} para ${form.cliente} · ${form.fecha}.`
    })
  }

  const isClienteValido = data.clientes.some(
    (c) => c.nombre.toLowerCase().trim() === form.cliente.toLowerCase().trim()
  )
  const isFechaValida = form.fecha.trim().length > 0
  const isFormValido = isClienteValido && isFechaValida

  let formErrorMessage = ''
  if (!form.cliente.trim()) {
    formErrorMessage = 'Falta seleccionar un cliente.'
  } else if (!isClienteValido) {
    formErrorMessage = 'El cliente ingresado no existe en la sede activa.'
  } else if (!isFechaValida) {
    formErrorMessage = 'La fecha de envío no puede estar vacía.'
  }

  const screenProps = {
    onNav: nav,
    onCrear: abrirCrear,
    onAbrirCliente: setCliente,
    fireToast
  }

  return (
    <div
      data-carbon-theme={theme}
      className={theme === 'g100' ? 'cds--g100' : 'cds--g10'}
      style={{
        minHeight: '100vh',
        background: 'var(--cds-background)',
        color: 'var(--cds-text-primary)',
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        ...acentoVars(acento)
      }}
    >
      <AppHeader
        onMenuClick={() => setNavOpen((o) => !o)}
        onLogoClick={() => nav('dashboard')}
        onNewReminder={abrirCrear}
        onSearch={() => setSearchOpen(true)}
        onBell={() => setBellOpen(true)}
        unread={unread}
        onNav={nav}
      />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AppSideNav open={navOpen} page={page} onNav={nav} />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: '28px 32px 64px',
            maxWidth: 1440,
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {page === 'dashboard' && <Dashboard {...screenProps} />}
          {page === 'clientes' && <Clientes {...screenProps} />}
          {page === 'recordatorios' && <Recordatorios {...screenProps} />}
          {page === 'historial' && <Historial {...screenProps} />}
          {page === 'empleados' && <Empleados fireToast={fireToast} />}
          {page === 'config' && <Configuracion fireToast={fireToast} />}
          {page === 'ayuda' && <Ayuda fireToast={fireToast} />}
          {page === 'perfil' && <Perfil fireToast={fireToast} />}
        </main>
      </div>

      {/* Panel lateral: perfil de cliente */}
      <SidePanel
        open={!!cliente}
        label="Cliente"
        title="Perfil del cliente"
        onClose={() => setCliente(null)}
        width={520}
        footer={
          cliente ? (
            <>
              <Btn
                kind="secondary"
                size="lg"
                onClick={() => setCliente(null)}
                style={{ flex: 1, minHeight: 64, alignItems: 'flex-start', paddingTop: 15 }}
              >
                Cerrar
              </Btn>
              <Btn
                kind="primary"
                size="lg"
                iconLeft={<Add size={16} />}
                onClick={() => {
                  abrirCrear(cliente)
                  setCliente(null)
                }}
                style={{ flex: 1, minHeight: 64, alignItems: 'flex-start', paddingTop: 15 }}
              >
                Crear recordatorio
              </Btn>
            </>
          ) : undefined
        }
      >
        {cliente && (
          <ClienteDetalle cli={cliente} hist={data.historial.filter((h) => h.cli === cliente.id)} />
        )}
      </SidePanel>

      {/* Modal: nuevo recordatorio (Botón de envío inteligente con validación) */}
      <Modal
        open={modal}
        label="Recordatorios"
        title="Nuevo recordatorio"
        primaryText="Guardar recordatorio"
        secondaryText="Cancelar"
        onClose={() => setModal(false)}
        onPrimary={guardarRecordatorio}
        primaryDisabled={!isFormValido}
        width={620}
      >
        <CrearRecordatorioForm state={form} set={setF} errorMsg={formErrorMessage} />
      </Modal>

      {searchOpen && (
        <SearchPanel
          onClose={() => setSearchOpen(false)}
          onPick={(c) => {
            setSearchOpen(false)
            nav('clientes')
            setCliente(c)
          }}
        />
      )}

      {bellOpen && (
        <NotificationsPanel
          notis={notis}
          onClose={() => setBellOpen(false)}
          onReadAll={() => setNotis((ns) => ns.map((n) => ({ ...n, leida: true })))}
          onNotiClick={(n) => {
            // Marcar como leída
            setNotis((ns) => ns.map((item) => (item.id === n.id ? { ...item, leida: true } : item)))
            setBellOpen(false)
            
            // Navegar según tipo
            if (n.tipo === 'riesgo') {
              const foundCli = data.clientes.find(c => n.detalle.includes(c.nombre) || n.titulo.includes(c.nombre))
              if (foundCli) {
                setCliente(foundCli)
                nav('clientes')
              } else {
                nav('clientes')
              }
            } else if (n.tipo === 'recordatorio') {
              nav('recordatorios')
            } else if (n.tipo === 'respuesta') {
              nav('historial')
            } else {
              nav('ayuda')
            }
            
            fireToast({
              kind: 'info',
              title: `Navegación`,
              message: `${n.titulo} · Mostrando detalles.`
            })
          }}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

/* ---- SearchPanel: búsqueda global de clientes ---------------------------- */
function SearchPanel({
  onClose,
  onPick
}: {
  onClose: () => void
  onPick: (c: Cliente) => void
}): React.JSX.Element {
  const { data } = useVV()
  const [q, setQ] = useState('')
  const results = q
    ? data.clientes
        .filter((c) => (c.nombre + c.email + c.compra).toLowerCase().includes(q.toLowerCase()))
        .slice(0, 8)
    : data.clientes.slice(0, 6)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--cds-overlay, rgba(0,0,0,0.5))',
        zIndex: 70,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '12vh'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(640px, 92vw)',
          background: 'var(--cds-layer-01)',
          border: '1px solid var(--cds-border-subtle-01)',
          boxShadow: '0 16px 48px var(--cds-shadow, rgba(0,0,0,0.5))'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 16px',
            height: 56,
            borderBottom: '1px solid var(--cds-border-subtle-01)'
          }}
        >
          <Search size={20} style={{ color: 'var(--cds-icon-secondary)' }} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar clientes por nombre, correo o compra…"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
              fontSize: 16,
              color: 'var(--cds-text-primary)',
              outline: 'none'
            }}
          />
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--cds-icon-primary)',
              display: 'flex'
            }}
          >
            <Close size={20} />
          </button>
        </div>
        <div style={{ maxHeight: 380, overflow: 'auto' }}>
          {results.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'IBM Plex Sans, system-ui, sans-serif'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cds-layer-hover-01)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Avatar ini={c.ini} size={32} seed={c.id} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--cds-text-primary)'
                  }}
                >
                  {c.nombre}
                </span>
                <span style={{ fontSize: 12, color: 'var(--cds-text-secondary)' }}>{c.compra}</span>
              </span>
            </button>
          ))}
          {results.length === 0 && (
            <div
              style={{
                padding: 32,
                textAlign: 'center',
                color: 'var(--cds-text-helper)',
                fontSize: 14
              }}
            >
              Sin resultados para “{q}”.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---- NotificationsPanel -------------------------------------------------- */
const NOTI_COLOR: Record<Notificacion['tipo'], string> = {
  riesgo: 'var(--cds-support-error)',
  recordatorio: 'var(--cds-support-warning)',
  respuesta: 'var(--cds-support-success)',
  sistema: 'var(--cds-support-info)'
}

function NotificationsPanel({
  notis,
  onClose,
  onReadAll,
  onNotiClick
}: {
  notis: Notificacion[]
  onClose: () => void
  onReadAll: () => void
  onNotiClick: (n: Notificacion) => void
}): React.JSX.Element {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(400px, 100%)',
          marginTop: 48,
          height: 'calc(100vh - 48px)',
          background: 'var(--cds-layer-01)',
          borderLeft: '1px solid var(--cds-border-subtle-01)',
          boxShadow: '-4px 0 24px var(--cds-shadow, rgba(0,0,0,0.5))',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid var(--cds-border-subtle-01)'
          }}
        >
          <BellIcon size={18} style={{ color: 'var(--cds-icon-primary)' }} />
          <h2
            style={{
              margin: '0 0 0 10px',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--cds-text-primary)'
            }}
          >
            Notificaciones
          </h2>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onReadAll}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--cds-link-primary)',
              fontSize: 13,
              fontFamily: 'IBM Plex Sans, system-ui, sans-serif'
            }}
          >
            Marcar leídas
          </button>
          <button
            type="button"
            aria-label="Cerrar notificaciones"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              marginLeft: 4,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--cds-icon-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cds-layer-hover-01)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Close size={18} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {notis.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onNotiClick(n)}
              style={{
                display: 'flex',
                gap: 12,
                width: '100%',
                textAlign: 'left',
                padding: '14px 16px',
                border: 'none',
                borderBottom: '1px solid var(--cds-border-subtle-01)',
                background: n.leida ? 'transparent' : 'var(--cds-background-selected)',
                cursor: 'pointer',
                fontFamily: 'IBM Plex Sans, system-ui, sans-serif'
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: NOTI_COLOR[n.tipo],
                  marginTop: 6,
                  flexShrink: 0
                }}
              />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--cds-text-primary)'
                  }}
                >
                  {n.titulo}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    color: 'var(--cds-text-secondary)',
                    marginTop: 2
                  }}
                >
                  {n.detalle}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: 'var(--cds-text-helper)',
                    marginTop: 4
                  }}
                >
                  {n.fecha}
                </span>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--cds-link-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    Ver detalles &rarr;
                  </span>
                </div>
              </span>
            </button>
          ))}
          {notis.every((n) => n.leida) && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 40,
                color: 'var(--cds-text-helper)'
              }}
            >
              <CheckmarkOutline size={28} />
              <span style={{ fontSize: 14 }}>Estás al día.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
