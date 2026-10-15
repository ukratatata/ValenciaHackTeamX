"""
Datos simulados: perfil de usuario y catálogo de trámites.
Adaptado al pitch de GovPulse València (historia de Vlad).
"""

import json
from pathlib import Path

# --- Perfil simulado: Vlad (protagonista del pitch) ---
USER_PROFILE_DB: dict[str, dict] = {
    "USER_VLAD_019": {
        "name": "Vlad Kowalenko",
        "nif": "Y7654321Q",
        "edad": 19,
        "empadronado": False,
        "direccion": "C/ del Mar 22, 2º-3ª, 46003 València",
        "barrio": "El Mercat",
        "distrito": "Ciutat Vella",
        "antiguedad_padron_meses": 0,
        "family_members": 1,
        "menores": 0,
        "situacion_laboral": "Contrato temporal — Hostelería",
        "contrato_vigente": True,
        "ingresos_ultimo_mes": 1050.00,
        "prestacion_sepe": False,
        "tarjeta_sip": False,
        "inss_derecho_sanitario": False,
    }
}

# --- Cargar catálogo de trámites desde JSON ---
_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

def load_procedures_catalog() -> dict:
    path = _DATA_DIR / "tramites.json"
    with open(path, encoding="utf-8") as f:
        return json.load(f)

PROCEDURES_CATALOG = load_procedures_catalog()
