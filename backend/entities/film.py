from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from .rating import Rating


@dataclass
class Film:
    """映画情報を表すエンティティ"""
    film_id: str
    title: str
    rating: Rating
    last_update: datetime
    description: Optional[str] = None
    image_path: Optional[str] = None
    release_year: Optional[int] = None
    delete_flag: bool = False
