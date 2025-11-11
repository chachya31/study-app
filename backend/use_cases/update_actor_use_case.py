"""アクター更新ユースケース"""
from datetime import datetime

from backend.entities.actor import Actor
from backend.exceptions import ValidationError
from backend.repositories.actor_repository import ActorRepository


class UpdateActorUseCase:
    """アクター情報を更新するユースケース"""

    def __init__(self, repository: ActorRepository):
        """
        Args:
            repository: Actor リポジトリ
        """
        self.repository = repository

    def execute(
        self,
        actor_id: str,
        first_name: str,
        last_name: str,
        delete_flag: bool = False
    ) -> Actor:
        """
        既存のアクター情報を更新する

        Args:
            actor_id: 更新するアクターの ID
            first_name: アクターの名
            last_name: アクターの姓
            delete_flag: 削除フラグ

        Returns:
            更新された Actor エンティティ

        Raises:
            ValidationError: 入力データの検証に失敗した場合
            NotFoundError: アクターが見つからない場合
            DatabaseError: データベース操作に失敗した場合
        """
        # 入力データの検証
        self._validate_input(first_name, last_name)

        # last_update を現在時刻に更新
        last_update = datetime.now()

        # Actor エンティティを作成
        actor = Actor(
            actor_id=actor_id,
            first_name=first_name,
            last_name=last_name,
            last_update=last_update,
            delete_flag=delete_flag
        )

        # リポジトリを使用して Actor を更新
        return self.repository.update(actor)

    def _validate_input(self, first_name: str, last_name: str) -> None:
        """
        入力データを検証する

        Args:
            first_name: アクターの名
            last_name: アクターの姓

        Raises:
            ValidationError: 検証に失敗した場合
        """
        # first_name が空でないことを検証
        if not first_name or not first_name.strip():
            raise ValidationError("First name cannot be empty")

        # last_name が空でないことを検証
        if not last_name or not last_name.strip():
            raise ValidationError("Last name cannot be empty")
