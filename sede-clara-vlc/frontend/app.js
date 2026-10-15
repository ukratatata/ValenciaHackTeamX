// =============================================
// GovPulse València — Frontend Logic
// =============================================

// --- Catálogo de trámites (estático para la demo) ---
const CATALOG = [
    { id: "TARJETA_SIP", icon: "🏥", title: "Alta Tarjeta Sanitaria (SIP)", desc: "Acceso al sistema público de salud" },
    { id: "PADRON_ALTA", icon: "🏛️", title: "Empadronamiento", desc: "Alta o cambio de domicilio en València" },
    { id: "AYUDAS_EMERGENCIA", icon: "💶", title: "Ayudas de Emergencia", desc: "Prestación para alquiler, suministros y necesidades básicas" },
    { id: "AYUDAS_DANA", icon: "🌊", title: "Ayudas DANA", desc: "Ayudas por daños de la DANA" },
    { id: "CERTIFICADO_DIGITAL", icon: "🔐", title: "Certificado Digital", desc: "Certificado FNMT para trámites online" },
    { id: "BONO_SOCIAL", icon: "💡", title: "Bono Social Eléctrico", desc: "Descuento en factura para vulnerables" },
];

// Consultas del trámite SIP para la demo
const SIP_CONSULTAS = [
    { organismo: "Policía Nacional / DGP", dato: "Verificación de identidad (NIE)", icono: "🛡️", result: "ok" },
    { organismo: "Seguridad Social (TGSS)", dato: "Contrato laboral vigente", icono: "📋", result: "ok" },
    { organismo: "Ayuntamiento de València", dato: "Certificado de empadronamiento", icono: "🏛️", result: "no_consta" },
    { organismo: "INSS", dato: "Derecho a prestación sanitaria", icono: "🏥", result: "pending" },
    { organismo: "Conselleria de Sanitat", dato: "Asignación de centro de salud", icono: "💊", result: "pending" },
];

// --- Tabs ---
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
        // Hide demo overlay when switching tabs
        document.getElementById("demoOverlay").classList.add("hidden");
    });
});

// --- Render catálogo ---
function renderCatalog() {
    const grid = document.getElementById("catalogGrid");
    grid.innerHTML = CATALOG.map(p => `
        <div class="proc-card bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
            <p class="text-2xl">${p.icon}</p>
            <h4 class="font-bold text-sm text-stone-800">${p.title}</h4>
            <p class="text-xs text-stone-500">${p.desc}</p>
            <button onclick="startDemoFlow('${p.id}')"
                class="mt-2 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-600 transition w-full">
                Iniciar trámite
            </button>
        </div>
    `).join("");
}
renderCatalog();

// =============================================
// DEMO FLOW (flujo del pitch)
// =============================================

function startDemoFlow(procId) {
    // Solo el flujo completo para TARJETA_SIP
    if (procId !== "TARJETA_SIP") {
        alert("Demo: este trámite se muestra solo como catálogo. En el pitch usamos la Tarjeta SIP.");
        return;
    }

    // Ocultar tabs y mostrar overlay
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    const overlay = document.getElementById("demoOverlay");
    overlay.classList.remove("hidden");

    // Reset todos los pasos
    ["demoConsent","demoQueries","demoUpload","demoChain","demoConfirm","demoSuccess"]
        .forEach(id => document.getElementById(id).classList.add("hidden"));

    // Mostrar paso 1: consentimiento
    showConsent();
}

