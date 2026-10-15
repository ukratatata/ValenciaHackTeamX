import { useState } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  ExternalLink,
  IdCard,
  Laptop,
  Mail,
  PhoneOff,
  Mic,
  Video,
  ShieldCheck,
  Smartphone,
  User,
} from 'lucide-react'
import { Button, Card, Tabs } from '../components/ui.jsx'

const TABS = [
  { id: 'clave', label: 'Cl@ve' },
  { id: 'certificado', label: 'Certificado electrónico' },
]

export default function ComoAcceder({ onVolver }) {
  const [tab, setTab] = useState('clave')
  return (
    <>
      <section className="bg-gradient-to-b from-gold to-gold-soft text-ink">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-9">
          <Button variant="secondary" icon={ArrowLeft} onClick={onVolver} data-testid="volver-acceso">
            Volver al acceso
          </Button>
          <h1 className="anim-in mt-5 max-w-3xl font-display text-2xl font-bold leading-tight md:text-4xl">
            ¿Cómo consigo Cl@ve o un certificado electrónico?
          </h1>
          <p className="mt-3 max-w-3xl text-base md:text-lg">
            Con cualquiera de los dos accedes a Gov+ y a la sede de cualquier administración. Para Vlad basta su NIE (TIE en vigor).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:pb-14">
        <Tabs tabs={TABS} activa={tab} onChange={setTab} etiqueta="Método de acceso" />

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="anim-in mt-6 space-y-8 md:space-y-10" key={tab}>
          {tab === 'clave' ? <BloqueClave /> : <BloqueCertificado />}
        </div>

        <Comparativa />

        <p className="mt-6 text-center text-sm text-ink-soft">
          Información orientativa para la demo. Los requisitos pueden variar según tu documento: consúltalos en las webs oficiales.
        </p>

        <div className="mt-6 flex justify-center">
          <Button variant="primary" icon={ArrowLeft} onClick={onVolver} className="!min-h-[52px] text-base" data-testid="volver-acceso-final">
            Ya lo tengo: volver al acceso
          </Button>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- Bloques */

function BloqueClave() {
  return (
    <>
      <Seccion titulo="Qué es">
        <Card className="border-l-8 !border-l-gold">
          <p className="text-base">
            Sistema de identificación de las administraciones. Entras con tu móvil (app Cl@ve) o con un PIN, sin instalar nada en el ordenador.
          </p>
        </Card>
      </Seccion>

      <Seccion titulo="Qué necesitas">
        <div className="grid gap-3 sm:grid-cols-3">
          <Ficha icono={IdCard} titulo="DNI o NIE" texto="Con la TIE en vigor" />
          <Ficha icono={Smartphone} titulo="Teléfono móvil" texto="Para la app y el PIN" />
          <Ficha icono={Mail} titulo="Correo electrónico" texto="Para recibir avisos" />
        </div>
      </Seccion>

      <Seccion titulo="Cómo se consigue" nota="Tres vías: elige la que te resulte más cómoda.">
        <div className="grid gap-5 lg:grid-cols-3">
          <Via etiqueta="Vía 1" titulo="Por videollamada" texto="Desde la app Cl@ve o clave.gob.es, con tu documento y el móvil.">
            <EscenaVideollamada />
          </Via>
          <Via etiqueta="Vía 2" titulo="Por internet con carta de invitación" texto="Pides el registro en clave.gob.es y recibes en casa una carta con un código para terminarlo.">
            <EscenaCarta />
          </Via>
          <Via etiqueta="Vía 3" titulo="En persona" texto="En una oficina de registro Cl@ve (por ejemplo, Agencia Tributaria o Seguridad Social), con cita previa y tu documento.">
            <EscenaMostrador />
          </Via>
        </div>
      </Seccion>

      <Seccion titulo="Y después">
        <Card className="grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-10">
          <div>
            <p className="font-display text-lg font-bold leading-snug">Descargas la app Cl@ve y activas Cl@ve Móvil.</p>
            <p className="mt-2 text-sm text-ink-soft">
              A partir de entonces, cuando una web te pida identificarte, te llega un aviso al móvil y solo tienes que aprobarlo.
            </p>
            <EnlaceExterno href="https://clave.gob.es" className="mt-4">
              clave.gob.es
            </EnlaceExterno>
          </div>
          <Escena className="h-[19rem] w-full md:w-80">
            <MovilAprobar />
          </Escena>
        </Card>
      </Seccion>
    </>
  )
}

function BloqueCertificado() {
  return (
    <>
      <Seccion titulo="Qué es" nota="Certificado de la FNMT para persona física.">
        <Card className="border-l-8 !border-l-gold">
          <p className="text-base">Un archivo que se instala en tu ordenador o navegador y te identifica con plena validez legal.</p>
        </Card>
      </Seccion>

      <Seccion titulo="Qué necesitas">
        <div className="grid gap-3 sm:grid-cols-3">
          <Ficha icono={IdCard} titulo="DNI o NIE" texto="Con la TIE en vigor" />
          <Ficha icono={Laptop} titulo="Un ordenador con navegador" texto="Donde quedará instalado" />
          <Ficha icono={Mail} titulo="Correo electrónico" texto="Para recibir el código" />
        </div>
      </Seccion>

      <Seccion titulo="Cómo se consigue" nota="Tres pasos, en este orden.">
        <ol className="grid gap-12 lg:grid-cols-3 lg:gap-14">
          <Paso n={1} titulo="Solicitud por internet" texto="En la sede de la FNMT (sede.fnmt.gob.es) rellenas tus datos y recibes un código de solicitud por correo.">
            <EscenaSolicitud />
          </Paso>
          <Paso n={2} titulo="Acredita tu identidad" texto="En una oficina de acreditación, con cita previa, tu documento y el código. Si tu documento lo permite, también por videoidentificación con la app de la FNMT.">
            <EscenaOficina />
          </Paso>
          <Paso n={3} titulo="Descarga tu certificado" texto="Desde el mismo ordenador y navegador en que lo pediste. Haz una copia de seguridad." ultimo>
            <EscenaDescarga />
          </Paso>
        </ol>
      </Seccion>

      <div>
        <p className="flex items-start gap-2 text-sm text-ink-soft">
          <CreditCard aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          Si tienes DNI electrónico, también puedes usarlo como certificado con un lector o con NFC.
        </p>
        <EnlaceExterno href="https://www.sede.fnmt.gob.es" className="mt-4">
          sede.fnmt.gob.es
        </EnlaceExterno>
      </div>
    </>
  )
}

function Comparativa() {
  return (
    <section aria-labelledby="comparativa-titulo" className="mt-10 md:mt-12">
      <h2 id="comparativa-titulo" className="font-display text-xl font-bold md:text-2xl">
        Comparativa rápida
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold">
              <Smartphone aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold">Cl@ve</h3>
          </div>
          <dl className="mt-4 divide-y divide-surface-line">
            <Fila t="Dónde funciona" v="Cualquier dispositivo, con tu móvil" />
            <Fila t="Qué instalas" v="La app en el móvil" />
            <Fila t="Para qué sirve" v="Todas las administraciones" />
          </dl>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold">
              <IdCard aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold">Certificado electrónico</h3>
          </div>
          <dl className="mt-4 divide-y divide-surface-line">
            <Fila t="Dónde funciona" v="El ordenador o navegador donde está instalado" />
            <Fila t="Qué instalas" v="El certificado en el ordenador" />
            <Fila t="Para qué sirve" v="Todas las administraciones" />
          </dl>
        </Card>
      </div>
    </section>
  )
}

/* -------------------------------------------------------- Piezas de página */

function Seccion({ titulo, nota, children }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold md:text-2xl">{titulo}</h2>
      {nota && <p className="mt-0.5 text-sm text-ink-soft">{nota}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Ficha({ icono: Icono, titulo, texto }) {
  return (
    <Card className="flex items-center gap-3.5 !p-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
        <Icono aria-hidden="true" className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-base font-bold leading-snug">{titulo}</p>
        <p className="text-sm leading-snug text-ink-soft">{texto}</p>
      </div>
    </Card>
  )
}

function Via({ etiqueta, titulo, texto, children }) {
  return (
    <Card className="flex flex-col !p-4">
      <Escena>{children}</Escena>
      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-ink-soft">{etiqueta}</p>
      <h3 className="mt-0.5 font-display text-lg font-bold leading-snug">{titulo}</h3>
      <p className="mt-1.5 text-sm text-ink-soft">{texto}</p>
    </Card>
  )
}

function Paso({ n, titulo, texto, ultimo = false, children }) {
  return (
    <li className="relative">
      <Card className="flex h-full flex-col !p-4">
        <Escena>{children}</Escena>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink bg-gold font-display text-base font-bold">
            {n}
          </span>
          <h3 className="font-display text-lg font-bold leading-snug">{titulo}</h3>
        </div>
        <p className="mt-2 text-sm text-ink-soft">{texto}</p>
      </Card>
      {!ultimo && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full z-10 mt-2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-ink bg-white lg:left-full lg:top-1/2 lg:ml-3 lg:mt-0 lg:-translate-y-1/2 lg:translate-x-0"
        >
          <ChevronDown className="h-4 w-4 lg:hidden" />
          <ChevronRight className="hidden h-4 w-4 lg:block" />
        </span>
      )}
    </li>
  )
}

function Fila({ t, v }) {
  return (
    <div className="py-2.5">
      <dt className="text-xs font-bold uppercase tracking-wide text-ink-soft">{t}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  )
}

function EnlaceExterno({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[44px] items-center gap-2 font-semibold underline decoration-2 underline-offset-4 hover:bg-primary-50 ${className}`}
    >
      {children}
      <ExternalLink aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">(se abre en una pestaña nueva)</span>
    </a>
  )
}

/* ------------------------------------------------------ Mini ilustraciones */
// Todo con HTML/CSS e iconos lucide; decorativo (aria-hidden). Texto en mockups >= 12 px.

function Escena({ className = 'h-48', children }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex select-none items-center justify-center overflow-hidden rounded-control border border-surface-line bg-gold-soft ${className}`}
    >
      {children}
    </div>
  )
}

// Documento de identidad en miniatura
function DocumentoId({ className = '', style }) {
  return (
    <div className={`w-[7.25rem] rounded-md border-2 border-ink bg-white p-1.5 shadow-card ${className}`} style={style}>
      <p className="text-[10px] font-bold uppercase leading-none tracking-wide">DNI · NIE</p>
      <div className="mt-1.5 flex gap-1.5">
        <span className="flex h-9 w-8 shrink-0 items-center justify-center rounded-sm bg-gold">
          <User className="h-5 w-5" />
        </span>
        <span className="flex flex-1 flex-col justify-center gap-1.5">
          <span className="h-1.5 rounded-full bg-ink" />
          <span className="h-1.5 w-4/5 rounded-full bg-primary-200" />
          <span className="h-1.5 w-3/5 rounded-full bg-primary-200" />
        </span>
      </div>
    </div>
  )
}

function Movil({ className = '', children }) {
  return (
    <div className={`relative overflow-hidden rounded-[1.25rem] border-[3px] border-ink bg-white shadow-card ${className}`}>
      <span className="absolute left-1/2 top-1 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-ink" />
      {children}
    </div>
  )
}

function EscenaVideollamada() {
  return (
    <>
      <Movil className="h-[10.5rem] w-[5.9rem] -translate-x-9">
        <div className="absolute inset-x-1.5 bottom-12 top-4 overflow-hidden rounded-lg bg-primary-200">
          <span className="absolute left-1/2 top-3 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white">
            <User className="h-7 w-7" />
          </span>
          <span className="absolute inset-x-0 bottom-0 h-6 rounded-t-[2rem] bg-white" />
          <span className="absolute right-1 top-1 flex h-7 w-5 items-center justify-center rounded bg-ink">
            <User className="h-3.5 w-3.5 text-gold" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted ring-1 ring-ink">
            <Mic className="h-3.5 w-3.5" />
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted ring-1 ring-ink">
            <Video className="h-3.5 w-3.5" />
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-600 text-white">
            <PhoneOff className="h-3.5 w-3.5" />
          </span>
        </div>
      </Movil>
      <DocumentoId className="absolute right-4 top-[4.25rem] sm:right-8" style={{ transform: 'rotate(7deg)' }} />
      <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">
        <Video className="h-3.5 w-3.5" />
        En directo
      </span>
    </>
  )
}

function EscenaCarta() {
  return (
    <div className="relative h-40 w-52">
      {/* carta que asoma del sobre */}
      <div className="absolute left-1/2 top-0 z-0 w-40 -translate-x-1/2 rotate-[-3deg] rounded-md border-2 border-ink bg-white px-3 pb-6 pt-2 text-center shadow-card">
        <p className="whitespace-nowrap text-xs font-semibold text-ink-soft">Tu código</p>
        <p className="mt-1 rounded border-2 border-dashed border-ink bg-gold-soft py-1 font-display text-base font-bold tracking-widest">A7K-92X</p>
      </div>
      {/* sobre */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[4.75rem] overflow-hidden rounded-md border-2 border-ink bg-gold">
        <span className="absolute bottom-0 left-0 h-0 w-[7.5rem] origin-bottom-left border-t-2 border-ink" style={{ transform: 'rotate(-35deg)' }} />
        <span className="absolute bottom-0 right-0 h-0 w-[7.5rem] origin-bottom-right border-t-2 border-ink" style={{ transform: 'rotate(35deg)' }} />
        <span className="absolute bottom-1.5 left-2 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold ring-1 ring-ink">
          <Mail className="h-3.5 w-3.5" />
          En tu casa
        </span>
      </div>
    </div>
  )
}

function EscenaMostrador() {
  return (
    <>
      {/* cartel de la oficina */}
      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-ink px-2 py-1 text-xs font-semibold text-white">
        <Building2 className="h-3.5 w-3.5" />
        Oficina de registro
      </span>
      {/* calendario con la cita */}
      <div className="absolute bottom-[3.3rem] left-4 w-[5.5rem] overflow-hidden rounded-md border-2 border-ink bg-white shadow-card">
        <p className="bg-ink py-0.5 text-center text-xs font-bold uppercase leading-5 text-white">Cita</p>
        <p className="pt-1 text-center font-display text-2xl font-bold leading-none">22</p>
        <p className="pb-1 pt-0.5 text-center text-xs font-semibold text-ink-soft">10:30 h</p>
      </div>
      {/* persona tras el mostrador */}
      <span className="absolute bottom-[3.2rem] right-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-white">
        <User className="h-8 w-8" />
      </span>
      <DocumentoId className="absolute bottom-[3.1rem] right-[4.6rem] !w-[5.4rem] !p-1 sm:right-[4.8rem]" style={{ transform: 'rotate(-6deg)' }} />
      {/* mostrador */}
      <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center border-t-2 border-ink bg-gold-dark">
        <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold ring-1 ring-ink">
          <CalendarCheck className="h-3.5 w-3.5" />
          Cita previa confirmada
        </span>
      </div>
    </>
  )
}

function MovilAprobar() {
  return (
    <Movil className="h-[16.5rem] w-44">
      <div className="mt-0 flex items-center gap-1.5 bg-gold px-2.5 pb-1.5 pt-4">
        <ShieldCheck className="h-4 w-4" />
        <span className="font-display text-sm font-bold">Cl@ve</span>
      </div>
      <div className="px-3 pt-3 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gold-soft ring-1 ring-ink">
          <Smartphone className="h-6 w-6" />
        </span>
        <p className="mt-2 font-display text-sm font-bold leading-tight">Aprobar acceso a Gov+</p>
        <p className="mt-1 text-xs text-ink-soft">govmas.valencia</p>
        <span className="mt-3 flex h-9 items-center justify-center rounded-control border border-ink bg-gold text-sm font-semibold">Aprobar</span>
        <span className="mt-2 flex h-9 items-center justify-center rounded-control border border-ink bg-white text-sm font-semibold">Rechazar</span>
      </div>
    </Movil>
  )
}

function Ventana({ url, className = '', children }) {
  return (
    <div className={`overflow-hidden rounded-md border-2 border-ink bg-white shadow-card ${className}`}>
      <div className="flex items-center gap-1.5 border-b-2 border-ink bg-surface-muted px-2 py-1.5">
        <span className="h-2 w-2 rounded-full bg-ink" />
        <span className="h-2 w-2 rounded-full bg-primary-200" />
        <span className="h-2 w-2 rounded-full bg-primary-200" />
        <span className="ml-1 min-w-0 flex-1 truncate rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-primary-200">{url}</span>
      </div>
      {children}
    </div>
  )
}

function EscenaSolicitud() {
  return (
    <>
      <Ventana url="sede.fnmt.gob.es" className="absolute left-3 top-3 w-[14rem]">
        <div className="space-y-1.5 p-2.5">
          <span className="block h-6 rounded border border-ink bg-white px-1.5 text-xs leading-[22px] text-ink-soft">Nombre y NIE</span>
          <span className="block h-6 rounded border border-ink bg-white px-1.5 text-xs leading-[22px] text-ink-soft">vlad@correo.es</span>
        </div>
      </Ventana>
      <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md border-2 border-ink bg-white px-2.5 py-1.5 shadow-panel">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold">
          <Mail className="h-4 w-4" />
        </span>
        <span className="leading-tight">
          <span className="block text-xs text-ink-soft">Correo recibido</span>
          <span className="block text-xs font-bold">Código: 0123-4567</span>
        </span>
      </div>
    </>
  )
}

function EscenaOficina() {
  return (
    <>
      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-ink px-2 py-1 text-xs font-semibold text-white">
        <Building2 className="h-3.5 w-3.5" />
        Oficina de acreditación
      </span>
      <span className="absolute bottom-[3.2rem] left-7 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-white">
        <User className="h-8 w-8" />
      </span>
      <DocumentoId className="absolute bottom-[3.1rem] left-[6.2rem] !w-[5.4rem] !p-1" style={{ transform: 'rotate(-5deg)' }} />
      <div className="absolute bottom-[3.1rem] right-4 rounded-md border-2 border-ink bg-white px-2 py-1.5 text-center shadow-card" style={{ transform: 'rotate(4deg)' }}>
        <p className="text-[11px] leading-none text-ink-soft">Código</p>
        <p className="mt-1 text-xs font-bold leading-none">0123-4567</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center border-t-2 border-ink bg-gold-dark">
        <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold ring-1 ring-ink">
          <BadgeCheck className="h-3.5 w-3.5" />
          Identidad acreditada
        </span>
      </div>
    </>
  )
}

function EscenaDescarga() {
  return (
    <>
      <Ventana url="Tu navegador" className="absolute left-4 right-4 top-3">
        <div className="p-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold ring-1 ring-ink">
              <BadgeCheck className="h-6 w-6" />
            </span>
            <p className="text-sm font-bold leading-tight">Certificado instalado ✓</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-ink bg-white">
              <span className="block h-full w-full bg-gold-dark" />
            </div>
            <span className="text-xs font-semibold">100 %</span>
          </div>
        </div>
      </Ventana>
      <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-ink">
        <Download className="h-3.5 w-3.5" />
        Copia de seguridad guardada
      </span>
    </>
  )
}
