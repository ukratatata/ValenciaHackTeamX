import { useState } from 'react'
import {
  Briefcase,
  Bus,
  Check,
  Circle,
  BellRing,
  ChevronRight,
  Eye,
  Globe,
  HeartPulse,
  Home,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import perfil from '../data/perfil.json'
import tramites from '../data/tramites.json'
import { Button, Card, Chip, Tabs } from '../components/ui.jsx'
import EnProceso from './EnProceso.jsx'

const TEMAS = [
  { id: 'salud', label: 'Salud', icono: HeartPulse },
  { id: 'vivienda', label: 'Vivienda', icono: Home },
  { id: 'empleo', label: 'Empleo', icono: Briefcase },
  { id: 'movilidad', label: 'Movilidad', icono: Bus },
  { id: 'extranjeria', label: 'Extranjería', icono: Globe },
  { id: 'familia', label: 'Familia', icono: Users },
]

export default function Inicio({
  tab,
  setTab,
  tema,
  setTema,
  onTema,
  avisoNuevo,
  solicitud,
  onIniciarSip,
  onNoCubierto,
  onAvanzar,
  onVerResguardo,
}) {
  const tabs = [
    { id: 'recomendados', label: 'Recomendados', cuenta: 3 },
    { id: 'proceso', label: 'En proceso', cuenta: solicitud ? 1 : null },
    { id: 'disponibles', label: 'Disponibles' },
  ]
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <h1 className="font-display text-2xl font-bold text-primary-800 md:text-3xl">Hola, {perfil.nombre}</h1>
      <p className="mt-1 text-ink-soft">Esto es lo que te corresponde hoy</p>

      <section aria-labelledby="temas-titulo" className="mt-5">
        <h2 id="temas-titulo" className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          Accesos por tema
        </h2>
        <ul className="mt-2 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
          {TEMAS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onTema(t.id)}
                data-testid={`tema-${t.id}`}
                className="group flex min-h-[88px] w-full flex-col items-center justify-center gap-1.5 rounded-card border border-surface-line bg-white px-1 py-3 text-center text-sm font-semibold text-ink shadow-card transition-colors hover:border-primary-500 hover:bg-primary-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white">
                  <t.icono aria-hidden="true" className="h-5 w-5" />
                </span>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6">
        <Tabs tabs={tabs} activa={tab} onChange={setTab} etiqueta="Tus trámites" />
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-5">
        {tab === 'recomendados' && (
          <Recomendados
            avisoNuevo={avisoNuevo}
            solicitud={solicitud}
            onIniciarSip={onIniciarSip}
            onVerEstado={() => setTab('proceso')}
            onNoCubierto={onNoCubierto}
          />
        )}
        {tab === 'proceso' && (
          <EnProceso solicitud={solicitud} onAvanzar={onAvanzar} onVerResguardo={onVerResguardo} onVerRecomendados={() => setTab('recomendados')} />
        )}
        {tab === 'disponibles' && <Disponibles tema={tema} setTema={setTema} onNoCubierto={onNoCubierto} />}
      </div>
    </div>
  )
}

