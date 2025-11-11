"""アクター一覧取得ユースケース"""
from typing import List

from backend.entities.actor import Actor
from backend.repositories.actor_repository import ActorRepository


class GetActorsUseCase:
    """削除されていない全てのアクターを取得するユースケース"""

    def __init__(self, repository: ActorRepository):
        """
        Args:
            repository: Actor リポジトリ
        """
        self.repository = repository

    def execute(self) -> List[Actor]:
        """
        削除されていない全てのアクターを取得する (delete_flag=False)

        Returns:
            Actor エンティティのリスト

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        return self.repository.get_all()
