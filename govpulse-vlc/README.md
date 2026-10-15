# GovPulse València (prototipo de hackatón)

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

## Aviso por correo (n8n)
El aviso proactivo ("Vlad, ya puedes pedir tu tarjeta sanitaria") lo envía un workflow de n8n.

- El workflow **"GovPulse · Aviso proactivo a Vlad"** ya está creado en n8n: https://prueba22203.app.n8n.cloud/workflow/2q1kDfjvuTXgplqQ
- Antes de la demo hay que: (1) **conectar la credencial de Gmail** en el nodo **"Enviar correo a Vlad"** y (2) **publicar/activar el workflow**. Sin activarlo, la URL de producción no responde.
- La **URL de producción** del webhook es la que viene en `.env`: `https://prueba22203.app.n8n.cloud/webhook/govpulse-aviso`.
- El webhook recibe un POST JSON con `nombre`, `email`, `tramite`, `motivo`, `enlace` (`<origen>/?tramite=sip`) e `instituciones`. Debe permitir CORS porque se llama desde el navegador.
- Si la URL está vacía, o el webhook no responde en 8 segundos, el aviso se **simula en local** (aparece el aviso "simulado") y la demo sigue sin romperse.

## Guion de la demo (3 min)
1. **Simular aviso** (pie de página o `Shift+A`): salta el aviso "📩 Aviso enviado a Vlad" y la tarjeta SIP muestra "Nuevo".
2. **Correo**: enseña el correo recibido y su enlace (`/?tramite=sip`), que abre directamente la ficha SIP tras el acceso.
3. **Entrar con Cl@ve** (simulación, no se conecta a Cl@ve real).
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
14. **Avanzar estado** (botón del presentador): pasa a "En revisión".
15. Panel **"Quién ha consultado tus datos"** (cabecera): cada consulta con finalidad, hora y CSV.

## Plan B (si algo falla)
- **Reiniciar demo** (botón del pie): vuelve al estado inicial y se puede repetir el recorrido (el Padrón vuelve a devolver "No consta").
- **Aviso sin internet o sin n8n**: el aviso cae solo a la simulación local; el toast lo indica y puedes seguir con la ficha SIP desde "Recomendados". También puedes dejar `VITE_N8N_WEBHOOK_URL` vacía para forzarlo.
- **Vídeo**: ten grabado el recorrido completo de la demo para proyectarlo si falla el ordenador o el proyector.

## Estructura
- `src/data/`: `perfil.json` y `tramites.json`.
- `src/lib/instituciones.js`: mocks de las 5 instituciones y registro de consultas. `src/lib/aviso.js`: aviso a n8n.
- `src/components/ui.jsx`: Button, Card, Chip, Tabs, ChecklistRow, Toast y Overlay (modal y slide-over). `Header.jsx`, `PanelConsultas.jsx`.
- `src/screens/`: una pantalla por paso. Sin router: la navegación es estado en `App.jsx`.
- Estilo centralizado en `tailwind.config.js` (colores, fuentes, radios y sombras), según `diseno-valencia.md`.
