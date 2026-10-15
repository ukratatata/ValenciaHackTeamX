// --- Estado global ---
let selectedProcId = null;

// --- Búsqueda de trámites ---
async function runNaturalSearch() {
    const text = document.getElementById("userQuery").value.trim();
    if (!text) return;

    // Mostrar loading, ocultar resultados previos
    document.getElementById("loadingPanel").classList.remove("hidden");
    document.getElementById("resultsContainer").innerHTML = "";
    document.getElementById("executionPanel").classList.add("hidden");
    document.getElementById("successPanel").classList.add("hidden");

    const res = await fetch("/api/natural-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_situation: text }),
    });
    const data = await res.json();

    document.getElementById("loadingPanel").classList.add("hidden");

    const container = document.getElementById("resultsContainer");
    container.innerHTML = `
        <h3 class="font-bold text-slate-800 text-sm">
            Trámites recomendados para tu situación:
        </h3>
    `;

    data.suggested_procedures.forEach((proc) => {
        const procId = proc.id;
        const score = Math.round((proc.match_score || 0.9) * 100);

        container.innerHTML += `
            <div class="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-sm">
                <div>
                    <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        COMPATIBILIDAD ${score}%
                    </span>
                    <h4 class="font-bold text-blue-900 text-base mt-1">${proc.title}</h4>
                </div>
                <p class="text-xs text-slate-600">${proc.reason || proc.description}</p>

                <div class="bg-slate-50 p-3 rounded-lg text-xs space-y-2">
                    <p class="text-emerald-700 font-semibold">
                        El portal obtiene automáticamente:
                    </p>
                    <ul class="list-disc pl-4 text-slate-600">
                        ${proc.auto_retrieved_docs.map((d) => `<li>${d}</li>`).join("")}
                    </ul>
                    <p class="text-amber-700 font-semibold mt-2">
                        Solo necesitas aportar:
                    </p>
                    <ul class="list-disc pl-4 text-slate-600">
                        ${proc.user_required_docs.map((d) => `<li>${d}</li>`).join("")}
                    </ul>
                </div>

                <button
                    onclick="prepareProcedure('${procId}')"
                    class="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-800 transition"
                >
                    Iniciar trámite con Cl@ve
                </button>
            </div>
        `;
    });
}

// --- Preparar tramitación ---
function prepareProcedure(procId) {
    selectedProcId = procId;
    const panel = document.getElementById("executionPanel");
    panel.classList.remove("hidden");

    document.getElementById("executionContent").innerHTML = `
        <p>&#10003; <strong>Identidad verificada</strong> mediante Cl@ve (María García López)</p>
        <p>&#10003; <strong>Certificado de Padrón</strong> generado automáticamente (empadronada 24 meses en C/ de la Paz 14)</p>
        <p>&#10003; <strong>Consulta SEPE:</strong> no consta prestación activa</p>
        <p>&#10003; <strong>Consulta Catastro:</strong> sin titularidad de inmuebles</p>
        <p class="mt-2 text-emerald-900 font-semibold">
            Listo para enviar. Solo se te pedirá el recibo de alquiler y el extracto bancario.
        </p>
    `;

    panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

// --- Ejecutar tramitación ---
async function executeProcedure() {
    if (!selectedProcId) return;

    const res = await fetch("/api/process-procedure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            procedure_id: selectedProcId,
            user_id: "USER_VALENCIA_778",
        }),
    });
    const data = await res.json();

    document.getElementById("executionPanel").classList.add("hidden");

    const success = document.getElementById("successPanel");
    success.classList.remove("hidden");

    document.getElementById("successContent").innerHTML = `
        <p>${data.message}</p>
        <p class="font-semibold mt-2">Documentos adjuntados automáticamente:</p>
        <ul class="list-disc pl-4 text-sm">
            ${data.auto_attached_documents.map((d) => `<li>${d}</li>`).join("")}
        </ul>
        <p class="font-semibold mt-2">Pendiente de aportar:</p>
        <ul class="list-disc pl-4 text-sm">
            ${data.pending_user_docs.map((d) => `<li>${d}</li>`).join("")}
        </ul>
        <div class="mt-3 bg-emerald-50 p-3 rounded-lg">
            <p class="text-emerald-800 font-bold">
                Código de seguimiento: ${data.tracking_code}
            </p>
            <p class="text-xs text-emerald-700 mt-1">
                Oficina asignada: ${data.oficina_asignada}
            </p>
        </div>
    `;

    success.scrollIntoView({ behavior: "smooth", block: "center" });
}

// --- Enter para buscar ---
document.getElementById("userQuery").addEventListener("keydown", (e) => {
    if (e.key === "Enter") runNaturalSearch();
});
