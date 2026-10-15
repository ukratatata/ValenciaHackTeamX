"""
Servicio "fake LLM" para la demo de GovPulse València.
Simula delay + siempre devuelve TARJETA_SIP como trámite principal.
"""

import asyncio
from app.services.mock_data import PROCEDURES_CATALOG


async def search_procedures(user_text: str) -> dict:
    """
    Simula búsqueda inteligente. En la demo: delay 1.2s,
    siempre devuelve TARJETA_SIP (flujo principal del pitch).
    """
    await asyncio.sleep(1.2)

    results = []

    # Siempre incluir tarjeta SIP (demo principal del pitch)
    results.append({
        **PROCEDURES_CATALOG["TARJETA_SIP"],
        "match_score": 0.96,
        "reason": "Para acceder al sistema sanitario necesitas la tarjeta SIP. "
                  "GovPulse puede gestionar automáticamente el empadronamiento, "
                  "el derecho INSS y la solicitud sanitaria en una sola petición.",
    })

    lower = user_text.lower()

    # Si menciona empadronamiento
    if any(kw in lower for kw in ("empadron", "vivir", "mudar", "domicilio", "registr")):
        results.append({
            **PROCEDURES_CATALOG["PADRON_ALTA"],
            "match_score": 0.89,
            "reason": "Necesitas registrar tu domicilio en València para acceder a servicios públicos.",
        })

    # Si menciona ayudas / dinero / emergencia
    if any(kw in lower for kw in ("ayuda", "dinero", "alquiler", "pagar", "emergencia", "vulnerable")):
        results.append({
            **PROCEDURES_CATALOG["AYUDAS_EMERGENCIA"],
            "match_score": 0.91,
            "reason": "Existen ayudas de emergencia para cubrir alquiler, suministros y necesidades básicas.",
        })

    # Si menciona DANA
    if any(kw in lower for kw in ("dana", "inundación", "riada", "daños")):
        results.append({
            **PROCEDURES_CATALOG["AYUDAS_DANA"],
            "match_score": 0.93,
            "reason": "Hay ayudas municipales específicas para personas afectadas por la DANA.",
        })

    return {
        "status": "success",
        "model": "govpulse-nlp-v1 (demo)",
        "suggested_procedures": results,
    }
