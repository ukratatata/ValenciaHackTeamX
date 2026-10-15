import { useEffect, useState } from 'react'
import { Activity, Menu, ShieldCheck, X } from 'lucide-react'
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
      {/* Nivel 1: barra utilitaria */}
      <div className="bg-primary-800 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-xs">
          <ul className="hidden items-center gap-4 sm:flex">
            {UTILITARIOS.map((t) => (
              <li key={t}>
                <a href="#contenido" onClick={inerte} className="rounded px-1 py-0.5 text-primary-100 hover:text-white hover:underline">
                  {t}
                </a>
              </li>
            ))}
          </ul>
          <p className="rounded bg-accent-600 px-2 py-0.5 font-semibold text-white max-sm:mx-auto">
            Prototipo de hackatón · datos simulados
          </p>
        </div>
      </div>

      {/* Nivel 2: marca y navegación */}
      <div className="border-b border-surface-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4">
          <button
            type="button"
            onClick={onInicio}
            className="flex shrink-0 items-center gap-2.5 rounded py-2.5 text-left"
            aria-label="GovPulse València, ir al inicio"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-700 text-white">
              <Activity aria-hidden="true" className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block whitespace-nowrap font-display text-base font-bold text-primary-800 sm:text-lg">GovPulse València</span>
              <span className="hidden text-xs text-ink-soft sm:block">Los trámites llegan a ti</span>
            </span>
          </button>

          {sesion && (
            <nav aria-label="Principal" className="hidden self-stretch md:block">
              <ul className="flex h-full items-stretch gap-1">
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
                        className={`flex items-center border-b-4 px-3 text-sm font-semibold ${
                          sel ? 'border-gold text-primary-800' : 'border-transparent text-ink hover:border-primary-200 hover:text-primary-800'
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
              <button
                type="button"
                onClick={onPanel}
                aria-label="Quién ha consultado tus datos"
                className="group relative flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-control border border-primary-200 bg-white px-0 text-sm font-semibold leading-tight text-primary-800 hover:bg-primary-50 lg:px-3"
              >
                <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span className="hidden lg:inline">Quién ha consultado tus datos</span>
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-base font-bold text-accent-700 max-[379px]:hidden"
                >
                  {perfil.nombre[0]}
                </span>
                <span className="hidden text-sm font-semibold lg:block">{perfil.nombre}</span>
                <span className="sr-only">Sesión de {perfil.nombre}</span>
              </div>
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                aria-expanded={menu}
                aria-controls="menu-movil"
                aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
                className="flex h-11 w-11 items-center justify-center rounded-control border border-primary-200 bg-white text-primary-800 hover:bg-primary-50 md:hidden"
              >
                {menu ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
              </button>
            </div>
          )}
        </div>

        {sesion && menu && (
          <nav id="menu-movil" aria-label="Principal (móvil)" className="anim-in border-t border-surface-line bg-white md:hidden">
            <ul className="mx-auto max-w-6xl px-2 py-2">
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
                      className={`flex min-h-[48px] items-center rounded-control border-l-4 px-3 text-base font-semibold ${
                        sel ? 'border-gold bg-primary-50 text-primary-800' : 'border-transparent text-ink hover:bg-surface-muted'
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
      <div aria-hidden="true" className="flex h-1">
        <div className="w-1/3 bg-gold" />
        <div className="flex-1 bg-primary-700" />
      </div>
    </header>
  )
}
