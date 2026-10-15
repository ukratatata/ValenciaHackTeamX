# Gov+ València (prototipo de hackatón)

Portal proactivo de trámites para el Ayuntamiento de València. **No es un chatbot**: es una SPA donde el ciudadano hace
**una petición** y el portal consulta por él a **5 instituciones**. Todos los datos son **simulados** y no se usa el
escudo ni ningún logotipo oficial.

Historia de la demo: Vlad, 19 años, de Ucrania, con protección temporal (TIE), vive en Benimaclet y trabaja con contrato.
Necesita la tarjeta sanitaria SIP.

## Cómo arrancar la demo (sin saber programar)
1. **Instala Node.js 18 o superior** desde https://nodejs.org (botón "LTS") y acepta las opciones por defecto.
2. **Descomprime** `govpulse-vlc.zip` en una carpeta, por ejemplo en el Escritorio.
3. Abre una **terminal dentro de esa carpeta** (en Windows: abre la carpeta, escribe `cmd` en la barra de direcciones y pulsa Intro; en Mac: clic derecho en la carpeta, "Nuevo terminal en la carpeta").
4. Escribe `npm install` y espera a que termine (solo hace falta la primera vez).
5. **Crea tu archivo de configuración**: copia `.env.example` y llama a la copia `.env` (Mac/Linux: `cp .env.example .env`; Windows: `copy .env.example .env`). Ábrelo con el Bloc de notas y cambia `VITE_DEMO_EMAIL` por **tu correo**, que es donde llegará el aviso. La línea `VITE_N8N_WEBHOOK_URL` ya viene rellena.
6. Escribe `npm run dev`.
7. Abre http://localhost:5173 en el navegador. Si cambias `.env`, para el programa con Ctrl+C y vuelve a ejecutar `npm run dev`.

Para comprobar que todo compila: `npm run build`.

## Correos por n8n
La web envía tres correos a través de **un único webhook** de n8n; el campo `tipo` del JSON decide la plantilla (contrato en `contrato-correos.md`):
- `aviso_sip`: aviso proactivo "Vlad, ya puedes pedir tu tarjeta sanitaria" (**Simular aviso** / `Shift+A`).
- `acceso`: "Vlad, ya hay una ayuda disponible para ti" (beca de idiomas + recomendaciones). Sale **cada vez** que se entra (con Cl@ve o con certificado electrónico), también al volver a entrar tras "Reiniciar demo".
- `tarjeta_aceptada`: "Tarjeta sanitaria aceptada, Vlad". Sale una sola vez por recorrido, cuando "En proceso" llega a "Tarjeta aceptada".

Los datos de los correos de ayudas y tarjeta están en `src/data/ayudas.json` y `src/data/tarjeta.json`.

### Detalle del aviso proactivo
El aviso proactivo ("Vlad, ya puedes pedir tu tarjeta sanitaria") lo envía un workflow de n8n.

- El workflow **"GovPulse · Aviso proactivo a Vlad"** ya está creado en n8n: https://prueba22203.app.n8n.cloud/workflow/2q1kDfjvuTXgplqQ
- Antes de la demo hay que: (1) **conectar la credencial de Gmail** en el nodo **"Enviar correo a Vlad"** y (2) **publicar/activar el workflow**. Sin activarlo, la URL de producción no responde.
- La **URL de producción** del webhook es la que viene en `.env`: `https://prueba22203.app.n8n.cloud/webhook/govpulse-aviso`.
- El webhook recibe un POST JSON con `tipo`, `nombre`, `email`, `enlace` y los campos propios de cada tipo (para `aviso_sip`: `tramite`, `motivo`, `instituciones`; enlace `<origen>/?tramite=sip`). Debe permitir CORS porque se llama desde el navegador.
- Si la URL está vacía, o el webhook no responde en 8 segundos, el correo se **simula en local** (el toast dice "Correo simulado localmente") y la demo sigue sin romperse.

