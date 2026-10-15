import { ArrowLeft, CalendarCheck, FileText, FileSearch } from 'lucide-react'
import { Button, Card, Chip } from '../components/ui.jsx'
import { INSTITUCIONES } from '../lib/instituciones.js'

export function Volver({ onClick, children }) {
  return (
    <Button variant="ghost" icon={ArrowLeft} onClick={onClick} className="-ml-3">
      {children}
    </Button>
  )
}

export default function Ficha({ onVolver, onSiguiente }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <Volver onClick={onVolver}>Volver a recomendados</Volver>
      <div className="mt-2 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="anim-in">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tono="primary">Te corresponde</Chip>
            <Chip tono="ok" icon={CalendarCheck}>
              Sin plazo
            </Chip>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary-800 md:text-3xl">Tarjeta sanitaria (SIP)</h1>
          <p className="text-sm text-ink-soft">Conselleria de Sanitat (GVA)</p>

          <h2 className="mt-5 font-display text-base font-bold">Qué es</h2>
          <p className="mt-1 text-ink-soft">
            El documento que te identifica en el sistema sanitario valenciano: con él te asignan centro de salud y médico
            de cabecera.
          </p>
          <h2 className="mt-4 font-display text-base font-bold">Para qué sirve</h2>
          <p className="mt-1 text-ink-soft">La necesitas para tener médico de cabecera y atención sanitaria pública.</p>
          <h2 className="mt-4 font-display text-base font-bold">Plazo</h2>
          <p className="mt-1 text-ink-soft">Sin plazo: puedes pedirla cuando quieras.</p>
        </Card>

        <Card destacada className="anim-in">
          <h2 className="font-display text-lg font-bold">Para este trámite consultaremos por ti a 5 instituciones</h2>
          <ul className="mt-3 space-y-2">
            {INSTITUCIONES.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <Chip tono={i.nivel}>{i.nivel}</Chip>
                <span className="font-medium">{i.nombre}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex items-start gap-2 text-sm text-ink-soft">
            <FileText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            No tendrás que pedir ni adjuntar ningún certificado.
          </p>
          <Button variant="accent" icon={FileSearch} block className="mt-4" onClick={onSiguiente} data-testid="pedir-docs">
            Pedir los documentos por mí
          </Button>
        </Card>
      </div>
    </div>
  )
}
