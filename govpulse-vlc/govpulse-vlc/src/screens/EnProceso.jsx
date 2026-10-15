import { useEffect, useRef } from 'react'
import { Check, Inbox, FileText, Eye, BadgeCheck, FastForward, CalendarCheck, Siren, CreditCard, CheckCircle2 } from 'lucide-react'
import { Button, Card, Chip } from '../components/ui.jsx'
import TarjetaSanitaria from '../components/TarjetaSanitaria.jsx'

const FASES = [
  { id: 1, titulo: 'Presentada', icono: FileText },
  { id: 2, titulo: 'En revisión', icono: Eye },
  { id: 3, titulo: 'Tarjeta aceptada', icono: BadgeCheck },
]

const QUE_PUEDES_HACER = [
  { icono: CalendarCheck, titulo: 'Pedir cita con tu médico', texto: 'Dra. Lucía Ferrer, en el Centro de Salud Benimaclet.' },
  { icono: Siren, titulo: 'Ir a urgencias', texto: 'Con tu SIP provisional te atienden en cualquier centro.' },
  { icono: CreditCard, titulo: 'Recoger tu tarjeta física', texto: 'Estará lista en 10 días hábiles en tu centro de salud.' },
]

export default function EnProceso({ solicitud, onAvanzar, onVerResguardo, onVerRecomendados }) {
  const seccion = useRef(null)
  const aceptadaAhora = !!solicitud && solicitud.fase >= 3
  // Al aceptarse, lleva la vista a la tarjeta (sin animación si el usuario pide menos movimiento)
  useEffect(() => {
    if (!aceptadaAhora) return
    const reducido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    seccion.current?.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' })
  }, [aceptadaAhora])

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
  const aceptada = fase >= 3
  const actualTitulo = FASES.find((f) => f.id === fase).titulo
  return (
    <Card className="anim-in" data-testid="en-proceso">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl font-bold">Tarjeta sanitaria (SIP)</h2>
        <Chip tono={aceptada ? 'ok' : 'primary'}>{actualTitulo}</Chip>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Nº de registro {solicitud.registro} · {solicitud.fecha}
      </p>

      <ol className={`grid gap-3 md:grid-cols-3 ${aceptada ? 'mt-4' : 'mt-6 gap-4'}`}>
        {FASES.map((f) => {
          const hecha = f.id < fase || (aceptada && f.id === 3)
          const actual = f.id === fase && !aceptada
          const Icono = hecha ? Check : f.icono
          return (
            <li
              key={f.id}
              className={`flex items-center gap-3 rounded-card border ${aceptada ? 'p-3' : 'p-4'} ${
                hecha
                  ? 'border-[#B7E0C4] bg-ok-50'
                  : actual
                    ? 'border-ink bg-gold-soft ring-2 ring-ink'
                    : 'border-surface-line bg-surface-muted'
              }`}
              aria-current={actual || (aceptada && f.id === 3) ? 'step' : undefined}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  hecha ? 'bg-ok-600 text-white' : actual ? 'bg-gold text-ink ring-1 ring-ink' : 'bg-surface-line text-ink-soft'
                }`}
              >
                <Icono aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{f.titulo}</p>
                <p className={`text-sm ${actual ? 'font-bold text-ink' : hecha ? 'font-semibold text-ok-700' : 'text-ink-soft'}`}>
                  {hecha ? 'Completada' : actual ? 'Ahora' : 'Pendiente'}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      {aceptada && (
        <section aria-labelledby="aceptada-titulo" ref={seccion} className="mt-6 scroll-mt-32 border-t border-surface-line pt-6" data-testid="tarjeta-aceptada">
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-8">
            <div>
              <p
                id="aceptada-titulo"
                className="anim-in mb-4 inline-flex items-center gap-2 rounded-control border-2 border-ok-700 bg-ok-50 px-4 py-2 font-display text-base font-bold uppercase tracking-wide text-ok-700"
                data-testid="sello"
              >
                <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                Tarjeta aceptada
              </p>
              <TarjetaSanitaria />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Qué puedes hacer ya</h3>
              <ul className="mt-3 space-y-3">
                {QUE_PUEDES_HACER.map((q) => (
                  <li key={q.titulo} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                      <q.icono aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold leading-snug">{q.titulo}</p>
                      <p className="text-sm text-ink-soft">{q.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

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