## Guion de la demo (3 min)
1. **Simular aviso** (pie de página o `Shift+A`): salta el aviso "📩 Aviso enviado a Vlad" y la tarjeta SIP muestra "Nuevo".
2. **Correo**: enseña el correo recibido y su enlace (`/?tramite=sip`), que abre directamente la ficha SIP tras el acceso.
3. **Acceder**: la tarjeta ofrece dos métodos (ambos simulados; no se conecta a Cl@ve ni se lee ningún certificado).
   - **Cl@ve**: muestra "Conectando con Cl@ve (simulado)…" durante ~1,2 s y entra.
   - **Certificado electrónico**: abre un diálogo "Selecciona un certificado" (KOVALENKO VLAD - Y1234567X, FNMT-RCM); "Aceptar" entra.
   - En ambos casos sale el toast "📩 Te hemos enviado tus becas y ayudas" y llega el **correo de becas y ayudas**; en Inicio aparece el aviso "Ya hay una beca disponible: Beca de idiomas para jóvenes" (botón "Ver ayuda").
   - **Si el jurado pregunta "¿y si no tiene Cl@ve?"**: pulsa **"¿No sabes cómo acceder?" > "Te explicamos cómo conseguir Cl@ve o tu certificado"**. Es una guía visual con dos pestañas (Cl@ve y Certificado electrónico): qué es, qué necesitas, cómo se consigue (videollamada, carta de invitación o en persona; solicitud, acreditación y descarga del certificado) y una comparativa. Para Vlad basta su NIE (TIE en vigor). "Volver al acceso" te devuelve a la pantalla de entrada.
4. **Iniciar trámite** en la tarjeta sanitaria (SIP): la ficha muestra las 5 instituciones.
5. **Pedir los documentos por mí**.
6. **Autorizar** (las 5 casillas vienen marcadas; art. 28.2 Ley 39/2015): "Autorizar y consultar".
7. **Ver las 5 instituciones** consultándose a la vez: diagrama a la izquierda, filas a la derecha.
8. **Padrón: no consta**: aparece el Diagnóstico Express ("Falta 1 documento que ninguna administración tiene").
9. **Usar documento de ejemplo**: el alta se tramita y se lanzan solos el INSS y Sanidad.
10. **Revisar borrador** (cuando hay 5 de 5 verificados) y comprueba que todo viene precargado con su fuente.
11. **Confirmar y enviar**.
12. **Resguardo**: registro GVA-SIP-2026-004817 y la cifra "1 petición · 5 instituciones · 0 formularios".
13. **En proceso**: estado "Presentada".
14. **Avanzar estado** (botón del presentador): pasa a "En revisión". Si no se pulsa de nuevo, a los 2 s pasa solo a "Tarjeta aceptada".
15. **Tarjeta aceptada**: sello verde, la tarjeta sanitaria dibujada, "Qué puedes hacer ya" y el toast "📩 Te hemos enviado tu tarjeta por correo". Llega el **correo de tarjeta aceptada** (se envía una sola vez).
16. Panel **"Quién ha consultado tus datos"** (cabecera): cada consulta con finalidad, hora y CSV.

## Plan B (si algo falla)
- **Reiniciar demo** (botón del pie): vuelve a la pantalla de acceso con el estado inicial y se puede repetir el recorrido (el Padrón vuelve a devolver "No consta"; al entrar de nuevo se reenvía el correo de ayudas).
- **Aviso sin internet o sin n8n**: el aviso cae solo a la simulación local; el toast lo indica y puedes seguir con la ficha SIP desde "Recomendados". También puedes dejar `VITE_N8N_WEBHOOK_URL` vacía para forzarlo.
- **Vídeo**: ten grabado el recorrido completo de la demo para proyectarlo si falla el ordenador o el proyector.

## Estructura
- `src/data/`: `perfil.json`, `tramites.json`, `ayudas.json` (correo de acceso) y `tarjeta.json` (datos de la tarjeta aceptada).
- `src/lib/instituciones.js`: mocks de las 5 instituciones y registro de consultas. `src/lib/aviso.js`: correos a n8n (`enviarCorreo`, `enviarAviso`, `enviarAcceso`, `enviarTarjetaAceptada`).
- `src/components/ui.jsx`: Button, Card, Chip, Tabs, ChecklistRow, Toast y Overlay (modal y slide-over). `Header.jsx`, `PanelConsultas.jsx`, `TarjetaSanitaria.jsx`.
- `src/screens/`: una pantalla por paso (`Acceso.jsx` con Cl@ve y certificado simulados; `ComoAcceder.jsx`, guía visual previa al acceso). Sin router: la navegación es estado en `App.jsx`.
- Estilo centralizado en `tailwind.config.js` (colores, fuentes, radios y sombras), según `diseno-valencia.md` (v2: Montserrat + amarillo #FFCC29, alineado con valencia.es). La tipografía va empaquetada con `@fontsource/montserrat`, sin depender de internet.
