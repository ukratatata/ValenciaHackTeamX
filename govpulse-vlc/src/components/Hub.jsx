import { Activity, AlertTriangle, Briefcase, Check, Clock, Fingerprint, Home, ShieldCheck, Stethoscope, User } from 'lucide-react'
import { INSTITUCIONES } from '../lib/instituciones.js'

/*
 * Diagrama "hub" de interconexión: Vlad (1 petición) -> GovPulse -> 5 instituciones.
 * Las líneas reflejan el estado real de cada consulta:
 *   espera = gris discontinua · consultando = azul animada · ok = verde sólida · no consta = ámbar discontinua larga.
 * Con prefers-reduced-motion se quitan las animaciones (queda solo el cambio de color).
 * Es decorativo para lector de pantalla: el detalle accesible está en las filas del checklist.
 */

const COL = { espera: '#8794A8', consultando: '#2F63A8', ok: '#166534', no_consta: '#B45309' }
const FONDO = { espera: '#FFFFFF', consultando: '#EEF3FA', ok: '#E6F4EA', no_consta: '#FFF4D6' }
const BORDE = { espera: '#D5DDE8', consultando: '#2F63A8', ok: '#9FD3B1', no_consta: '#E8C877' }
const NIVEL = {
  Estado: { fondo: '#EFEAFB', texto: '#4C2F94', ancho: 54 },
  Generalitat: { fondo: '#FCE7F3', texto: '#9D174D', ancho: 82 },
  Local: { fondo: '#E3ECF8', texto: '#14325C', ancho: 46 },
}
const ICONOS = { dgp: Fingerprint, tgss: Briefcase, padron: Home, inss: ShieldCheck, sanidad: Stethoscope }
const NOMBRE = {
  dgp: 'Policía Nacional (DGP)',
  tgss: 'Seguridad Social (TGSS)',
  padron: 'Ajuntament de València',
  inss: 'INSS · Seguridad Social',
  sanidad: 'Conselleria de Sanitat',
}
const PILDORA_MOVIL = { Estado: 50, Generalitat: 74, Local: 42 }
const CORTO = { dgp: 'Policía', tgss: 'TGSS', padron: 'Padrón', inss: 'INSS', sanidad: 'Sanidad' }

const norm = (e) => (e === 'tramitando' ? 'consultando' : e || 'espera')

function Cable({ d, estado }) {
  const e = norm(estado)
  const trazo =
    e === 'espera'
      ? { strokeDasharray: '3 7', strokeWidth: 2 }
      : e === 'consultando'
        ? { strokeDasharray: '7 5', strokeWidth: 3, className: 'hub-flow' }
        : e === 'ok'
          ? { strokeWidth: 3 }
          : { strokeDasharray: '10 5', strokeWidth: 3 }
  return (
    <path
      d={d}
      fill="none"
      stroke={COL[e]}
      strokeLinecap="round"
      data-hub-line=""
      data-estado={e}
      style={{ transition: 'stroke 0.4s' }}
      {...trazo}
    />
  )
}

/* Insignia de estado (círculo con icono): siempre icono + color, nunca solo color */
function Insignia({ cx, cy, estado, r = 11 }) {
  const e = norm(estado)
  if (e === 'consultando')
    return (
      <g aria-hidden="true">
        <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke="#B9CDE8" strokeWidth="3" />
        <circle
          className="hub-spin"
          cx={cx}
          cy={cy}
          r={r - 2}
          fill="none"
          stroke={COL.consultando}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="14 40"
        />
      </g>
    )
  const Icono = e === 'ok' ? Check : e === 'no_consta' ? AlertTriangle : Clock
  const fondo = e === 'espera' ? '#EEF1F6' : COL[e]
  const color = e === 'espera' ? COL.espera : '#FFFFFF'
  return (
    <g aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill={fondo} />
      <Icono x={cx - 7} y={cy - 7} width={14} height={14} color={color} strokeWidth={3} />
    </g>
  )
}

function Pildora({ x, y, nivel, tam = 12, alto = 18, ancho: anchoFijo }) {
  const n = NIVEL[nivel]
  const ancho = anchoFijo ?? n.ancho
  return (
    <g>
      <rect x={x} y={y} width={ancho} height={alto} rx={alto / 2} fill={n.fondo} />
      <text x={x + ancho / 2} y={y + alto / 2 + 4} textAnchor="middle" fontSize={tam} fontWeight="700" fill={n.texto}>
        {nivel}
      </text>
    </g>
  )
}

function estadoGlobal(estados) {
  const v = INSTITUCIONES.map((i) => norm(estados[i.id]))
  if (v.every((e) => e === 'ok')) return 'ok'
  if (v.some((e) => e === 'consultando')) return 'consultando'
  return 'espera'
}

