import { Check, Inbox, FileText, Eye, CreditCard, FastForward } from 'lucide-react'
import { Button, Card, Chip } from '../components/ui.jsx'

const FASES = [
  { id: 1, titulo: 'Presentada', icono: FileText },
  { id: 2, titulo: 'En revisión', icono: Eye },
  { id: 3, titulo: 'Tarjeta en camino', icono: CreditCard },
]

export default function EnProceso({ solicitud, onAvanzar, onVerResguardo, onVerRecomendados }) {
  if (!solicitud)
    return (
      <Card className="max-w-xl text-center">
        <Inbox aria-hidden="true" className="mx-auto h-8 w-8 text-primary-500" />
        <p className="mt-2 font-semibold">Aún no tienes trámites en proceso</p>
        <p className="mt-1 text-sm text-ink-soft">Cuando envíes una solicitud, podrás seguir aquí su estado.</p>
        <Button variant="primary" className="mt-3" onClick={onVerRecomendados}>
          Ver recomendados
        </Button>
      </Card>
    )

  const fase = solicitud.fase // 1..3 = paso actual (los anteriores están completados)
  const actualTitulo = FASES.find((f) => f.id === fase).titulo
  return (
    <Card className="anim-in" data-testid="en-proceso">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl font-bold">Tarjeta sanitaria (SIP)</h2>
        <Chip tono={fase >= 3 ? 'ok' : 'primary'}>{actualTitulo}</Chip>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Nº de registro {solicitud.registro} · {solicitud.fecha}
      </p>

      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {FASES.map((f) => {
          const hecha = f.id < fase
          const actual = f.id === fase
          const Icono = hecha ? Check : f.icono
          return (
            <li
              key={f.id}
              className={`flex items-center gap-3 rounded-card border p-4 ${
                hecha
                  ? 'border-[#B7E0C4] bg-ok-50'
                  : actual
                    ? 'border-primary-700 bg-primary-50 ring-2 ring-primary-700'
                    : 'border-surface-line bg-surface-muted'
              }`}
              aria-current={actual ? 'step' : undefined}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  hecha ? 'bg-ok-600 text-white' : actual ? 'bg-primary-700 text-white' : 'bg-surface-line text-ink-soft'
                }`}
              >
                <Icono aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{f.titulo}</p>
                <p className={`text-sm ${actual ? 'font-bold text-primary-700' : hecha ? 'font-semibold text-ok-700' : 'text-ink-soft'}`}>
                  {hecha ? 'Completada' : actual ? 'Ahora' : 'Pendiente'}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-surface-line pt-4">
        <Button variant="secondary" onClick={onVerResguardo}>
          Ver resguardo
        </Button>
        {fase < 3 && (
          <Button variant="ghost" icon={FastForward} onClick={onAvanzar} data-testid="avanzar">
            Avanzar estado
          </Button>
        )}
      </div>
    </Card>
  )
}
