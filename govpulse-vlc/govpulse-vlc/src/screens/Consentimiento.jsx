import { useState } from 'react'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Button, Card, Chip } from '../components/ui.jsx'
import { INSTITUCIONES, FINALIDAD } from '../lib/instituciones.js'
import { Volver } from './Ficha.jsx'

export default function Consentimiento({ onVolver, onAutorizar }) {
  const [marcadas, setMarcadas] = useState(() => Object.fromEntries(INSTITUCIONES.map((i) => [i.id, true])))
  const todas = Object.values(marcadas).every(Boolean)

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
      <Volver onClick={onVolver}>Volver a la ficha</Volver>
      <h1 className="mt-2 font-display text-2xl font-bold text-primary-800 md:text-3xl">Tu consentimiento</h1>
      <p className="mt-1 text-ink-soft">
        Para tramitar la tarjeta SIP consultaremos estos datos a cada institución. Puedes oponerte a cualquiera de ellas.
      </p>

      <ul className="mt-5 space-y-3">
        {INSTITUCIONES.map((i) => (
          <li key={i.id}>
            <Card className="anim-in !p-4">
              <div className="flex items-start gap-3">
                <input
                  id={`c-${i.id}`}
                  type="checkbox"
                  checked={marcadas[i.id]}
                  onChange={(e) => setMarcadas((m) => ({ ...m, [i.id]: e.target.checked }))}
                  className="mt-1 h-6 w-6 shrink-0 accent-primary-700"
                />
                <label htmlFor={`c-${i.id}`} className="min-w-0 flex-1 cursor-pointer">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{i.nombre}</span>
                    <Chip tono={i.nivel}>{i.nivel}</Chip>
                  </span>
                  <span className="mt-1 block text-sm">Dato: {i.dato}</span>
                  <span className="block text-sm text-ink-soft">Finalidad: {FINALIDAD}</span>
                  <span className="mt-1 block text-xs font-medium text-primary-700">Puedes oponerte (art. 28.2 Ley 39/2015)</span>
                </label>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {!todas && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-control border border-warn-200 bg-warn-50 p-3 text-sm text-warn-700">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          Si te opones a una consulta tendrás que aportar ese dato por tu cuenta. En esta demo hacen falta las 5 para seguir.
        </p>
      )}

      <div className="mt-6">
        <Button variant="accent" icon={ShieldCheck} block className="sm:w-auto" disabled={!todas} onClick={onAutorizar} data-testid="autorizar">
          Autorizar y consultar
        </Button>
      </div>
    </div>
  )
}
