from dataclasses import dataclass
from datetime import datetime


@dataclass
class Actor:
    """アクター情報を表すエンティティ"""
    actor_id: str
    first_name: str
    last_name: str
    last_update: datetime
    delete_flag: bool = False
