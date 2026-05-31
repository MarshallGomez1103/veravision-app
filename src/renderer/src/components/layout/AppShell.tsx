/* Vera Vision — UI Shell: Header + SideNav */
import { useState } from 'react'
import {
  Search,
  Notification,
  Asleep,
  Light,
  Dashboard,
  View,
  Time,
  Settings,
  Help,
  Add,
  ChevronDown,
  Location,
  Logout,
  UserAvatar,
  UserMultiple,
  Checkmark
} from '@carbon/icons-react'
import type { Page } from '@renderer/App'
import { useVV } from '@renderer/state/app-context'
import { VV_SEDES_VISTA } from '@renderer/data'

interface AppHeaderProps {
  onMenuClick: () => void
  onLogoClick: () => void
  onNewReminder: () => void
  onSearch: () => void
  onBell: () => void
  unread: number
  onNav: (p: Page) => void
}

export function AppHeader({
  onMenuClick,
  onLogoClick,
  onNewReminder,
  onSearch,
  onBell,
  unread,
  onNav
}: AppHeaderProps): React.JSX.Element {
  const { theme, toggleTheme } = useVV()
  return (
    <header
      style={{
        height: 48,
        background: '#161616',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        borderBottom: '1px solid #393939',
        flexShrink: 0
      }}
    >
      <HeaderIconBtn aria-label="Abrir menú" onClick={onMenuClick}>
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
          <rect x="4" y="9" width="24" height="2" />
          <rect x="4" y="15" width="24" height="2" />
          <rect x="4" y="21" width="24" height="2" />
        </svg>
      </HeaderIconBtn>

      <button
        type="button"
        onClick={onLogoClick}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: 14,
          padding: '0 16px 0 8px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif'
        }}
      >
        <b style={{ fontWeight: 600 }}>Opticalia</b>{' '}
        <span style={{ fontWeight: 400, opacity: 0.95 }}>VeraVision</span>
      </button>

      <div style={{ width: 1, height: 24, background: '#393939', margin: '0 4px' }} />
      <SedeSwitcher />

      <div style={{ flex: 1 }} />

      <HeaderIconBtn aria-label="Buscar" onClick={onSearch}>
        <Search size={20} />
      </HeaderIconBtn>

      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <HeaderIconBtn aria-label="Notificaciones" onClick={onBell}>
          <Notification size={20} />
        </HeaderIconBtn>
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              right: 11,
              minWidth: 16,
              height: 16,
              padding: '0 3px',
              boxSizing: 'border-box',
              borderRadius: 8,
              background: '#da1e28',
              color: '#fff',
              fontSize: 10,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #161616',
              pointerEvents: 'none'
            }}
          >
            {unread}
          </span>
        )}
      </div>

      <HeaderIconBtn aria-label="Cambiar tema" onClick={toggleTheme}>
        {theme === 'g100' ? <Light size={20} /> : <Asleep size={20} />}
      </HeaderIconBtn>

      <div style={{ width: 1, height: 24, background: '#393939', margin: '0 4px' }} />

      <button
        type="button"
        aria-label="Nuevo recordatorio"
        onClick={onNewReminder}
        style={{
          height: 48,
          padding: '0 16px',
          background: 'var(--cds-button-primary, #0f62fe)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
          whiteSpace: 'nowrap'
        }}
      >
        <Add size={16} />
        Nuevo recordatorio
      </button>

      <ProfileMenu onNav={onNav} />
    </header>
  )
}

function HeaderIconBtn({
  children,
  onClick,
  'aria-label': ariaLabel
}: {
  children: React.ReactNode
  onClick?: () => void
  'aria-label': string
}): React.JSX.Element {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 48,
        height: 48,
        border: 'none',
        background: hover ? '#393939' : 'transparent',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 70ms'
      }}
    >
      {children}
    </button>
  )
}