/* ---- Variante ancha (>= 640 px) ---- */
function Ancho({ estados, global }) {
  const ys = [40, 105, 170, 235, 300]
  return (
    <svg viewBox="0 0 720 340" className="hidden h-auto w-full sm:block" aria-hidden="true" focusable="false">
      {/* cables (debajo de los nodos) */}
      <Cable d="M130 170 L196 170" estado={global} />
      {INSTITUCIONES.map((inst, k) => (
        <Cable key={inst.id} d={`M320 170 C375 170 375 ${ys[k]} 430 ${ys[k]}`} estado={estados[inst.id]} />
      ))}

      {/* Vlad */}
      <g>
        <rect x="0.75" y="138" width="129" height="64" rx="12" fill="#FFFFFF" stroke="#D5DDE8" strokeWidth="1.5" />
        <circle cx="30" cy="170" r="17" fill="#DCE7F5" />
        <User x={20} y={160} width={20} height={20} color="#1F4E8C" />
        <text x="56" y="167" fontSize="17" fontWeight="700" fill="#1B2433">
          Vlad
        </text>
        <text x="56" y="187" fontSize="14" fill="#4A5568">
          1 petición
        </text>
      </g>

      {/* GovPulse */}
      <g>
        {global === 'consultando' && (
          <rect className="hub-pulse" x="188" y="122" width="140" height="96" rx="20" fill="none" stroke="#2F63A8" strokeWidth="3" />
        )}
        <rect x="196" y="130" width="124" height="80" rx="14" fill="#14325C" />
        <Activity x={246} y={140} width={24} height={24} color="#FFFFFF" />
        <text x="258" y="186" textAnchor="middle" fontSize="16" fontWeight="700" fill="#FFFFFF">
          GovPulse
        </text>
        <text x="258" y="202" textAnchor="middle" fontSize="12" fill="#B9CDE8">
          consulta por ti
        </text>
      </g>

      {/* Instituciones */}
      {INSTITUCIONES.map((inst, k) => {
        const e = norm(estados[inst.id])
        const cy = ys[k]
        const Icono = ICONOS[inst.id]
        return (
          <g key={inst.id} data-hub-nodo={inst.id} data-estado={e}>
            <rect
              x="431"
              y={cy - 28}
              width="288"
              height="56"
              rx="12"
              fill={FONDO[e]}
              stroke={BORDE[e]}
              strokeWidth="1.5"
              style={{ transition: 'fill 0.4s, stroke 0.4s' }}
            />
            <circle cx="460" cy={cy} r="17" fill="#DCE7F5" />
            <Icono x={450} y={cy - 10} width={20} height={20} color="#1F4E8C" />
            <text x="488" y={cy - 4} fontSize="14" fontWeight="700" fill="#1B2433">
              {NOMBRE[inst.id]}
            </text>
            <Pildora x={488} y={cy + 4} nivel={inst.nivel} />
            <Insignia cx={696} cy={cy} estado={e} />
          </g>
        )
      })}
    </svg>
  )
}

/* ---- Variante compacta (< 640 px): petición -> GovPulse -> 5 puntos de estado ---- */
function Compacto({ estados, global }) {
  const xs = [32, 98, 164, 230, 296]
  return (
    <svg viewBox="0 0 340 238" className="block h-auto w-full sm:hidden" aria-hidden="true" focusable="false">
      <Cable d="M122 26 L206 26" estado={global} />
      {INSTITUCIONES.map((inst, k) => (
        <Cable key={inst.id} d={`M272 52 C272 96 ${xs[k]} 86 ${xs[k]} 124`} estado={estados[inst.id]} />
      ))}

      <g>
        <rect x="0.75" y="0.75" width="121" height="50" rx="12" fill="#FFFFFF" stroke="#D5DDE8" strokeWidth="1.5" />
        <circle cx="26" cy="26" r="14" fill="#DCE7F5" />
        <User x={18} y={18} width={16} height={16} color="#1F4E8C" />
        <text x="48" y="23" fontSize="15" fontWeight="700" fill="#1B2433">
          Vlad
        </text>
        <text x="48" y="40" fontSize="13" fill="#4A5568">
          1 petición
        </text>
      </g>

      <g>
        {global === 'consultando' && (
          <rect className="hub-pulse" x="200" y="-5" width="140" height="62" rx="16" fill="none" stroke="#2F63A8" strokeWidth="3" />
        )}
        <rect x="206" y="0" width="132" height="52" rx="12" fill="#14325C" />
        <Activity x={218} y={14} width={24} height={24} color="#FFFFFF" />
        <text x="248" y="31" fontSize="16" fontWeight="700" fill="#FFFFFF">
          GovPulse
        </text>
      </g>

      {INSTITUCIONES.map((inst, k) => {
        const e = norm(estados[inst.id])
        const x = xs[k]
        const Icono = ICONOS[inst.id]
        return (
          <g key={inst.id} data-hub-nodo={inst.id} data-estado={e}>
            <circle cx={x} cy="148" r="24" fill={FONDO[e]} stroke={BORDE[e]} strokeWidth="2" style={{ transition: 'fill 0.4s, stroke 0.4s' }} />
            <Icono x={x - 11} y={137} width={22} height={22} color={e === 'espera' ? '#4A5568' : COL[e]} />
            <Insignia cx={x + 17} cy={129} estado={e} r={9} />
            <text x={x} y="192" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1B2433">
              {CORTO[inst.id]}
            </text>
            <Pildora x={x - PILDORA_MOVIL[inst.nivel] / 2} y={202} nivel={inst.nivel} tam={11} alto={17} ancho={PILDORA_MOVIL[inst.nivel]} />
          </g>
        )
      })}
    </svg>
  )
}

export default function Hub({ estados, className = '' }) {
  const global = estadoGlobal(estados)
  const verificadas = INSTITUCIONES.filter((i) => norm(estados[i.id]) === 'ok').length
  return (
    <div
      role="img"
      aria-label={`Diagrama: Vlad hace 1 petición a GovPulse, que consulta a 5 instituciones. ${verificadas} de 5 han respondido.`}
      className={className}
      data-testid="hub"
    >
      <Ancho estados={estados} global={global} />
      <Compacto estados={estados} global={global} />
    </div>
  )
}
