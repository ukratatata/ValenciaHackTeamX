import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import Header from './components/Header.jsx'
import PanelConsultas from './components/PanelConsultas.jsx'
import { Button, Overlay, ToastStack } from './components/ui.jsx'
import Acceso from './screens/Acceso.jsx'
import Inicio from './screens/Inicio.jsx'
import Ficha from './screens/Ficha.jsx'
import Consentimiento from './screens/Consentimiento.jsx'
import Checklist from './screens/Checklist.jsx'
import Borrador from './screens/Borrador.jsx'
import Resguardo from './screens/Resguardo.jsx'
import { enviarAviso } from './lib/aviso.js'
import { reiniciarMocks } from './lib/instituciones.js'

let idToast = 0

export default function App() {
  const [pantalla, setPantalla] = useState('acceso')
  const [tab, setTab] = useState('recomendados')
  const [tema, setTema] = useState(null)
  const [avisoNuevo, setAvisoNuevo] = useState(false)
  const [solicitud, setSolicitud] = useState(null)
  const [datos, setDatos] = useState({})
  const [panel, setPanel] = useState(false)
  const [noCubierto, setNoCubierto] = useState(null)
  const [toasts, setToasts] = useState([])
  const [checklistKey, setChecklistKey] = useState(0)
  const timers = useRef([])

  const cerrarToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (texto, ms = 5000) => {
      const id = ++idToast
      setToasts((t) => [...t, { id, texto }])
      timers.current.push(setTimeout(() => cerrarToast(id), ms))
    },
    [cerrarToast],
  )
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const ir = (p) => {
    setPantalla(p)
    window.scrollTo({ top: 0 })
  }

  function navegar(id) {
    if (id === 'inicio') setTab('recomendados')
    if (id === 'tramites') setTab(solicitud ? 'proceso' : 'recomendados')
    if (id === 'catalogo') {
      setTema(null)
      setTab('disponibles')
    }
    ir('inicio')
  }

  function verTema(id) {
    setTema(id)
    setTab('disponibles')
  }

  function entrar() {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tramite') === 'sip') {
      setAvisoNuevo(true)
      ir('ficha')
    } else {
      ir('inicio')
    }
  }

  const simularAviso = useCallback(async () => {
    const { via } = await enviarAviso()
    toast(
      via === 'n8n'
        ? '📩 Aviso enviado a Vlad por correo'
        : '📩 Aviso enviado a Vlad (simulado: configura n8n en .env)',
    )
    setAvisoNuevo(true)
  }, [toast])

  useEffect(() => {
    function onKey(e) {
      const t = e.target
      const escribiendo = t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))
      if (e.shiftKey && e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey && !e.altKey && !escribiendo) {
        e.preventDefault()
        simularAviso()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [simularAviso])

  function empezarVerificacion() {
    setChecklistKey((k) => k + 1)
    ir('checklist')
  }

  function confirmar() {
    const ahora = new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })
    setSolicitud({
      registro: 'GVA-SIP-2026-004817',
      sip: 'VLAD-KO-1234',
      centro: 'Centro de Salud Benimaclet',
      fecha: ahora,
      fase: 1,
    })
    ir('resguardo')
  }

  function reiniciar() {
    reiniciarMocks()
    setSolicitud(null)
    setDatos({})
    setAvisoNuevo(false)
    setTema(null)
    setTab('recomendados')
    ir('inicio')
    toast('Demo reiniciada')
  }

  const sesion = pantalla !== 'acceso'
  const navActivo =
    pantalla !== 'inicio' ? null : tab === 'proceso' ? 'tramites' : tab === 'disponibles' ? 'catalogo' : 'inicio'

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[70] focus:rounded focus:bg-white focus:p-2">
        Saltar al contenido
      </a>
      <Header sesion={sesion} activo={navActivo} onNav={navegar} onPanel={() => setPanel(true)} onInicio={() => sesion && navegar('inicio')} />

      <main id="contenido" className="flex-1">
        {pantalla === 'acceso' && <Acceso onEntrar={entrar} />}
        {pantalla === 'inicio' && (
          <Inicio
            tab={tab}
            setTab={setTab}
            tema={tema}
            setTema={setTema}
            onTema={verTema}
            avisoNuevo={avisoNuevo}
            solicitud={solicitud}
            onIniciarSip={() => ir('ficha')}
            onNoCubierto={setNoCubierto}
            onAvanzar={() => setSolicitud((s) => (s ? { ...s, fase: Math.min(3, s.fase + 1) } : s))}
            onVerResguardo={() => ir('resguardo')}
          />
        )}
        {pantalla === 'ficha' && <Ficha onVolver={() => ir('inicio')} onSiguiente={() => ir('consent')} />}
        {pantalla === 'consent' && <Consentimiento onVolver={() => ir('ficha')} onAutorizar={empezarVerificacion} />}
        {pantalla === 'checklist' && (
          <Checklist
            key={checklistKey}
            onVolver={() => ir('consent')}
            onRevisar={(r) => {
              setDatos(r)
              ir('borrador')
            }}
          />
        )}
        {pantalla === 'borrador' && <Borrador datos={datos} onVolver={() => ir('checklist')} onConfirmar={confirmar} />}
        {pantalla === 'resguardo' && solicitud && (
          <Resguardo
            solicitud={solicitud}
            onVer={() => {
              setTab('proceso')
              ir('inicio')
            }}
          />
        )}
      </main>

      <footer className="border-t border-surface-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-ink-soft">
          <p>GovPulse València · prototipo de hackatón con datos simulados. Sin vinculación oficial.</p>
          <div className="flex gap-1">
            <Button variant="ghost" onClick={simularAviso} data-testid="simular-aviso" className="!min-h-[44px]">
              ⚡ Simular aviso
            </Button>
            <Button variant="ghost" icon={RotateCcw} onClick={reiniciar} className="!min-h-[44px]">
              Reiniciar demo
            </Button>
          </div>
        </div>
      </footer>

      <PanelConsultas abierto={panel} onClose={() => setPanel(false)} />

      <Overlay abierto={!!noCubierto} onClose={() => setNoCubierto(null)} titulo={noCubierto || ''} idTitulo="modal-titulo">
        <p className="text-sm text-ink-soft">Esta demo no cubre ese trámite. Prueba con la tarjeta sanitaria (SIP) para ver el recorrido completo.</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={() => setNoCubierto(null)} data-autofocus>
            Entendido
          </Button>
        </div>
      </Overlay>

      <ToastStack toasts={toasts} onClose={cerrarToast} />
    </div>
  )
}
