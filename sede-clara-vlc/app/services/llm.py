"""
Servicio "fake LLM" para la demo.
Simula un delay + siempre devuelve AYUDAS_EMERGENCIA como trámite recomendado.
En producción se reemplazaría por una llamada real a un LLM con RAG.
"""

import asyncio
from app.services.mock_data import PROCEDURES_CATALOG


async def search_procedures(user_text: str) -> dict:
    """
    Simula la búsqueda inteligente de trámites.
    En la demo: delay de 1.2s para parecer real + devuelve siempre
    AYUDAS_EMERGENCIA (y PADRON_ALTA si detecta keywords).
    """
    # Delay para que en la demo parezca que "piensa"
    await asyncio.sleep(1.2)

    results = []

    # Siempre incluir ayudas de emergencia (es la demo principal)
    results.append({
        **PROCEDURES_CATALOG["AYUDAS_EMERGENCIA"],
        "match_score": 0.94,
        "reason": "Tu situación indica posible necesidad de apoyo económico urgente. "
                  "Esta prestación cubre alquiler, suministros y necesidades básicas.",
    })

    # Si menciona empadronamiento, añadir también
    lower = user_text.lower()
    if any(kw in lower for kw in ("empadron", "vivir", "mudar", "domicilio", "casa nueva")):
        results.append({
            **PROCEDURES_CATALOG["PADRON_ALTA"],
            "match_score": 0.87,
            "reason": "Parece que necesitas registrar tu domicilio en València.",
        })

    # Si menciona DANA
    if any(kw in lower for kw in ("dana", "inundación", "riada", "daños")):
        results.append({
            **PROCEDURES_CATALOG["AYUDAS_DANA"],
            "match_score": 0.91,
            "reason": "Detectamos mención a daños por la DANA. Existen ayudas municipales específicas.",
        })

    return {
        "status": "success",
        "model": "sede-clara-nlp-v1 (demo)",
        "suggested_procedures": results,
    }
