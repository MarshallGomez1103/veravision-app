/* Vera Vision — los 4 estados de UI: vacío, cargando (skeleton), error.
   (el 4º estado, "con datos", es la vista normal de cada pantalla) */
import { Btn } from './Common'

export type VistaEstado = 'ready' | 'loading' | 'empty' | 'error'

/* ---- Empty --------------------------------------------------------------- */
export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction
}: {
  icon?: React.ReactNode
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}): React.JSX.Element {
  return (
    <div
      style={{
        background: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle-01)',
        padding: '64px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 8
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--cds-layer-accent-01)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--cds-icon-secondary)',
          marginBottom: 8
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--cds-text-primary)' }}>{title}</div>
      {message && (
        <div style={{ fontSize: 14, color: 'var(--cds-text-secondary)', maxWidth: 380 }}>
          {message}
        </div>
      )}
      {actionLabel && onAction && (
        <div style={{ marginTop: 12 }}>
          <Btn kind="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Btn>
        </div>
      )}
    </div>
  )
}

/* ---- Error --------------------------------------------------------------- */
export function ErrorState({
  title = 'No pudimos cargar la información',
  message = 'Ocurrió un problema al obtener los datos. Revisa tu conexión e inténtalo de nuevo.',
  onRetry
}: {
  title?: string
  message?: string
  onRetry?: () => void
}): React.JSX.Element {
  return (
    <div
      style={{
        background: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-support-error)',
        borderLeft: '3px solid var(--cds-support-error)',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 8
      }}
    >
      <svg width="40" height="40" viewBox="0 0 32 32" fill="var(--cds-support-error)">
        <path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm-1 7h2v10h-2zm1 14.5a1.5 1.5 0 111.5-1.5 1.5 1.5 0 01-1.5 1.5z" />
      </svg>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--cds-text-primary)' }}>{title}</div>
      <div style={{ fontSize: 14, color: 'var(--cds-text-secondary)', maxWidth: 380 }}>
        {message}
      </div>
      {onRetry && (
        <div style={{ marginTop: 12 }}>
          <Btn kind="tertiary" size="md" onClick={onRetry}>
            Reintentar
          </Btn>
        </div>
      )}
    </div>
  )
}

/* ---- Loading (skeleton) -------------------------------------------------- */
export function SkeletonBox({
  w = '100%',
  h = 16,
  style = {}
}: {
  w?: number | string
  h?: number | string
  style?: React.CSSProperties
}): React.JSX.Element {
  return (
    <span
      className="vv-skeleton"
      style={{ display: 'block', width: w, height: h, borderRadius: 2, ...style }}
    />
  )
}

export function LoadingState({ rows = 5 }: { rows?: number }): React.JSX.Element {
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
          <div key={i} style={{ background: 'var(--cds-layer-01)', padding: 16, minHeight: 132 }}>
            <SkeletonBox w={110} h={12} />
            <SkeletonBox w={64} h={32} style={{ marginTop: 24 }} />
          </div>
        ))}
      </div>
      <div
        style={{
          background: 'var(--cds-layer-01)',
          border: '1px solid var(--cds-border-subtle-01)'
        }}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderTop: i ? '1px solid var(--cds-border-subtle-01)' : 'none'
            }}
          >
            <SkeletonBox w={32} h={32} style={{ borderRadius: '50%' }} />
            <SkeletonBox w={`${30 + ((i * 13) % 40)}%`} h={14} />
            <span style={{ flex: 1 }} />
            <SkeletonBox w={72} h={14} />
          </div>
        ))}
      </div>
    </div>
  )
}
