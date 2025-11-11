"""アクター取得ユースケース"""
from backend.entities.actor import Actor
from backend.exceptions import NotFoundError
from backend.repositories.actor_repository import ActorRepository


class GetActorByIdUseCase:
    """指定された ID のアクターを取得するユースケース"""

    def __init__(self, repository: ActorRepository):
        """
        Args:
            repository: Actor リポジトリ
        """
        self.repository = repository

    def execute(self, actor_id: str) -> Actor:
        """
        指定された actor_id のアクターを取得する

        Args:
            actor_id: 取得するアクターの ID

        Returns:
            Actor エンティティ

        Raises:
            NotFoundError: アクターが見つからない場合
            DatabaseError: データベース操作に失敗した場合
        """
        actor = self.repository.get_by_id(actor_id)

        if actor is None:
            raise NotFoundError(f"Actor with id {actor_id} not found")

        return actor
