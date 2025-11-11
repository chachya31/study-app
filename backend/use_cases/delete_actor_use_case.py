"""アクター削除ユースケース"""
from backend.exceptions import NotFoundError
from backend.repositories.actor_repository import ActorRepository


class DeleteActorUseCase:
    """アクターを論理削除するユースケース"""

    def __init__(self, repository: ActorRepository):
        """
        Args:
            repository: Actor リポジトリ
        """
        self.repository = repository

    def execute(self, actor_id: str) -> bool:
        """
        指定された actor_id のアクターを論理削除する (delete_flag=True)

        Args:
            actor_id: 削除するアクターの ID

        Returns:
            削除が成功した場合 True

        Raises:
            NotFoundError: アクターが見つからない場合
            DatabaseError: データベース操作に失敗した場合
        """
        # リポジトリを使用して削除
        result = self.repository.delete(actor_id)

        if not result:
            raise NotFoundError(f"Actor with id {actor_id} not found")

        return result