/* ---- SedeSwitcher: cambia entre CD Centrochía / CD Tocancipá (cambia los datos) ---- */
function SedeSwitcher(): React.JSX.Element {
  const { sede, setSede, puedeCambiarSede } = useVV()
  const [open, setOpen] = useState(false)

  // La asesora ve su sede fija (no la puede cambiar).
  if (!puedeCambiarSede) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          color: '#f4f4f4',
          fontSize: 13,
          whiteSpace: 'nowrap'
        }}
      >
        <Location size={16} style={{ color: '#78a9ff' }} />
        {sede}
      </span>
    )
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        aria-label="Cambiar de sede"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          height: 48,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          background: open ? '#393939' : 'transparent',
          border: 'none',
          color: '#f4f4f4',
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
          whiteSpace: 'nowrap',
          transition: 'background 70ms'
        }}
      >
        <Location size={16} style={{ color: '#78a9ff' }} />
        {sede}
        <ChevronDown
          size={16}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 120ms' }}
        />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: 'absolute',
              top: 48,
              left: 0,
              minWidth: 220,
              background: '#262626',
              border: '1px solid #393939',
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
              zIndex: 40
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: '.32px',
                textTransform: 'uppercase',
                color: '#8d8d8d',
                padding: '10px 16px 6px'
              }}
            >
              Sede activa
            </div>
            {VV_SEDES_VISTA.map((s) => (
              <HeaderMenuItem
                key={s}
                onClick={() => {
                  setSede(s)
                  setOpen(false)
                }}
                icon={<Location size={16} style={{ color: '#78a9ff' }} />}
                trailing={s === sede ? <Checkmark size={16} style={{ color: '#42be65' }} /> : null}
              >
                {s}
              </HeaderMenuItem>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ---- ProfileMenu: avatar del usuario con menú funcional ---- */
function ProfileMenu({ onNav }: { onNav: (p: Page) => void }): React.JSX.Element {
  const { user, logout } = useVV()
  const [open, setOpen] = useState(false)
  const go = (p: Page): void => {
    onNav(p)
    setOpen(false)
  }
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        aria-label={`Cuenta de ${user?.nombre ?? ''}`}
        aria-expanded={open}
        title={user?.nombre}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 48,
          height: 48,
          border: 'none',
          background: open ? '#393939' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 70ms'
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--cds-button-primary, #0f62fe)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {user?.ini}
        </span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: 'absolute',
              top: 48,
              right: 0,
              minWidth: 248,
              background: '#262626',
              border: '1px solid #393939',
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
              zIndex: 40
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                borderBottom: '1px solid #393939'
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--cds-button-primary, #0f62fe)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {user?.ini}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f4' }}>
                  {user?.nombre}
                </div>
                <div style={{ fontSize: 12, color: '#c6c6c6', textTransform: 'capitalize' }}>
                  {user?.rol} · Opticalia
                </div>
              </div>
            </div>
            <HeaderMenuItem onClick={() => go('perfil')} icon={<UserAvatar size={16} />}>
              Mi perfil
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => go('config')} icon={<Settings size={16} />}>
              Configuración
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => go('ayuda')} icon={<Help size={16} />}>
              Ayuda y soporte
            </HeaderMenuItem>
            <div style={{ borderTop: '1px solid #393939' }}>
              <HeaderMenuItem onClick={logout} icon={<Logout size={16} />}>
                Cerrar sesión
              </HeaderMenuItem>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function HeaderMenuItem({
  children,
  onClick,
  icon,
  trailing
}: {
  children: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  trailing?: React.ReactNode
}): React.JSX.Element {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        height: 44,
        padding: '0 16px',
        border: 'none',
        background: hover ? '#353535' : 'transparent',
        color: '#f4f4f4',
        cursor: 'pointer',
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        fontSize: 14,
        textAlign: 'left',
        transition: 'background 70ms'
      }}
    >
      {icon}
      <span style={{ flex: 1 }}>{children}</span>
      {trailing}
    </button>
  )
}

/* ---- Nav items ------------------------------------------------------------ */
const NAV_ITEMS: { id: Page; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Inicio', Icon: Dashboard },
  { id: 'clientes', label: 'Clientes', Icon: View },
  { id: 'recordatorios', label: 'Recordatorios', Icon: Notification },
  { id: 'historial', label: 'Historial', Icon: Time }
]

interface AppSideNavProps {
  open: boolean
  page: Page
  onNav: (p: Page) => void
}

export function AppSideNav({ open, page, onNav }: AppSideNavProps): React.JSX.Element {
  const { user } = useVV()
  return (
    <aside
      style={{
        width: open ? 256 : 0,
        flexShrink: 0,
        background: 'var(--cds-layer-01)',
        borderRight: open ? '1px solid var(--cds-border-subtle-01)' : 'none',
        overflow: 'hidden',
        transition: 'width 150ms cubic-bezier(0.2,0,0.38,0.9)',
        position: 'sticky',
        top: 48,
        height: 'calc(100vh - 48px)',
        alignSelf: 'flex-start'
      }}
    >
      <nav
        aria-label="Navegación lateral"
        style={{
          width: 256,
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: '.32px',
            textTransform: 'uppercase',
            color: 'var(--cds-text-helper)',
            padding: '16px 16px 8px'
          }}
        >
          Gestión
        </div>

        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <SideNavItem
            key={id}
            id={id}
            label={label}
            Icon={Icon}
            active={page === id}
            onNav={onNav}
          />
        ))}

        {user?.rol === 'gerente' && (
          <SideNavItem
            id="empleados"
            label="Empleados"
            Icon={UserMultiple}
            active={page === 'empleados'}
            onNav={onNav}
          />
        )}

        <div style={{ flex: 1 }} />

        <div style={{ borderTop: '1px solid var(--cds-border-subtle-01)' }}>
          <SideNavItem
            id="config"
            label="Configuración"
            Icon={Settings}
            active={page === 'config'}
            onNav={onNav}
          />
          <SideNavItem
            id="ayuda"
            label="Ayuda y soporte"
            Icon={Help}
            active={page === 'ayuda'}
            onNav={onNav}
          />
        </div>
      </nav>
    </aside>
  )
}

function SideNavItem({
  id,
  label,
  Icon,
  active,
  onNav
}: {
  id: Page
  label: string
  Icon: React.ComponentType<{ size?: number }>
  active: boolean
  onNav: (p: Page) => void
}): React.JSX.Element {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={() => onNav(id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        height: 40,
        padding: '0 16px',
        textAlign: 'left',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        color: 'var(--cds-text-primary)',
        background: active
          ? 'var(--cds-background-selected)'
          : hover
            ? 'var(--cds-background-hover)'
            : 'transparent',
        borderLeft: active ? '3px solid var(--cds-border-interactive)' : '3px solid transparent',
        boxSizing: 'border-box',
        transition: 'background 70ms'
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}
