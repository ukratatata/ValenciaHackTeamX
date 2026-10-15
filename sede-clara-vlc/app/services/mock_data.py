"""
Datos simulados: perfil de usuario (como si viniesen de Cl@ve + Padrón + AEAT)
y catálogo de trámites cargado desde data/tramites.json.
"""

import json
from pathlib import Path

# --- Perfil simulado del ciudadano (lo que Cl@ve + interoperabilidad devolvería) ---
USER_PROFILE_DB: dict[str, dict] = {
    "USER_VALENCIA_778": {
        "name": "María García López",
        "nif": "12345678A",
        "empadronado": True,
        "direccion": "Calle de la Paz 14, 3º-5ª, 46003 València",
        "barrio": "La Seu",
        "distrito": "Ciutat Vella",
        "antiguedad_padron_meses": 24,
        "family_members": 2,
        "menores": 1,
        "ingresos_ultimo_mes": 450.00,
        "prestacion_sepe": False,
    }
}

# --- Cargar catálogo de trámites desde JSON ---
_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

def load_procedures_catalog() -> dict:
    path = _DATA_DIR / "tramites.json"
    with open(path, encoding="utf-8") as f:
        return json.load(f)

PROCEDURES_CATALOG = load_procedures_catalog()
