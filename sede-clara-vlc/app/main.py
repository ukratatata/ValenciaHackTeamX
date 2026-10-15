"""
Sede Clara VLC — Portal Único Ciudadano
Punto de entrada FastAPI. Monta routers y sirve el frontend estático.
"""

from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routers import search, procedures

app = FastAPI(
    title="Sede Clara VLC",
    description="Portal ciudadano unificado — Hackathon ValenciaHack 2026",
    version="1.0.0",
)

# Routers
app.include_router(search.router)
app.include_router(procedures.router)

# Servir archivos estáticos del frontend
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/")
def serve_index():
    return FileResponse(str(FRONTEND_DIR / "index.html"))
