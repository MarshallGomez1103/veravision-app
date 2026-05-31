/* Vera Vision — Clientes: DataTable */
import { useState } from 'react'
import { Add, Download, Filter, View, Edit, UserMultiple } from '@carbon/icons-react'
import {
  PageHeader,
  Tabs,
  Status,
  Avatar,
  Tag,
  Checkbox,
  OverflowMenu,
  Btn
} from '@renderer/components/primitives/Common'
import { EmptyState, LoadingState, ErrorState } from '@renderer/components/primitives/States'
import type { VistaEstado } from '@renderer/components/primitives/States'
import { VV_SEG, VV_MOTIVO, vvFmtMonto } from '@renderer/data'
import { useVV } from '@renderer/state/app-context'
import type { Cliente, Motivo } from '@renderer/data/types'
import type { ToastData } from '@renderer/components/primitives/Common'
import type { Page } from '@renderer/App'

type SortKey = keyof Cliente
type SortDir = 'asc' | 'desc'

interface ClientesProps {
  onAbrirCliente: (cli: Cliente) => void
  onCrear: (cli?: Cliente) => void
  fireToast: (t: ToastData) => void
  onNav: (p: Page) => void
}

export function Clientes({ onAbrirCliente, onCrear, fireToast }: ClientesProps): React.JSX.Element {
  const { data } = useVV()
  const [estado, setEstado] = useState<VistaEstado>('ready')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('todos')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: 'ultima',
    dir: 'desc'
  })
  const [sel, setSel] = useState<Record<string, boolean>>({})

  const counts = {
    todos: data.clientes.length,
    activo: data.clientes.filter((c) => c.seg === 'activo').length,
    riesgo: data.clientes.filter((c) => c.seg === 'riesgo').length,
    perdido: data.clientes.filter((c) => c.seg === 'perdido').length
  }

  const tabs = [
    { value: 'todos', label: 'Todos', count: counts.todos },
    { value: 'activo', label: 'Activos', count: counts.activo },
    { value: 'riesgo', label: 'En riesgo', count: counts.riesgo },
    { value: 'perdido', label: 'Perdidos', count: counts.perdido }
  ]

  let rows = data.clientes
    .filter((c) => tab === 'todos' || c.seg === tab)
    .filter(
      (c) => !query || (c.nombre + c.email + c.compra).toLowerCase().includes(query.toLowerCase())
    )
  rows = [...rows].sort((a, b) => {
    const av = a[sort.key]
    const bv = b[sort.key]
    let r: number
    if (typeof av === 'number' && typeof bv === 'number') {
      r = av - bv
    } else {
      r = String(av ?? '').localeCompare(String(bv ?? ''), 'es')
    }
    return sort.dir === 'desc' ? -r : r
  })

  const cycleSort = (key: SortKey): void => {
    setSort((s) =>
      s.key !== key ? { key, dir: 'asc' } : { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
    )
  }

  const allChecked = rows.length > 0 && rows.every((r) => sel[r.id])
  const someChecked = rows.some((r) => sel[r.id])
  const selCount = Object.values(sel).filter(Boolean).length

  const toggleAll = (): void => {
    if (allChecked) {
      setSel({})
    } else {
      const n: Record<string, boolean> = {}
      rows.forEach((r) => (n[r.id] = true))
      setSel(n)
    }
  }

  const cols: { key: SortKey; label: string }[] = [
    { key: 'nombre', label: 'Cliente' },
    { key: 'seg', label: 'Estado' },
    { key: 'motivo', label: 'Seguimiento' },
    { key: 'ultima', label: 'Última visita' },
    { key: 'compra', label: 'Última compra' },
    { key: 'monto', label: 'Monto' }
  ]

  return (
    <div>
      <PageHeader
        title="Clientes"
        helper={`${data.clientes.length} clientes en tu cartera · ${counts.riesgo} requieren seguimiento`}
      >
        <Btn kind="tertiary" size="md" iconLeft={<Download size={16} />}>
          Exportar
        </Btn>
        <Btn kind="primary" size="md" iconLeft={<Add size={16} />} onClick={onCrear}>
          Nuevo recordatorio
        </Btn>
      </PageHeader>

      <DemoEstados value={estado} onChange={setEstado} />

      {estado === 'loading' && <LoadingState rows={6} />}
      {estado === 'error' && <ErrorState onRetry={() => setEstado('ready')} />}
      {estado === 'empty' && (
        <EmptyState
          icon={<UserMultiple size={28} />}
          title="Aún no hay clientes en esta sede"
          message="Cuando registres o importes clientes aparecerán aquí con su segmento y seguimiento."
          actionLabel="Importar clientes"
          onAction={() =>
            fireToast({
              kind: 'info',
              title: 'Importar clientes',
              message: 'Función de demostración.'
            })
          }
        />
      )}

      {estado === 'ready' && (
        <>
          <Tabs
            tabs={tabs}
            active={tab}
            onChange={(t) => {
              setTab(t)
              setSel({})
            }}
            style={{ marginBottom: 0 }}
          />

          <div
            style={{
              background: 'var(--cds-layer-01)',
              border: '1px solid var(--cds-border-subtle-01)',
              borderTop: 'none'
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                position: 'relative',
                height: 48,
                borderBottom: '1px solid var(--cds-border-subtle-01)',
                display: 'flex',
                alignItems: 'stretch'
              }}
            >
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
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
                  placeholder="Buscar por nombre, correo o compra…"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    padding: '0 16px 0 44px',
                    fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
                    fontSize: 14,
                    color: 'var(--cds-text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <ToolbarBtn icon={<Filter size={16} />}>Filtrar</ToolbarBtn>
              <Btn
                kind="primary"
                size="lg"
                iconLeft={<Add size={16} />}
                onClick={onCrear}
                style={{ minHeight: 48 }}
              >
                Recordatorio
              </Btn>

              {selCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--cds-button-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 16
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    {selCount} seleccionado{selCount > 1 ? 's' : ''}
                  </span>
                  <div style={{ flex: 1 }} />
                  <BatchBtn
                    onClick={() => {
                      fireToast({
                        kind: 'success',
                        title: 'Recordatorios programados',
                        message: `${selCount} clientes en la cola de envío.`
                      })
                      setSel({})
                    }}
                  >
                    Enviar recordatorio
                  </BatchBtn>
                  <BatchBtn
                    onClick={() =>
                      fireToast({
                        kind: 'info',
                        title: 'Exportando',
                        message: `${selCount} registros a CSV.`
                      })
                    }
                  >
                    Exportar
                  </BatchBtn>
                  <button
                    type="button"
                    onClick={() => setSel({})}
                    style={{
                      height: 48,
                      padding: '0 16px',
                      background: 'var(--cds-button-primary-active)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
                      fontSize: 14
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr
                    style={{
                      background: 'var(--cds-layer-accent-01)',
                      height: 48
                    }}
                  >
                    <th style={{ width: 48, padding: '0 0 0 16px', textAlign: 'left' }}>
                      <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked && !allChecked}
                        onChange={toggleAll}
                      />
                    </th>
                    {cols.map((c) => (
                      <th
                        key={c.key}
                        onClick={() => cycleSort(c.key)}
                        style={{
                          textAlign: 'left',
                          padding: '0 16px',
                          fontWeight: 600,
                          color: 'var(--cds-text-primary)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          userSelect: 'none'
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          {c.label}
                          <SortIcon sortKey={c.key} currentSort={sort} />
                        </span>
                      </th>
                    ))}
                    <th style={{ width: 48 }} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => {
                    const seg = VV_SEG[c.seg]
                    const mot = c.motivo ? VV_MOTIVO[c.motivo as Motivo] : null
                    const checked = !!sel[c.id]
                    return (
                      <tr
                        key={c.id}
                        style={{
                          height: 56,
                          borderTop: '1px solid var(--cds-border-subtle-01)',
                          background: checked ? 'var(--cds-background-selected)' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!checked)
                            e.currentTarget.style.background = 'var(--cds-layer-hover-01)'
                        }}
                        onMouseLeave={(e) => {
                          if (!checked) e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <td style={{ padding: '0 0 0 16px' }}>
                          <Checkbox
                            checked={checked}
                            onChange={(v) => setSel((s) => ({ ...s, [c.id]: v }))}
                          />
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          <span
                            onClick={() => onAbrirCliente(c)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 12,
                              cursor: 'pointer'
                            }}
                          >
                            <Avatar ini={c.ini} size={32} seed={c.id} />
                            <span
                              style={{ color: 'var(--cds-link-primary)', whiteSpace: 'nowrap' }}
                            >
                              {c.nombre}
                            </span>
                          </span>
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          <Status kind={seg.status}>{seg.label}</Status>
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          {mot ? (
                            <Tag color={mot.tag}>{mot.label}</Tag>
                          ) : (
                            <span style={{ color: 'var(--cds-text-helper)' }}>—</span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '0 16px',
                            color: 'var(--cds-text-secondary)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          hace {c.ultima} {c.ultima === 1 ? 'mes' : 'meses'}
                        </td>
                        <td style={{ padding: '0 16px', color: 'var(--cds-text-primary)' }}>
                          {c.compra}
                        </td>
                        <td
                          style={{
                            padding: '0 16px',
                            color: 'var(--cds-text-primary)',
                            fontVariantNumeric: 'tabular-nums',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {vvFmtMonto(c.monto)}
                        </td>
                        <td style={{ padding: '0 8px' }}>
                          <OverflowMenu
                            items={[
                              {
                                label: 'Ver perfil',
                                icon: <View size={16} />,
                                onClick: () => onAbrirCliente(c)
                              },
                              {
                                label: 'Crear recordatorio',
                                icon: <Add size={16} />,
                                onClick: () => onCrear(c)
                              },
                              {
                                label: 'Editar cliente',
                                icon: <Edit size={16} />,
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
                        colSpan={8}
                        style={{
                          padding: 48,
                          textAlign: 'center',
                          color: 'var(--cds-text-helper)'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 10
                          }}
                        >
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: 'var(--cds-text-primary)'
                            }}
                          >
                            Ningún cliente coincide con &ldquo;{query}&rdquo;
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: 'var(--cds-text-secondary)',
                              maxWidth: 400
                            }}
                          >
                            Intenta buscar usando un término diferente (ej. solo el nombre) o
                            presiona el botón para restablecer.
                          </span>
                          <Btn
                            kind="tertiary"
                            size="sm"
                            onClick={() => setQuery('')}
                            style={{ marginTop: 8 }}
                          >
                            Limpiar búsqueda
                          </Btn>
                        </div>
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
              {rows.length} de {data.clientes.length} clientes
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* Control de demostración de los 4 estados de UI (Fase 1) */
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
      <span style={{ fontSize: 12, color: 'var(--cds-text-helper)' }}>Demo de estados (HCI):</span>
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

function SortIcon({
  sortKey,
  currentSort
}: {
  sortKey: SortKey
  currentSort: { key: SortKey; dir: SortDir }
}): React.JSX.Element {
  const active = currentSort.key === sortKey
  const up = active && currentSort.dir === 'asc'
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="currentColor"
      style={{
        color: 'var(--cds-icon-secondary)',
        opacity: active ? 1 : 0.5
      }}
    >
      {up ? (
        <path d="M16 4l-8 8h16zm0 24l8-8H8z" opacity="0.4" />
      ) : (
        <path d="M16 4l-8 8h16zm0 24l8-8H8z" />
      )}
    </svg>
  )
}

function ToolbarBtn({
  icon,
  children,
  onClick
}: {
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}): React.JSX.Element {
  const [h, setH] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        height: 48,
        padding: '0 16px',
        border: 'none',
        borderLeft: '1px solid var(--cds-border-subtle-01)',
        background: h ? 'var(--cds-background-hover)' : 'transparent',
        color: 'var(--cds-text-primary)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        fontSize: 14
      }}
    >
      {icon} {children}
    </button>
  )
}

function BatchBtn({
  children,
  onClick
}: {
  children: React.ReactNode
  onClick: () => void
}): React.JSX.Element {
  const [h, setH] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        height: 48,
        padding: '0 16px',
        border: 'none',
        background: h ? 'var(--cds-button-primary-hover)' : 'transparent',
        color: '#fff',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        fontSize: 14
      }}
    >
      {children}
    </button>
  )
}
