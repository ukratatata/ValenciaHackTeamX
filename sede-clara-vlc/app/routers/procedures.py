"""Router: ejecución de trámites — flujo GovPulse València."""

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.mock_data import USER_PROFILE_DB, PROCEDURES_CATALOG

router = APIRouter(prefix="/api", tags=["procedures"])


class ProcedureRequest(BaseModel):
    procedure_id: str
    user_id: str


@router.post("/process-procedure")
def process_procedure(data: ProcedureRequest):
    """
    Orquestador: consulta datos de múltiples organismos,
    detecta qué falta y pide solo lo estrictamente necesario.
    """
    profile = USER_PROFILE_DB.get(data.user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Usuario no autenticado")

    proc = PROCEDURES_CATALOG.get(data.procedure_id)
    if not proc:
        raise HTTPException(status_code=404, detail="Trámite no encontrado")

    now = datetime.now(timezone.utc)
    tracking = f"GP-VLC-{now.strftime('%Y%m%d-%H%M%S')}"

    # Simular consultas según el trámite
    consultas_resultado = []
    padron_missing = not profile.get("empadronado", False)

    for c in proc.get("consultas", []):
        org = c["organismo"]
        if "Ayuntamiento" in org and padron_missing:
            consultas_resultado.append({
                **c,
                "estado": "no_consta",
                "detalle": "No consta empadronamiento en València"
            })
        else:
            consultas_resultado.append({
                **c,
                "estado": "ok",
                "detalle": "Verificado correctamente"
            })

    return {
        "status": "processed",
        "message": "Solicitud tramitada. El portal ha consultado automáticamente "
                   "5 organismos en tu nombre.",
        "citizen": profile["name"],
        "consultas": consultas_resultado,
        "padron_missing": padron_missing,
        "auto_attached_documents": proc["auto_retrieved_docs"],
        "pending_user_docs": proc["user_required_docs"],
        "oficina_asignada": proc.get("oficina", "Por determinar"),
        "tracking_code": tracking,
        "centro_salud": "Centro de Salud Plaza de España" if data.procedure_id == "TARJETA_SIP" else None,
    }