function Linea({ ok = true, children }) {
  const Icono = ok ? Check : Circle
  return (
    <li className="flex items-start gap-2 text-sm">
      <Icono aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? 'text-ok-600' : 'text-ink-soft'}`} />
      <span>{children}</span>
    </li>
  )
}

function Recomendados({ avisoNuevo, solicitud, onIniciarSip, onVerEstado, onNoCubierto }) {
  const [sip, emt, bono] = tramites.recomendados
  const enProceso = !!solicitud
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card destacada className="anim-in lg:col-span-2" data-testid="tarjeta-sip">
        <div className="flex flex-wrap items-center gap-2">
          {enProceso ? (
            <Chip tono="primary" icon={Eye}>
              En proceso
            </Chip>
          ) : (
            <Chip tono="primary">{sip.etiqueta}</Chip>
          )}
          {avisoNuevo && !enProceso && (
            <Chip tono="accent" icon={Sparkles}>
              Nuevo
            </Chip>
          )}
          <span className="text-sm text-ink-soft">{sip.emisor}</span>
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="font-display text-xl font-bold md:text-2xl">{sip.titulo}</h2>
            <p className="mt-1 text-ink-soft">
              {enProceso ? `Solicitud presentada · Nº de registro ${solicitud.registro}` : sip.texto}
            </p>
            <ul className="mt-3 space-y-1.5">
              {sip.checklist.map((l, i) => (
                <Linea key={l} ok={enProceso || i < 2}>
                  {l}
                </Linea>
              ))}
            </ul>
          </div>
          {enProceso ? (
            <Button variant="primary" icon={ChevronRight} className="md:min-w-[200px]" onClick={onVerEstado} data-testid="ver-estado">
              Ver estado
            </Button>
          ) : (
            <Button variant="accent" icon={ChevronRight} className="md:min-w-[200px]" onClick={onIniciarSip} data-testid="iniciar-sip">
              {sip.boton}
            </Button>
          )}
        </div>
      </Card>

      <Card className="anim-in">
        <Chip tono="neutro">{emt.etiqueta}</Chip>
        <h2 className="mt-3 font-display text-lg font-bold">{emt.titulo}</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {emt.precio} · {emt.descuento}
        </p>
        <ul className="mt-3 space-y-1.5">
          {emt.checklist.map((l) => (
            <Linea key={l}>{l}</Linea>
          ))}
        </ul>
        <Button variant="secondary" className="mt-4" onClick={() => onNoCubierto(emt.titulo)}>
          {emt.boton}
        </Button>
      </Card>

      <Card className="anim-in">
        <Chip tono="warn">{bono.etiqueta}</Chip>
        <h2 className="mt-3 font-display text-lg font-bold">{bono.titulo}</h2>
        <p className="mt-1 text-sm text-ink-soft">{bono.texto}</p>
        <ul className="mt-3 space-y-1.5">
          <Linea ok={false}>{bono.checklist[0]}</Linea>
          <Linea>{bono.checklist[1]}</Linea>
        </ul>
        <Button variant="secondary" icon={BellRing} className="mt-4" disabled>
          {bono.boton}
        </Button>
      </Card>
    </div>
  )
}

function Disponibles({ tema, setTema, onNoCubierto }) {
  const [q, setQ] = useState('')
  const temaActual = TEMAS.find((t) => t.id === tema)
  const lista = tramites.disponibles.filter(
    (t) => (!tema || t.temas.includes(tema)) && t.titulo.toLowerCase().includes(q.trim().toLowerCase()),
  )
  return (
    <div className="max-w-2xl">
      {temaActual && (
        <div className="mb-3 flex flex-wrap items-center gap-2" data-testid="tema-activo">
          <span className="text-sm font-semibold">Tema:</span>
          <Chip tono="primary" icon={temaActual.icono}>
            {temaActual.label}
          </Chip>
          <Button variant="ghost" icon={X} onClick={() => setTema(null)}>
            Quitar tema
          </Button>
        </div>
      )}
      <label htmlFor="filtro" className="mb-1 block text-sm font-semibold">
        Filtrar trámites
      </label>
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          id="filtro"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej.: empadronamiento"
          className="min-h-[44px] w-full rounded-control border border-surface-strong bg-white py-2 pl-9 pr-3 text-base sm:text-sm"
        />
      </div>
      {lista.length === 0 ? (
        <Card className="mt-4 text-center">
          <p className="font-semibold">
            {q ? `Ningún trámite coincide con «${q}»` : 'Aún no hay trámites de este tema en la demo'}
          </p>
          <p className="mt-1 text-sm text-ink-soft">Prueba con otra palabra o muestra todos los trámites.</p>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => {
              setQ('')
              setTema(null)
            }}
          >
            Mostrar todos
          </Button>
        </Card>
      ) : (
        <ul className="mt-4 divide-y divide-surface-line overflow-hidden rounded-card border border-surface-line bg-white shadow-card">
          {lista.map((t) => (
            <li key={t.titulo} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="font-medium">{t.titulo}</span>
              <Button variant="ghost" icon={ChevronRight} onClick={() => onNoCubierto(t.titulo)}>
                Ver trámite
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
