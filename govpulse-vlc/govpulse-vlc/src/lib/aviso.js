import perfil from '../data/perfil.json'
import ayudas from '../data/ayudas.json'
import tarjeta from '../data/tarjeta.json'

const TIMEOUT_MS = 8000

/**
 * Envía un correo vía el webhook único de n8n. El campo `tipo` decide la plantilla
 * (contrato en /mnt/project-files/hackathon/mvp/contrato-correos.md).
 * Devuelve { via: 'n8n' | 'local' }. Nunca lanza: si no hay URL o falla, cae a simulación local.
 */
export async function enviarCorreo(tipo, datos = {}) {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL
  if (!url) return { via: 'local' }

  const cuerpo = {
    tipo,
    nombre: perfil.nombre,
    email: import.meta.env.VITE_DEMO_EMAIL,
    enlace: window.location.origin + '/',
    ...datos,
  }

  const control = new AbortController()
  const temporizador = setTimeout(() => control.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
      signal: control.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return { via: 'n8n' }
  } catch {
    return { via: 'local' }
  } finally {
    clearTimeout(temporizador)
  }
}

/** Aviso proactivo: "Vlad, ya puedes pedir tu tarjeta sanitaria". */
export function enviarAviso() {
  return enviarCorreo('aviso_sip', {
    enlace: window.location.origin + '/?tramite=sip',
    tramite: 'Tarjeta sanitaria (SIP)',
    motivo: 'Llevas 3 meses en València y tienes alta en la Seguridad Social, pero aún no tienes médico asignado.',
    instituciones: 5,
  })
}

/** Correo de bienvenida con la beca destacada y las recomendaciones (cada entrada con Cl@ve). */
export function enviarAcceso() {
  return enviarCorreo('acceso', {
    enlace: window.location.origin + '/',
    destacada: ayudas.destacada,
    recomendaciones: ayudas.recomendaciones,
  })
}

/** Correo final: la revisión ha terminado y la tarjeta sanitaria está aceptada. */
export function enviarTarjetaAceptada() {
  return enviarCorreo('tarjeta_aceptada', {
    apellidos: perfil.apellidos,
    enlace: window.location.origin + '/?tramite=sip',
    sip: tarjeta.sip,
    registro: tarjeta.registro,
    centro: tarjeta.centro,
    medico: tarjeta.medico,
    fecha: tarjeta.fecha,
    validez: tarjeta.validez,
  })
}