function showConsent() {
    const panel = document.getElementById("demoConsent");
    panel.classList.remove("hidden");

    const list = document.getElementById("consentList");
    list.innerHTML = SIP_CONSULTAS.map(c => `
        <div class="flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
            <span class="text-xl">${c.icono}</span>
            <div class="flex-1">
                <p class="text-sm font-semibold text-stone-800">${c.organismo}</p>
                <p class="text-xs text-stone-500">${c.dato}</p>
            </div>
        </div>
    `).join("");

    panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function acceptConsent() {
    document.getElementById("demoConsent").classList.add("hidden");
    const panel = document.getElementById("demoQueries");
    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "center" });

    const rows = document.getElementById("queryRows");
    rows.innerHTML = SIP_CONSULTAS.map((c, i) => `
        <div class="consulta-row flex items-center gap-3 p-3 rounded-lg border border-stone-200 bg-stone-50" id="qrow-${i}">
            <span class="text-xl">${c.icono}</span>
            <div class="flex-1">
                <p class="text-sm font-semibold text-stone-800">${c.organismo}</p>
                <p class="text-xs text-stone-500">${c.dato}</p>
            </div>
            <span class="status-icon text-stone-300" id="qstatus-${i}">⏳</span>
        </div>
    `).join("");

    // Animar cada fila secuencialmente
    for (let i = 0; i < SIP_CONSULTAS.length; i++) {
        await delay(800);
        const row = document.getElementById("qrow-" + i);
        const status = document.getElementById("qstatus-" + i);
        row.classList.add("visible");

        const c = SIP_CONSULTAS[i];
        if (c.result === "ok") {
            status.textContent = "✅";
            row.style.borderColor = "#86efac";
            row.style.background = "#f0fdf4";
        } else if (c.result === "no_consta") {
            status.textContent = "❌";
            row.style.borderColor = "#fca5a5";
            row.style.background = "#fef2f2";
        } else {
            // pending — se resuelve después
            status.textContent = "⏸️";
            row.style.borderColor = "#fde68a";
            row.style.background = "#fffbeb";
        }
    }

    // Esperar y mostrar paso de upload
    await delay(1000);
    document.getElementById("demoUpload").classList.remove("hidden");
    document.getElementById("demoUpload").scrollIntoView({ behavior: "smooth", block: "center" });
}

async function simulateUpload() {
    const zone = document.getElementById("uploadZone");
    zone.innerHTML = `
        <div class="flex items-center gap-3 justify-center">
            <div class="spinner" style="width:24px;height:24px;border-width:3px;"></div>
            <span class="text-sm font-semibold text-amber-700">Subiendo contrato_alquiler.pdf...</span>
        </div>
    `;
    zone.style.borderColor = "#f59e0b";
    zone.style.background = "#fffbeb";

    await delay(1500);

    zone.innerHTML = `
        <div class="flex items-center gap-3 justify-center">
            <span class="text-2xl">✅</span>
            <span class="text-sm font-bold text-emerald-700">contrato_alquiler.pdf — Subido correctamente</span>
        </div>
    `;
    zone.style.borderColor = "#86efac";
    zone.style.background = "#f0fdf4";
    zone.style.cursor = "default";

    // Mostrar cadena de resolución
    await delay(800);
    document.getElementById("demoUpload").classList.add("hidden");
    showChainResolution();
}

async function showChainResolution() {
    const panel = document.getElementById("demoChain");
    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "center" });

    const chainSteps = [
        { label: "Empadronamiento", detail: "Contrato verificado → inscripción en Padrón Municipal", icon: "🏛️" },
        { label: "Derecho INSS", detail: "Padrón + contrato → derecho a prestación sanitaria confirmado", icon: "🏥" },
        { label: "Tarjeta SIP", detail: "INSS + empadronamiento → centro de salud asignado", icon: "💊" },
    ];

    const rows = document.getElementById("chainRows");
    rows.innerHTML = chainSteps.map((s, i) => `
        <div class="consulta-row flex items-center gap-3 p-3 rounded-lg border border-stone-200 bg-stone-50" id="chain-${i}">
            <span class="text-xl">${s.icon}</span>
            <div class="flex-1">
                <p class="text-sm font-semibold text-stone-800">${s.label}</p>
                <p class="text-xs text-stone-500">${s.detail}</p>
            </div>
            <span class="status-icon text-stone-300" id="chainstatus-${i}">⏳</span>
        </div>
    `).join("");

    for (let i = 0; i < chainSteps.length; i++) {
        await delay(1000);
        const row = document.getElementById("chain-" + i);
        const status = document.getElementById("chainstatus-" + i);
        row.classList.add("visible");
        status.textContent = "✅";
        row.style.borderColor = "#86efac";
        row.style.background = "#f0fdf4";
    }

    await delay(800);
    document.getElementById("demoConfirm").classList.remove("hidden");
    document.getElementById("demoConfirm").scrollIntoView({ behavior: "smooth", block: "center" });
}

