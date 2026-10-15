import { CheckCircle2, ListChecks, Check, Minus } from 'lucide-react'
import { Button, Card } from '../components/ui.jsx'

export default function Resguardo({ solicitud, onVer }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
      <div className="anim-in text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-ok-600" />
        <h1 className="mt-2 font-display text-2xl font-bold text-primary-800 md:text-3xl">Solicitud presentada</h1>
        <p className="mt-2 font-display text-xl font-bold leading-snug text-accent-700 md:text-3xl" data-testid="cifra">
          1 petición · 5 instituciones · 0 formularios
        </p>
      </div>

      <Card className="anim-in mt-6">
        <h2 className="font-display text-lg font-bold">Resguardo</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <Dato t="Nº de registro" v={solicitud.registro} />
          <Dato t="SIP provisional" v={solicitud.sip} />
          <Dato t="Centro de salud" v={solicitud.centro} />
          <Dato t="Fecha y hora" v={solicitud.fecha} />
        </dl>
        <p className="mt-4 text-xs text-ink-soft">Documento simulado. Prototipo de hackatón, sin validez administrativa.</p>
      </Card>

      <section aria-labelledby="comparacion-titulo" className="anim-in mt-6" data-testid="comparacion">
        <h2 id="comparacion-titulo" className="font-display text-lg font-bold">
          Antes y con GovPulse
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-surface-line bg-surface-muted p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">Antes</p>
            <ul className="mt-3 space-y-3">
              <Cifra icono={Minus} gris numero="5" texto="ventanillas" />
              <Cifra icono={Minus} gris numero="5" texto="certificados en papel" />
            </ul>
          </div>
          <div className="rounded-card border border-primary-700 bg-white p-5 ring-1 ring-primary-700">
            <p className="text-sm font-bold uppercase tracking-wide text-primary-700">Con GovPulse</p>
            <ul className="mt-3 space-y-3">
              <Cifra icono={Check} numero="1" texto="petición" />
              <Cifra icono={Check} numero="0" texto="formularios" />
              <Cifra icono={Check} numero="1" texto="documento subido" />
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <Button variant="primary" icon={ListChecks} block className="sm:w-auto" onClick={onVer} data-testid="ver-proceso">
          Ver en En proceso
        </Button>
      </div>
    </div>
  )
}

function Dato({ t, v }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-ink-soft">{t}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  )
}

function Cifra({ icono: Icono, numero, texto, gris = false }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${gris ? 'bg-surface-line text-ink-soft' : 'bg-ok-50 text-ok-700'}`}
      >
        <Icono aria-hidden="true" className="h-4 w-4" />
      </span>
      <span className="text-base">
        <strong className={`font-display text-2xl font-bold ${gris ? 'text-ink-soft' : 'text-primary-800'}`}>{numero}</strong> {texto}
      </span>
    </li>
  )
}
