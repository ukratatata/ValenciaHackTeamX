import { Send, Sparkles } from 'lucide-react'
import perfil from '../data/perfil.json'
import { Button, Card, Chip } from '../components/ui.jsx'
import { Volver } from './Ficha.jsx'

export default function Borrador({ datos, onVolver, onConfirmar }) {
  const secciones = [
    {
      titulo: 'Identidad',
      valor: `${perfil.nombre} ${perfil.apellidos} · NIE ${perfil.nie}`,
      detalle: datos.dgp?.dato,
      fuente: 'Dirección General de la Policía',
      nivel: 'Estado',
      r: datos.dgp,
    },
    {
      titulo: 'Afiliación',
      valor: datos.tgss?.dato,
      fuente: 'Tesorería General de la Seguridad Social',
      nivel: 'Estado',
      r: datos.tgss,
    },
    {
      titulo: 'Domicilio',
      valor: perfil.direccion,
      detalle: datos.padron?.dato,
      fuente: 'Ajuntament de València',
      nivel: 'Local',
      r: datos.padron,
    },
    {
      titulo: 'Derecho sanitario',
      valor: datos.inss?.dato,
      fuente: 'Instituto Nacional de la Seguridad Social',
      nivel: 'Estado',
      r: datos.inss,
    },
    {
      titulo: 'Centro asignado',
      valor: datos.sanidad?.dato,
      fuente: 'Conselleria de Sanitat (GVA)',
      nivel: 'Generalitat',
      r: datos.sanidad,
    },
  ]
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
      <Volver onClick={onVolver}>Volver a la verificación</Volver>
      <h1 className="mt-2 font-display text-2xl font-bold text-primary-800 md:text-3xl">Revisa y confirma</h1>
      <p className="mt-2 inline-flex items-center gap-2 rounded-control bg-ok-50 px-3 py-2 text-sm font-semibold text-ok-700">
        <Sparkles aria-hidden="true" className="h-4 w-4" />
        No tienes que rellenar nada
      </p>

      <dl className="mt-5 space-y-3">
        {secciones.map((s) => (
          <Card key={s.titulo} className="anim-in !p-4">
            <dt className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-wide text-primary-700">{s.titulo}</span>
              <Chip tono={s.nivel}>{s.nivel}</Chip>
            </dt>
            <dd className="mt-1">
              <p className="font-semibold">{s.valor}</p>
              {s.detalle && <p className="text-sm text-ink-soft">{s.detalle}</p>}
              <p className="mt-1 text-xs text-ink-soft">
                Fuente: {s.fuente}
                {s.r && ` · ${s.r.csv}`}
              </p>
            </dd>
          </Card>
        ))}
      </dl>

      <div className="mt-6">
        <Button variant="accent" icon={Send} block className="sm:w-auto" onClick={onConfirmar} data-testid="confirmar">
          Confirmar y enviar
        </Button>
      </div>
    </div>
  )
}