async function confirmDemo() {
    document.getElementById("demoConfirm").classList.add("hidden");
    document.getElementById("demoChain").classList.add("hidden");

    // Llamar al backend para generar tracking code
    try {
        const res = await fetch("/api/process-procedure", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ procedure_id: "TARJETA_SIP", user_id: "USER_VLAD_019" }),
        });
        const data = await res.json();
        document.getElementById("trackingCode").textContent = data.tracking_code;
    } catch {
        document.getElementById("trackingCode").textContent = "GP-VLC-" + Date.now();
    }

    const success = document.getElementById("demoSuccess");
    success.classList.remove("hidden");
    success.scrollIntoView({ behavior: "smooth", block: "center" });

    // Añadir al panel "En proceso"
    addToEnProceso();
}

function cancelDemo() {
    document.getElementById("demoOverlay").classList.add("hidden");
    // Reactivar la pestaña de notificaciones
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-tab="notificaciones"]').classList.add("active");
    document.getElementById("tab-notificaciones").classList.add("active");
}

// --- En proceso ---
function addToEnProceso() {
    document.getElementById("enProcesoEmpty").classList.add("hidden");
    const list = document.getElementById("enProcesoList");
    list.classList.remove("hidden");
    const now = new Date().toLocaleString("es-ES");
    list.innerHTML = `
        <div class="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
            <h2 class="text-lg font-bold text-stone-800">Mis trámites en curso</h2>
            <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-sm text-stone-800">🏥 Alta Tarjeta Sanitaria (SIP)</p>
                        <p class="text-xs text-stone-500">Iniciado: ${now}</p>
                    </div>
                    <span class="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">ENVIADA</span>
                </div>
                <div class="flex gap-1 mt-2">
                    <div class="h-2 flex-1 bg-emerald-500 rounded-l"></div>
                    <div class="h-2 flex-1 bg-emerald-500"></div>
                    <div class="h-2 flex-1 bg-emerald-500"></div>
                    <div class="h-2 flex-1 bg-emerald-300"></div>
                    <div class="h-2 flex-1 bg-stone-200 rounded-r"></div>
                </div>
                <p class="text-xs text-stone-500">Paso 4/5 — Pendiente de resolución por Conselleria de Sanitat</p>
            </div>
            <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 opacity-50">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-sm text-stone-800">🏛️ Empadronamiento</p>
                        <p class="text-xs text-stone-500">Resuelto automáticamente</p>
                    </div>
                    <span class="bg-stone-200 text-stone-600 text-xs font-bold px-2 py-1 rounded">COMPLETADO</span>
                </div>
            </div>
            <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 opacity-50">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-sm text-stone-800">📋 Derecho INSS</p>
                        <p class="text-xs text-stone-500">Resuelto automáticamente</p>
                    </div>
                    <span class="bg-stone-200 text-stone-600 text-xs font-bold px-2 py-1 rounded">COMPLETADO</span>
                </div>
            </div>
        </div>
    `;
}

// =============================================
// BÚSQUEDA NATURAL (tab Ayuda)
// =============================================

async function runNaturalSearch() {
    const text = document.getElementById("userQuery").value.trim();
    if (!text) return;

    document.getElementById("loadingPanel").classList.remove("hidden");
    document.getElementById("resultsContainer").innerHTML = "";

    const res = await fetch("/api/natural-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_situation: text }),
    });
    const data = await res.json();

    document.getElementById("loadingPanel").classList.add("hidden");

    const container = document.getElementById("resultsContainer");
    container.innerHTML = `
        <h3 class="font-bold text-stone-800 text-sm">Trámites recomendados:</h3>
    `;

    data.suggested_procedures.forEach(proc => {
        const score = Math.round((proc.match_score || 0.9) * 100);
        container.innerHTML += `
            <div class="bg-white p-5 rounded-xl border border-stone-200 space-y-3 proc-card">
                <div>
                    <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        COMPATIBILIDAD ${score}%
                    </span>
                    <h4 class="font-bold text-stone-800 text-base mt-1">${proc.title}</h4>
                </div>
                <p class="text-xs text-stone-600">${proc.reason || proc.description}</p>
                <button onclick="startDemoFlow('${proc.id}')"
                    class="bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-600 transition">
                    Iniciar trámite
                </button>
            </div>
        `;
    });
}

// Enter para buscar
document.getElementById("userQuery").addEventListener("keydown", e => {
    if (e.key === "Enter") runNaturalSearch();
});

// --- Utilidad ---
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
