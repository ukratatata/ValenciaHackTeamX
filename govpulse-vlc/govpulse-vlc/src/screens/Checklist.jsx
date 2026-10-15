import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, FileCheck2, Upload, HelpCircle, FileText } from 'lucide-react'
import { Button, Card, ChecklistRow } from '../components/ui.jsx'
import Hub from '../components/Hub.jsx'
import { INSTITUCIONES, consultar, resolverPadron } from '../lib/instituciones.js'

const espera = (ms) => new Promise((r) => setTimeout(r, ms))
const ESPERA_TEXTO = { inss: 'Esperando al padrón', sanidad: 'Esperando al INSS' }

export default function Checklist({ onVolver, onRevisar }) {
  const [est, setEst] = useState(() => Object.fromEntries(INSTITUCIONES.map((i) => [i.id, { s: 'espera' }])))
  const [comoAbierto, setComoAbierto] = useState(false)
  const [nombreDoc, setNombreDoc] = useState('')
  const arrancado = useRef(false)
  const ficheroRef = useRef(null)

  const set = (id, v) => setEst((p) => ({ ...p, [id]: { ...p[id], ...v } }))

  async function lanzar(id, opts) {
    if (!opts?.silencioso) set(id, { s: 'consultando' })
    const r = await consultar(id, opts)
    set(id, { s: r.estado === 'ok' ? 'ok' : 'no_consta', r })
    return r
  }

  async function cadena() {
    const r = await lanzar('inss')
    if (r.estado === 'ok') await lanzar('sanidad')
  }

  useEffect(() => {
    if (arrancado.current) return
    arrancado.current = true
    lanzar('dgp')
    lanzar('tgss')
    ;(async () => {
      const r = await lanzar('padron')
      if (r.estado === 'ok') await cadena()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function aportarDocumento(nombre) {
    setNombreDoc(nombre)
    set('padron', { s: 'tramitando' })
    await espera(2000)
    resolverPadron()
    await lanzar('padron', { retardo: 0, silencioso: true })
    await cadena()
  }

  const verificados = INSTITUCIONES.filter((i) => est[i.id].s === 'ok').length
  const completo = verificados === INSTITUCIONES.length
  const nuevoPadron = est.padron.s
  const diagRef = useRef(null)

  // Al aparecer el Diagnóstico Express, lo traemos a la vista (sin movimiento si el usuario lo prefiere así)
  useEffect(() => {
    if (nuevoPadron !== 'no_consta' || !diagRef.current) return
    const reducido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    diagRef.current.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'nearest' })
  }, [nuevoPadron])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8 lg:max-w-6xl lg:py-5">
      <div className="flex flex-col lg:grid lg:grid-cols-[45%_minmax(0,1fr)] lg:items-start lg:gap-x-6">
        {/* Columna izquierda en escritorio (fija al hacer scroll); en móvil se "disuelve" y manda el orden de los hijos */}
        <div className="contents lg:sticky lg:top-28 lg:block">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent-700">1 petición · 5 instituciones</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-primary-800 md:text-3xl lg:text-2xl">Consultando por ti</h1>
          </div>

          <Card className="mt-4 !p-4 lg:mt-0 lg:!p-3.5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold" data-testid="contador">
                {verificados} de 5 verificados
              </p>
            </div>
            <div
              className="mt-2 h-3 overflow-hidden rounded-full bg-surface-line"
              role="progressbar"
              aria-label="Instituciones verificadas"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={verificados}
              aria-valuetext={`${verificados} de 5 verificados`}
            >
              <div
                className="h-full rounded-full bg-ok-600 transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${(verificados / 5) * 100}%` }}
              />
            </div>
          </Card>

          <Card className="mt-4 !p-4 sm:!p-5 lg:!p-4">
            <h2 className="font-display text-base font-bold">Una petición. Gov+ consulta por ti.</h2>
            <Hub
              className="mt-3"
              estados={Object.fromEntries(INSTITUCIONES.map((i) => [i.id, est[i.id].s]))}
            />
          </Card>

          {completo && (
            <p
              role="status"
              data-testid="exito"
              className="anim-in mt-6 flex items-start gap-3 rounded-card border border-[#B7E0C4] bg-ok-50 p-4 font-semibold text-ok-700 max-lg:order-3 lg:mt-3 lg:p-3"
            >
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              Las 5 instituciones han respondido. No has ido a ninguna ventanilla.
            </p>
          )}

          <div className="max-lg:order-4 mt-4 flex flex-wrap items-center justify-between gap-3 lg:mt-2">
            <Button variant="ghost" onClick={onVolver} className="-ml-3">
              Cancelar
            </Button>
            {completo && (
              <Button variant="accent" icon={FileCheck2} onClick={() => onRevisar(Object.fromEntries(INSTITUCIONES.map((i) => [i.id, est[i.id].r])))} data-testid="revisar-borrador" className="anim-in">
                Revisar borrador
              </Button>
            )}
          </div>
        </div>

        <ol className="mt-4 space-y-3 max-lg:order-2 lg:mt-0 lg:space-y-2">
        {INSTITUCIONES.map((i) => (
          <ChecklistRow key={i.id} inst={i} estado={est[i.id].s} resp={est[i.id].r} textoEspera={ESPERA_TEXTO[i.id]}>
            {i.id === 'padron' && nuevoPadron === 'no_consta' && (
              <div ref={diagRef} className="anim-in mt-4 scroll-mb-4 rounded-control border border-warn-200 bg-white p-4 lg:mt-2.5 lg:p-3" data-testid="diagnostico">
                <h2 className="flex items-start gap-2 font-display text-base font-bold">
                  <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-warn-700" />
                  Falta 1 documento que ninguna administración tiene
                </h2>
                <p className="mt-2 text-sm text-ink-soft lg:mt-1">
                  Para empadronarte necesitamos tu contrato de alquiler o la autorización de la persona titular del piso.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 lg:mt-2">
                  <input
                    ref={ficheroRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="sr-only"
                    tabIndex={-1}
                    aria-label="Subir foto del contrato"
                    data-testid="subir-fichero"
                    onChange={(e) => e.target.files?.[0] && aportarDocumento(e.target.files[0].name)}
                  />
                  <Button variant="primary" icon={Upload} onClick={() => ficheroRef.current?.click()}>
                    Subir foto del contrato
                  </Button>
                  <Button variant="secondary" icon={FileCheck2} onClick={() => aportarDocumento('documento-de-ejemplo.pdf')} data-testid="doc-ejemplo">
                    Usar documento de ejemplo
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => setComoAbierto((v) => !v)}
                  aria-expanded={comoAbierto}
                  className="mt-1 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-primary-700 underline underline-offset-2"
                >
                  <HelpCircle aria-hidden="true" className="h-4 w-4" />
                  No lo tengo → cómo conseguirlo
                </button>
                {comoAbierto && (
                  <p className="rounded-control bg-primary-50 p-3 text-sm text-ink-soft">
                    Pide a la persona titular del piso (o a la agencia) una copia del contrato, o que firme una autorización de
                    empadronamiento y te envíe una copia de su documento de identidad. Una foto legible es suficiente.
                  </p>
                )}
              </div>
            )}
            {i.id === 'padron' && nombreDoc && nuevoPadron !== 'no_consta' && (
              <p className="mt-2 pl-[3.25rem] text-xs text-ink-soft">Documento aportado: {nombreDoc}</p>
            )}
          </ChecklistRow>
        ))}
      </ol>
      </div>
    </div>
  )
}
