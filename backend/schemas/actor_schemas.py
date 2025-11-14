"""Actor API スキーマ"""
from pydantic import BaseModel


class ActorRequest(BaseModel):
    """Actor 作成・更新リクエストモデル"""
    first_name: str
    last_name: str


class ActorResponse(BaseModel):
    """Actor レスポンスモデル"""
    actor_id: str
    first_name: str
    last_name: str
    last_update: str
    delete_flag: bool

    class Config:
        """Pydantic 設定"""
        from_attributes = True
