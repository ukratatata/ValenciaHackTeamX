import perfil from '../data/perfil.json'
import tarjeta from '../data/tarjeta.json'

/*
 * Tarjeta sanitaria dibujada como una tarjeta real (proporción ISO/IEC 7810 ID-1 ≈ 1,586:1).
 * Fondo #1A1A1A, franja amarilla #FFCC29. Sin logotipos ni escudos oficiales: es una pieza SIMULADA.
 * Entra con una animación suave (clase anim-tarjeta, desactivada con prefers-reduced-motion).
 */
export default function TarjetaSanitaria({ className = '' }) {
  return (
    <figure
      className={`anim-tarjeta m-0 w-full max-w-[26rem] overflow-hidden rounded-2xl bg-[#1A1A1A] text-white shadow-panel ring-1 ring-black/20 ${className}`}
      style={{ aspectRatio: '1.586 / 1' }}
      data-testid="tarjeta-sanitaria"
    >
      <div className="flex h-full flex-col">
        <div className="bg-[#FFCC29] px-4 py-2.5 text-[#1A1A1A]">
          <span className="text-[0.8125rem] font-bold uppercase tracking-wide">Tarjeta sanitaria · SIMULADA</span>
        </div>
        <div className="flex flex-1 flex-col justify-between px-4 pb-3.5 pt-3">
          <div>
            <span
              aria-hidden="true"
              className="mb-2.5 block h-8 w-11 rounded-md bg-gradient-to-br from-[#FFE27A] to-[#D9A800] ring-1 ring-black/30"
            />
            <p className="text-xl font-bold leading-tight sm:text-2xl">
              {perfil.nombre} {perfil.apellidos}
            </p>
            <p className="mt-1 text-[0.9375rem] font-semibold tracking-wider text-[#FFCC29]">SIP {tarjeta.sip}</p>
          </div>
          <div className="text-[0.875rem] leading-snug text-white">
            <p className="font-semibold">{tarjeta.centro}</p>
            <p>{tarjeta.medicoCorto}</p>
          </div>
        </div>
      </div>
    </figure>
  )
}
