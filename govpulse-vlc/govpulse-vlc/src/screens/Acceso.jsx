import { useCallback, useEffect, useRef, useState } from 'react'
import { BellRing, ChevronRight, CircleHelp, FileCheck2, IdCard, KeyRound, Loader2, ShieldCheck, Smartphone, Zap } from 'lucide-react'
import { Button, Card, Overlay } from '../components/ui.jsx'
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

const TIEMPO_CLAVE = 1200 // duración del "Conectando con Cl@ve (simulado)…"

export default function Acceso({ onEntrar, onAyuda }) {
  const estados = useCicloDemo()
  const [conectando, setConectando] = useState(false)
  const [dialogo, setDialogo] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  function entrarConClave() {
    setConectando(true)
    timer.current = setTimeout(onEntrar, TIEMPO_CLAVE)
  }
  const cerrarDialogo = useCallback(() => setDialogo(false), []) // estable: el Overlay reengancha el foco si cambia
  function aceptarCertificado() {
    setDialogo(false)
    onEntrar()
  }
  return (
    <>
      <section className="bg-gradient-to-b from-gold to-gold-soft text-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:py-14 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div className="anim-in">
            <p className="text-sm font-bold uppercase tracking-wide text-ink">Ajuntament de València · prototipo</p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-5xl">Los trámites llegan a ti</h1>
            <p className="mt-4 max-w-xl text-lg text-ink">
              Una sola petición y el portal consulta por ti a las instituciones que hagan falta. Sin ir de ventanilla en
              ventanilla.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-ink">
              <Zap aria-hidden="true" className="h-4 w-4 text-ink" />1 petición · 5 instituciones · 0 formularios
            </p>
          </div>

          <Card className="anim-in !p-5 text-ink md:!p-6" aria-busy={conectando}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-gold text-ink">
                <KeyRound aria-hidden="true" className="h-6 w-6" />
              </span>
              <h2 className="font-display text-xl font-bold">Accede a tu espacio</h2>
            </div>
            <p className="mt-2 text-sm text-ink-soft">Identifícate para ver los trámites que te corresponden. Elige cómo.</p>

            {conectando ? (
              <div role="status" className="mt-4 flex min-h-[168px] flex-col items-center justify-center gap-3 rounded-card border border-ink bg-gold-soft px-4 py-6 text-center">
                <Loader2 aria-hidden="true" className="h-9 w-9 animate-spin motion-reduce:animate-none" />
                <p className="font-display text-base font-bold" data-testid="conectando-clave">
                  Conectando con Cl@ve (simulado)…
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <Opcion icono={Smartphone} titulo="Cl@ve" subtitulo="Con tu móvil: Cl@ve Móvil o Cl@ve PIN" onClick={entrarConClave} data-testid="entrar-clave" />
                <Opcion icono={IdCard} titulo="Certificado electrónico" subtitulo="Instalado en tu ordenador o navegador" onClick={() => setDialogo(true)} data-testid="entrar-certificado" />
              </div>
            )}

            <div className="mt-4 flex items-center gap-3" role="separator">
              <span aria-hidden="true" className="h-px flex-1 bg-surface-line" />
              <span className="text-sm font-semibold text-ink-soft">¿No sabes cómo acceder?</span>
              <span aria-hidden="true" className="h-px flex-1 bg-surface-line" />
            </div>
            <Button variant="secondary" icon={CircleHelp} block className="mt-3" onClick={onAyuda} data-testid="ayuda-acceso" disabled={conectando}>
              Te explicamos cómo conseguir Cl@ve o tu certificado
            </Button>
            <p className="mt-3 text-center text-sm font-semibold text-ink-soft">Simulación: no se conecta a Cl@ve ni lee certificados</p>
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
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
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

      <Overlay abierto={dialogo} onClose={cerrarDialogo} titulo="Selecciona un certificado" idTitulo="cert-titulo">
        <DialogoCertificado onAceptar={aceptarCertificado} onCancelar={cerrarDialogo} />
      </Overlay>
    </>
  )
}

// Opción grande de acceso (Cl@ve / certificado)
function Opcion({ icono: Icono, titulo, subtitulo, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className="group flex min-h-[76px] w-full items-center gap-4 rounded-card border border-ink bg-white p-3.5 text-left transition-colors hover:bg-primary-50"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-ink group-hover:bg-gold-dark">
        <Icono aria-hidden="true" className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-bold leading-snug">{titulo}</span>
        <span className="block text-sm leading-snug text-ink-soft">{subtitulo}</span>
      </span>
      <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0" />
    </button>
  )
}

// Imita el diálogo del navegador "Selecciona un certificado" (no lee ningún certificado real)
function DialogoCertificado({ onAceptar, onCancelar }) {
  return (
    <>
      <p className="text-sm text-ink-soft">
        El sitio <strong className="font-semibold text-ink">govmas.valencia (simulado)</strong> solicita un certificado para identificarte.
      </p>
      <ul className="mt-4 rounded-control border border-surface-line" aria-label="Certificados disponibles">
        <li>
          <div aria-current="true" className="flex items-start gap-3 rounded-control border-2 border-ink bg-gold-soft p-3">
            <IdCard aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0" />
            <div className="min-w-0 text-sm">
              <p className="font-bold">KOVALENKO VLAD - Y1234567X</p>
              <p className="text-ink-soft">Emisor: FNMT-RCM · AC FNMT Usuarios</p>
              <p className="text-ink-soft">Válido hasta 15/10/2030</p>
            </div>
          </div>
        </li>
      </ul>
      <p className="mt-3 text-sm font-semibold text-ink-soft">Simulación: no se lee ningún certificado real</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onAceptar} data-autofocus data-testid="aceptar-certificado">
          Aceptar
        </Button>
      </div>
    </>
  )
}
