import { useEffect, useState } from 'react'
import { BellRing, FileCheck2, KeyRound, ShieldCheck, Zap } from 'lucide-react'
import { Button, Card } from '../components/ui.jsx'
import Hub from '../components/Hub.jsx'
import { INSTITUCIONES } from '../lib/instituciones.js'

const PASOS = [
  { icono: BellRing, titulo: 'Te avisamos', texto: 'Detectamos el trámite que te corresponde y te avisamos por correo.' },
  { icono: ShieldCheck, titulo: 'Tú autorizas', texto: 'Ves qué datos se consultan, a quién y para qué. Puedes oponerte.' },
  { icono: FileCheck2, titulo: 'Consultamos por ti', texto: 'Revisas el borrador ya relleno y lo confirmas. Sin ventanillas.' },
]

// Ilustración animada: las 5 instituciones responden una a una, en bucle.
function useCicloDemo() {
  const [paso, setPaso] = useState(6)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    setPaso(0)
    const id = setInterval(() => setPaso((p) => (p + 1) % 8), 1100)
    return () => clearInterval(id)
  }, [])
  return Object.fromEntries(
    INSTITUCIONES.map((inst, i) => [inst.id, paso > i + 1 ? 'ok' : paso === i + 1 ? 'consultando' : 'espera']),
  )
}

export default function Acceso({ onEntrar }) {
  const estados = useCicloDemo()
  return (
    <>
      <section className="bg-primary-800 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:py-14 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div className="anim-in">
            <p className="text-sm font-bold uppercase tracking-wide text-gold">Ajuntament de València · prototipo</p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-5xl">Los trámites llegan a ti</h1>
            <p className="mt-4 max-w-xl text-lg text-primary-100">
              Una sola petición y el portal consulta por ti a las instituciones que hagan falta. Sin ir de ventanilla en
              ventanilla.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/30">
              <Zap aria-hidden="true" className="h-4 w-4 text-gold" />1 petición · 5 instituciones · 0 formularios
            </p>
          </div>

          <Card className="anim-in !p-6 text-ink md:!p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-control bg-primary-100 text-primary-700">
              <KeyRound aria-hidden="true" className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold">Accede a tu espacio</h2>
            <p className="mt-1 text-sm text-ink-soft">Identifícate con Cl@ve para ver los trámites que te corresponden.</p>
            <Button variant="accent" icon={KeyRound} block className="mt-5 !min-h-[52px] text-base" onClick={onEntrar} data-testid="entrar-clave">
              Entrar con Cl@ve
            </Button>
            <p className="mt-3 text-center text-sm font-semibold text-ink-soft">Simulación: no se conecta a Cl@ve</p>
          </Card>
        </div>
      </section>

      <section aria-labelledby="como-titulo" className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <h2 id="como-titulo" className="font-display text-xl font-bold text-primary-800 md:text-2xl">
          Una petición, cinco instituciones
        </h2>
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-2">
          <Card className="!p-4 sm:!p-5">
            <Hub estados={estados} />
          </Card>
          <ol className="space-y-4">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <p.icono aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">
                    {i + 1}. {p.titulo}
                  </h3>
                  <p className="text-sm text-ink-soft">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
