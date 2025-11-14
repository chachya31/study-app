"""Film API スキーマ"""
from typing import List, Optional
from pydantic import BaseModel

from backend.entities.rating import Rating


class FilmRequest(BaseModel):
    """Film 作成・更新リクエストモデル"""
    title: str
    rating: Rating
    description: Optional[str] = None
    image_path: Optional[str] = None
    release_year: Optional[int] = None


class FilmResponse(BaseModel):
    """Film レスポンスモデル"""
    film_id: str
    title: str
    rating: Rating
    description: Optional[str] = None
    image_path: Optional[str] = None
    release_year: Optional[int] = None
    last_update: str
    delete_flag: bool

    class Config:
        """Pydantic 設定"""
        from_attributes = True


class FilmsListResponse(BaseModel):
    """Films リストレスポンスモデル"""
    films: List[FilmResponse]
