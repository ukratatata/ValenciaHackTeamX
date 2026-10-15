import { CheckCircle2, ListChecks } from 'lucide-react'
import { Button, Card } from '../components/ui.jsx'

export default function Resguardo({ solicitud, onVer }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="anim-in text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-ok-600" />
        <h1 className="mt-2 font-display text-2xl font-bold text-primary-800 md:text-3xl">Solicitud presentada</h1>
        <p className="mt-2 font-display text-xl font-bold leading-snug text-accent-700 text-balance md:text-3xl" data-testid="cifra">
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

      <div className="anim-in mt-6 flex justify-center">
        <Button variant="primary" icon={ListChecks} block className="sm:w-auto sm:min-w-[16rem]" onClick={onVer} data-testid="ver-proceso">
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
