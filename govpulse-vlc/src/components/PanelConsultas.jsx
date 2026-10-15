import { useSyncExternalStore } from 'react'
import { Eye } from 'lucide-react'
import { Chip, Overlay } from './ui.jsx'
import { getRegistro, suscribirRegistro } from '../lib/instituciones.js'

export default function PanelConsultas({ abierto, onClose }) {
  const registro = useSyncExternalStore(suscribirRegistro, getRegistro)
  return (
    <Overlay abierto={abierto} onClose={onClose} titulo="Quién ha consultado tus datos" lado="derecha" idTitulo="panel-titulo">
      <p className="text-sm text-ink-soft">
        Cada vez que una institución consulta tus datos queda registrado aquí, con su finalidad y su código de verificación.
      </p>

      {registro.length === 0 ? (
        <div className="mt-6 rounded-card border border-dashed border-surface-line p-6 text-center">
          <Eye aria-hidden="true" className="mx-auto h-7 w-7 text-primary-500" />
          <p className="mt-2 font-semibold">Todavía nadie ha consultado tus datos</p>
          <p className="mt-1 text-sm text-ink-soft">Aparecerán aquí cuando autorices un trámite.</p>
        </div>
      ) : (
        <>
          {/* Móvil: tarjetas */}
          <ul className="mt-4 space-y-3 md:hidden">
            {registro.map((r, i) => (
              <li key={i} className="rounded-card border border-surface-line p-3 text-sm">
                <p className="font-semibold">{r.institucion}</p>
                <p className="text-ink-soft">{r.consulta}</p>
                <p className="mt-1 text-ink-soft">Finalidad: {r.finalidad}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                  <span>{r.hora}</span>
                  <span className="font-mono">{r.csv}</span>
                  {r.estado !== 'ok' && <Chip tono="warn">No consta</Chip>}
                </p>
              </li>
            ))}
          </ul>
          {/* Escritorio: tabla */}
          <table className="mt-4 hidden w-full text-left text-sm md:table">
            <caption className="sr-only">Consultas realizadas a tus datos</caption>
            <thead>
              <tr className="border-b border-surface-line text-xs uppercase tracking-wide text-ink-soft">
                <th scope="col" className="py-2 pr-2">Institución</th>
                <th scope="col" className="py-2 pr-2">Dato</th>
                <th scope="col" className="py-2 pr-2">Finalidad</th>
                <th scope="col" className="py-2 pr-2">Hora</th>
                <th scope="col" className="py-2">CSV</th>
              </tr>
            </thead>
            <tbody>
              {registro.map((r, i) => (
                <tr key={i} className="border-b border-surface-line align-top">
                  <td className="py-2 pr-2 font-semibold">{r.institucion}</td>
                  <td className="py-2 pr-2">
                    {r.consulta}
                    {r.estado !== 'ok' && (
                      <span className="mt-1 block">
                        <Chip tono="warn">No consta</Chip>
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-2">{r.finalidad}</td>
                  <td className="whitespace-nowrap py-2 pr-2">{r.hora}</td>
                  <td className="whitespace-nowrap py-2 font-mono text-xs">{r.csv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Overlay>
  )
}
