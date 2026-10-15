import perfil from '../data/perfil.json'

const TIMEOUT_MS = 8000

/**
 * Dispara el aviso proactivo vía webhook de n8n.
 * Devuelve { via: 'n8n' | 'local' }. Nunca lanza: si no hay URL o falla, cae a simulación local.
 */
export async function enviarAviso() {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL
  if (!url) return { via: 'local' }

  const cuerpo = {
    nombre: perfil.nombre,
    email: import.meta.env.VITE_DEMO_EMAIL,
    tramite: 'Tarjeta sanitaria (SIP)',
    motivo: 'Llevas 3 meses en València y tienes alta en la Seguridad Social, pero aún no tienes médico asignado.',
    enlace: window.location.origin + '/?tramite=sip',
    instituciones: 5,
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
