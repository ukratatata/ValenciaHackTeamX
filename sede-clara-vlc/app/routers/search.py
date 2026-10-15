"""Router: búsqueda de trámites con lenguaje natural (fake LLM)."""

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.llm import search_procedures

router = APIRouter(prefix="/api", tags=["search"])


class NaturalLanguageQuery(BaseModel):
    user_situation: str


@router.post("/natural-search")
async def natural_search(query: NaturalLanguageQuery):
    """El ciudadano describe su situación → el 'LLM' sugiere trámites compatibles."""
    return await search_procedures(query.user_situation)
