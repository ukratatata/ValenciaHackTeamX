// Mocks de interconexión con las 5 instituciones. Todo es simulado.

export const FINALIDAD = 'Tramitar tarjeta SIP'

export const INSTITUCIONES = [
  { id: 'dgp', nombre: 'Dirección General de la Policía', nivel: 'Estado', dato: 'Identidad y TIE de protección temporal', retardo: 900 },
  { id: 'tgss', nombre: 'Tesorería General de la Seguridad Social', nivel: 'Estado', dato: 'Alta laboral y nº de afiliación', retardo: 1800 },
  { id: 'padron', nombre: 'Ajuntament de València', nivel: 'Local', dato: 'Empadronamiento', retardo: 2600 },
  { id: 'inss', nombre: 'Instituto Nacional de la Seguridad Social', nivel: 'Estado', dato: 'Derecho a asistencia sanitaria', retardo: 1500 },
  { id: 'sanidad', nombre: 'Conselleria de Sanitat (GVA)', nivel: 'Generalitat', dato: 'Alta SIP y centro de salud', retardo: 1200 },
]

const OK = {
  dgp: 'TIE en vigor hasta 03/2027',
  tgss: 'Alta en Régimen General · NAF 46/1234567/89',
  padron: 'Empadronado en Benimaclet desde hoy',
  inss: 'Derecho reconocido como trabajador por cuenta ajena',
  sanidad: 'Centro de Salud Benimaclet asignado',
}

let padronOk = false
let inssOk = false
let registro = []
const suscriptores = new Set()

function avisar() {
  registro = registro.slice()
  suscriptores.forEach((fn) => fn())
}

// API para useSyncExternalStore
export function suscribirRegistro(fn) {
  suscriptores.add(fn)
  return () => suscriptores.delete(fn)
}
export function getRegistro() {
  return registro
}

export function resolverPadron() {
  padronOk = true
}
export function padronResuelto() {
  return padronOk
}

export function reiniciarMocks() {
  padronOk = false
  inssOk = false
  registro = []
  avisar()
}

const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
function trozo(n) {
  let s = ''
  for (let i = 0; i < n; i++) s += ALFABETO[Math.floor(Math.random() * ALFABETO.length)]
  return s
}
export function generarCsv() {
  return `CSV-${trozo(4)}-${trozo(4)}`
}

export function horaActual() {
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function resolver(id) {
  const base = INSTITUCIONES.find((i) => i.id === id)
  let estado = 'ok'
  let dato = OK[id]
  if (id === 'padron' && !padronOk) {
    estado = 'no_consta'
    dato = 'No consta empadronamiento en tu domicilio actual'
  }
  if (id === 'inss' && !padronOk) {
    estado = 'no_consta'
    dato = 'Requiere empadronamiento previo'
  }
  if (id === 'sanidad' && !inssOk) {
    estado = 'no_consta'
    dato = 'Requiere el derecho reconocido por el INSS'
  }
  if (id === 'inss' && estado === 'ok') inssOk = true
  return { estado, dato, emisor: base.nombre, csv: generarCsv(), hora: horaActual() }
}

/**
 * Consulta una institución. Devuelve una Promise con
 * { estado: 'ok' | 'no_consta', dato, emisor, csv, hora }.
 * `retardo` permite sobrescribir la latencia simulada.
 */
export function consultar(id, { retardo } = {}) {
  const base = INSTITUCIONES.find((i) => i.id === id)
  if (!base) return Promise.reject(new Error(`Institución desconocida: ${id}`))
  return new Promise((resolve) => {
    setTimeout(() => {
      const r = resolver(id)
      registro.push({ id, nivel: base.nivel, institucion: base.nombre, consulta: base.dato, finalidad: FINALIDAD, ...r })
      avisar()
      resolve(r)
    }, retardo ?? base.retardo)
  })
}
