"""Router: ejecución de trámites (orquestador zero-friction)."""

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
    Orquestador automático: el portal consigue los docs del padrón/AEAT
    y solo pide al ciudadano lo que no existe en bases de datos públicas.
    """
    profile = USER_PROFILE_DB.get(data.user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Usuario no autenticado con Cl@ve")

    proc = PROCEDURES_CATALOG.get(data.procedure_id)
    if not proc:
        raise HTTPException(status_code=404, detail="Trámite no encontrado")

    now = datetime.now(timezone.utc)
    tracking = f"VLC-CLARA-{now.strftime('%Y%m%d-%H%M%S')}"

    return {
        "status": "processed",
        "message": "Solicitud pre-enrutada correctamente. "
                   "El sistema ha adjuntado automáticamente los documentos que ya obran en poder de la administración.",
        "citizen": profile["name"],
        "auto_attached_documents": [
            f"Certificado de Padrón: {profile['name']} — {profile['direccion']} (antigüedad {profile['antiguedad_padron_meses']} meses)",
            "Verificación de identidad Cl@ve: OK",
            f"Convivientes: {profile['family_members']} ({profile['menores']} menor/es)",
        ],
        "pending_user_docs": proc["user_required_docs"],
        "oficina_asignada": proc.get("oficina", "Por determinar"),
        "tracking_code": tracking,
    }
