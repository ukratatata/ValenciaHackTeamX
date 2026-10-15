import { useEffect, useState } from 'react'
import { Activity, Menu, Search, ShieldCheck, X } from 'lucide-react'
import perfil from '../data/perfil.json'

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'tramites', label: 'Mis trámites' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'ayuda', label: 'Ayuda' },
]
const UTILITARIOS = ['Sede electrónica', 'Atención ciudadana 010', 'Accesibilidad']

// Los enlaces utilitarios son inertes en el prototipo
const inerte = (e) => e.preventDefault()

export default function Header({ sesion, activo, onNav, onPanel, onInicio }) {
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!menu) return
    const onKey = (e) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu])

  function navegar(id) {
    setMenu(false)
    onNav(id)
  }

  return (
    <header className="sticky top-0 z-40 shadow-card">
      {/* Nivel 1: barra amarilla (como valencia.es) con enlaces utilitarios en mayúsculas pequeñas */}
      <div className="bg-gold text-ink">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-xs">
          <ul className="hidden items-center gap-1 sm:flex">
            {UTILITARIOS.map((t, i) => (
              <li key={t} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden="true">·</span>}
                <a href="#contenido" onClick={inerte} className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wide hover:underline">
                  {t}
                </a>
              </li>
            ))}
          </ul>
          <p className="rounded bg-ink px-2 py-0.5 font-semibold text-white max-sm:mx-auto">Prototipo de hackatón · datos simulados</p>
        </div>
      </div>

      {/* Nivel 2: cabecera blanca con marca, menú en mayúsculas y buscador */}
      <div className="border-b border-surface-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4">
          <button
            type="button"
            onClick={onInicio}
            className="flex shrink-0 items-center gap-2.5 rounded py-2.5 text-left"
            aria-label="Gov+ València, ir al inicio"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
              <Activity aria-hidden="true" className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="flex items-center whitespace-nowrap font-display text-base font-bold text-ink sm:text-lg">
                Gov
                <span aria-hidden="true" className="mx-0.5 inline-flex h-[1.35em] w-[1.35em] items-center justify-center rounded bg-ink font-extrabold leading-none text-gold">
                  +
                </span>
                <span className="ml-1.5 text-sm font-semibold text-ink-soft sm:text-base">València</span>
              </span>
            </span>
          </button>

          {sesion && (
            <nav aria-label="Principal" className="hidden self-stretch md:block">
              <ul className="flex h-full items-stretch gap-0.5">
                {NAV.map((n) => {
                  const sel = activo === n.id
                  return (
                    <li key={n.id} className="flex">
                      <a
                        href="#contenido"
                        onClick={(e) => {
                          e.preventDefault()
                          if (n.id !== 'ayuda') navegar(n.id)
                        }}
                        aria-current={sel ? 'page' : undefined}
                        className={`flex items-center border-b-4 px-2.5 text-[0.8125rem] font-semibold uppercase tracking-wide lg:px-3 ${
                          sel ? 'border-gold text-ink' : 'border-transparent text-ink hover:border-surface-line'
                        }`}
                      >
                        {n.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}

          {sesion && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Buscador className="hidden xl:flex" id="buscar-escritorio" />
              <button
                type="button"
                onClick={onPanel}
                aria-label="Quién ha consultado tus datos"
                className="group relative flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-control border border-ink bg-white px-0 text-[0.8125rem] font-semibold leading-tight text-ink hover:bg-primary-50 lg:px-3"
              >
                <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span className="hidden whitespace-nowrap lg:inline">Quién ha consultado tus datos</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden whitespace-nowrap rounded bg-primary-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-panel group-hover:block group-focus-visible:block lg:!hidden"
                >
                  Quién ha consultado tus datos
                </span>
              </button>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink bg-gold text-base font-bold text-ink max-[379px]:hidden"
                >
                  {perfil.nombre[0]}
                </span>
                <span className="sr-only">Sesión de {perfil.nombre}</span>
              </div>
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                aria-expanded={menu}
                aria-controls="menu-movil"
                aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
                className="flex h-11 w-11 items-center justify-center rounded-control border border-ink bg-white text-ink hover:bg-primary-50 md:hidden"
              >
                {menu ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
              </button>
            </div>
          )}
        </div>

        {sesion && menu && (
          <nav id="menu-movil" aria-label="Principal (móvil)" className="anim-in border-t border-surface-line bg-white md:hidden">
            <div className="mx-auto max-w-7xl px-4 pt-3">
              <Buscador className="flex" id="buscar-movil" />
            </div>
            <ul className="mx-auto max-w-7xl px-2 py-2">
              {NAV.map((n) => {
                const sel = activo === n.id
                return (
                  <li key={n.id}>
                    <a
                      href="#contenido"
                      onClick={(e) => {
                        e.preventDefault()
                        if (n.id === 'ayuda') setMenu(false)
                        else navegar(n.id)
                      }}
                      aria-current={sel ? 'page' : undefined}
                      className={`flex min-h-[48px] items-center rounded-control border-l-4 px-3 text-sm font-semibold uppercase tracking-wide ${
                        sel ? 'border-gold bg-primary-50 text-ink' : 'border-transparent text-ink hover:bg-surface-muted'
                      }`}
                    >
                      {n.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}
      </div>
      {/* Línea amarilla bajo la cabecera */}
      <div aria-hidden="true" className="h-1 bg-gold" />
    </header>
  )
}

// Buscador con borde (inerte en el prototipo)
function Buscador({ className = '', id }) {
  return (
    <form role="search" onSubmit={inerte} className={`items-stretch ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar en el portal
      </label>
      <input
        id={id}
        type="search"
        placeholder="¿Qué estás buscando?"
        className="h-11 w-full min-w-0 border border-ink bg-white px-3 text-[0.8125rem] placeholder:text-ink-soft xl:w-48"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="flex h-11 w-11 shrink-0 items-center justify-center border border-l-0 border-ink bg-white text-ink hover:bg-primary-50"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  )
}
