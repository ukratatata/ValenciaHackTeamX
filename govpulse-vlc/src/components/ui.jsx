import { useEffect, useRef } from 'react'
import {
  Check,
  Loader2,
  AlertTriangle,
  Clock,
  Fingerprint,
  Briefcase,
  Home,
  ShieldCheck,
  Stethoscope,
  X,
  Landmark,
} from 'lucide-react'

/* ---------- Button ---------- */
const VARIANTES = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800 border-primary-700',
  accent: 'bg-accent-600 text-white hover:bg-accent-700 border-accent-600',
  secondary: 'bg-white text-primary-800 hover:bg-primary-50 border-primary-200',
  ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 border-transparent',
}
export function Button({ variant = 'primary', icon: Icon, children, className = '', block = false, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-control border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:border-surface-line disabled:bg-surface-muted disabled:text-ink-soft ${VARIANTES[variant]} ${block ? 'w-full' : ''} ${className}`}
    >
      {Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </button>
  )
}

/* ---------- Card ---------- */
export function Card({ destacada = false, className = '', children, as: Tag = 'div', ...props }) {
  return (
    <Tag
      {...props}
      className={`rounded-card border bg-surface p-5 shadow-card ${destacada ? 'border-primary-700 ring-1 ring-primary-700' : 'border-surface-line'} ${className}`}
    >
      {children}
    </Tag>
  )
}

/* ---------- Chip ---------- */
const TONOS = {
  neutro: 'bg-surface-muted text-ink border-surface-line',
  Estado: 'bg-level-estado text-[#4C2F94] border-[#D6CBF3]',
  Generalitat: 'bg-level-generalitat text-[#9D174D] border-[#F5C2DA]',
  Local: 'bg-level-local text-[#14325C] border-[#C3D5EC]',
  ok: 'bg-ok-50 text-ok-700 border-[#B7E0C4]',
  warn: 'bg-warn-50 text-warn-700 border-warn-200',
  accent: 'bg-accent-600 text-white border-accent-600',
  primary: 'bg-primary-700 text-white border-primary-700',
}
export function Chip({ tono = 'neutro', icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5 ${TONOS[tono]} ${className}`}
    >
      {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5" />}
      {children}
    </span>
  )
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs, activa, onChange, etiqueta }) {
  const refs = useRef({})
  function onKey(e, i) {
    let n = null
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length
    if (n !== null) {
      e.preventDefault()
      onChange(tabs[n].id)
      refs.current[tabs[n].id]?.focus()
    }
  }
  return (
    <div role="tablist" aria-label={etiqueta} className="flex gap-0.5 overflow-x-auto border-b sm:gap-1 border-surface-line">
      {tabs.map((t, i) => {
        const sel = t.id === activa
        return (
          <button
            key={t.id}
            ref={(el) => (refs.current[t.id] = el)}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={sel}
            aria-controls={`panel-${t.id}`}
            tabIndex={sel ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`-mb-px flex min-h-[44px] shrink-0 items-center gap-1.5 border-b-2 px-2 text-[0.9rem] font-bold sm:gap-2 sm:text-sm sm:px-4 sm:uppercase sm:tracking-wide ${
              sel ? 'border-primary-700 text-primary-700' : 'border-transparent text-ink-soft hover:text-primary-800'
            }`}
          >
            {t.label}
            {t.cuenta != null && (
              <span className={`rounded-full px-2 py-0.5 text-xs ${sel ? 'bg-primary-700 text-white' : 'bg-surface-line text-ink'}`}>
                {t.cuenta}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- ChecklistRow (interconexión) ---------- */
const ICONOS = { dgp: Fingerprint, tgss: Briefcase, padron: Home, inss: ShieldCheck, sanidad: Stethoscope }

export function ChecklistRow({ inst, estado, resp, textoEspera, children }) {
  const Icono = ICONOS[inst.id] || Landmark
  const fondo =
    estado === 'ok' ? 'border-[#B7E0C4] bg-ok-50' : estado === 'no_consta' ? 'border-warn-200 bg-warn-50' : 'border-surface-line bg-surface'
  return (
    <li className={`anim-in rounded-card border p-4 transition-colors duration-300 lg:px-3.5 lg:py-2.5 ${fondo}`} data-estado={estado}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 lg:h-9 lg:w-9">
          <Icono aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="font-semibold leading-snug">{inst.nombre}</p>
            <Chip tono={inst.nivel}>{inst.nivel}</Chip>
          </div>
          <div className="lg:flex lg:flex-wrap lg:items-center lg:gap-x-3">
            <p className="mt-0.5 text-sm text-ink-soft lg:mt-0">{inst.dato}</p>
            {estado === 'ok' && resp && <p className="mt-1 text-sm font-medium lg:mt-0">{resp.dato}</p>}
            <div className="mt-2 text-sm lg:mt-0" aria-live="polite">
              <Estado estado={estado} resp={resp} textoEspera={textoEspera} />
            </div>
          </div>
        </div>
      </div>
      {children}
    </li>
  )
}

function Estado({ estado, resp, textoEspera }) {
  if (estado === 'consultando')
    return (
      <span className="inline-flex items-center gap-2 font-medium text-primary-700">
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
        Consultando…
      </span>
    )
  if (estado === 'tramitando')
    return (
      <span className="inline-flex items-center gap-2 font-medium text-primary-700">
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
        Tramitando alta en el padrón…
      </span>
    )
  if (estado === 'ok')
    return (
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-ok-700">
        <Check aria-hidden="true" className="h-4 w-4" />
        Verificado
        <span className="font-normal text-ink-soft">
          · {resp.hora} · {resp.csv}
        </span>
      </span>
    )
  if (estado === 'no_consta')
    return (
      <span className="inline-flex items-center gap-2 font-semibold text-warn-700">
        <AlertTriangle aria-hidden="true" className="h-4 w-4" />
        No consta
      </span>
    )
  return (
    <span className="inline-flex items-center gap-2 text-ink-soft">
      <Clock aria-hidden="true" className="h-4 w-4" />
      {textoEspera || 'En espera'}
    </span>
  )
}

/* ---------- Toast ---------- */
// Pila en la esquina inferior derecha (en móvil, abajo a ancho completo con márgenes).
// Un único contenedor role="status": cada aviso es un solo toast.
export function ToastStack({ toasts, onClose }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[26rem]"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-in pointer-events-auto flex w-full items-center gap-3 rounded-control bg-primary-900 py-2.5 pl-4 pr-2 text-sm font-medium text-white shadow-panel"
        >
          <span className="flex-1">{t.texto}</span>
          <button
            type="button"
            onClick={() => onClose(t.id)}
            aria-label="Cerrar aviso"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-primary-100 hover:bg-primary-800"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

/* ---------- Overlay accesible (modal y slide-over) ---------- */
export function Overlay({ abierto, onClose, titulo, lado = 'centro', children, idTitulo = 'overlay-titulo' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!abierto) return
    const previo = document.activeElement
    const foco = ref.current?.querySelector('[data-autofocus]') || ref.current
    foco?.focus()
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const a = f[0]
        const z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previo?.focus?.()
    }
  }, [abierto, onClose])

  if (!abierto) return null
  const panel = lado === 'derecha'
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-primary-900/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className={
          panel
            ? 'anim-panel absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-y-auto bg-surface shadow-panel'
            : 'anim-in absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card bg-surface p-6 shadow-panel'
        }
      >
        {panel ? (
          <>
            <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-surface-line bg-surface px-5 py-4">
              <h2 id={idTitulo} className="font-display text-lg font-bold">
                {titulo}
              </h2>
              <Button variant="secondary" icon={X} onClick={onClose} data-autofocus>
                Cerrar
              </Button>
            </div>
            <div className="p-5">{children}</div>
          </>
        ) : (
          <>
            <h2 id={idTitulo} className="font-display text-lg font-bold">
              {titulo}
            </h2>
            <div className="mt-2">{children}</div>
          </>
        )}
      </div>
    </div>
  )
}
