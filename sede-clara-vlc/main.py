from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import datetime
import os

app = FastAPI(title="Sede Clara VLC - MVP Hackathon", version="1.0.0")

# --- MONTAR ARCHIVOS ESTÁTICOS ---
# Esto sirve automáticamente todo lo que esté dentro de la carpeta "static"
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- MODELOS DE DATOS ---
class TextSimplificationRequest(BaseModel):
    procedure_code: str
    original_text: str
    officer_id: str

class DocumentValidationRequest(BaseModel):
    applicant_name: str
    document_type: str  # "alquiler", "dni", "recibo"
    months_duration: int
    has_current_receipt: bool
    dni_valid: bool

# --- BASE DE DATOS EN MEMORIA (SIMULADA) ---
AUDIT_LOG = []

PROCEDURE_DB = {
    "PA.GP.50": {
        "title": "Inscripción o modificación de datos en el Padrón Municipal",
        "raw_text": "La tramitación de alta padronal requerirá inexcusablemente la presentación por parte de los interesados de título acreditativo de la ocupación de la vivienda, entendiéndose por tal contrato de arrendamiento de vigencia no inferior a seis meses, debiendo aportar además el último recibo de abono de la renta mensual."
    }
}

# --- ENDPOINTS ---
@app.get("/", response_class=HTMLResponse)
def read_root():
    # Devuelve el archivo index.html ubicado en la carpeta static
    index_path = os.path.join("static", "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read(), status_code=200)
    return HTMLResponse(content="<h1>Error: No se encuentra el archivo static/index.html</h1>", status_code=404)

@app.post("/api/simplify")
def simplify_text(data: TextSimplificationRequest):
    """Módulo A: Copiloto de Lenguaje Claro con supervisión humana y trazabilidad"""
    if data.procedure_code not in PROCEDURE_DB:
        raise HTTPException(status_code=404, detail="Procedimiento no encontrado en la Sede Electrónica")
    
    # Simulación de transformación a Lenguaje Claro (Sujeto + Verbo + Complementos, < 25 palabras)
    simplified = (
        "Para empadronarte en València, debes presentar un contrato de alquiler "
        "con una duración superior a 6 meses y el recibo del pago del alquiler del mes actual."
    )
    
    # Registro de auditoría
    audit_entry = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "officer_id": data.officer_id,
        "procedure": data.procedure_code,
        "action": "SIMPLIFIED_AND_PENDING_REVIEW",
        "metrics_reduction": "42% menos de longitud, voz activa aplicada"
    }
    AUDIT_LOG.append(audit_entry)
    
    return {
        "status": "success",
        "original": PROCEDURE_DB[data.procedure_code]["raw_text"],
        "simplified": simplified,
        "metrics": {
            "avg_words_per_sentence": 14,
            "passive_voice_eliminated": True,
            "jargon_removed": ["título acreditativo", "inexcusablemente"]
        }
    }

@app.post("/api/audit/action")
def audit_action(procedure_code: str, officer_id: str, decision: str):
    """Registra la decisión del funcionario (Aceptar, Modificar, Descartar)"""
    audit_entry = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "officer_id": officer_id,
        "procedure": procedure_code,
        "decision": decision  # "ACEPTADO", "MODIFICADO", "DESCARTADO"
    }
    AUDIT_LOG.append(audit_entry)
    return {"status": "recorded", "audit_trail": AUDIT_LOG}

@app.post("/api/validate-padron")
def validate_padron(data: DocumentValidationRequest):
    """Módulo B: Pre-validador inteligente para evitar citas fallidas en Padrón"""
    errors = []
    
    if not data.dni_valid:
        errors.append("El DNI/NIE aportado está caducado o no es válido.")
    
    if data.months_duration < 6:
        errors.append(f"El contrato aportado es de {data.months_duration} meses. La norma exige un mínimo de 6 meses.")
        
    if not data.has_current_receipt:
        errors.append("Falta el recibo de pago del alquiler del mes en curso.")
        
    if errors:
        return {
            "approved": False,
            "message": "Documentación incompleta o errónea. Evita acudir a la oficina de Tabacalera hasta subsanar estos puntos.",
            "errors": errors
        }
    
    return {
        "approved": True,
        "message": "¡Documentación pre-validada con éxito! Ya puedes solicitar tu cita previa sin riesgo de rechazo.",
        "qr_pass_code": f"VLC-PADRON-OK-{datetime.datetime.utcnow().strftime('%H%M%S')}"
    }