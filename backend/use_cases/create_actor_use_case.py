"""アクター作成ユースケース"""
from datetime import datetime
from uuid import uuid4

from backend.entities.actor import Actor
from backend.exceptions import ValidationError
from backend.repositories.actor_repository import ActorRepository


class CreateActorUseCase:
    """アクターを作成するユースケース"""

    def __init__(self, repository: ActorRepository):
        """
        Args:
            repository: Actor リポジトリ
        """
        self.repository = repository

    def execute(
        self,
        first_name: str,
        last_name: str
    ) -> Actor:
        """
        新しいアクターを作成する

        Args:
            first_name: アクターの名
            last_name: アクターの姓

        Returns:
            作成された Actor エンティティ

        Raises:
            ValidationError: 入力データの検証に失敗した場合
            DatabaseError: データベース操作に失敗した場合
        """
        # 入力データの検証
        self._validate_input(first_name, last_name)

        # UUID で actor_id を生成
        actor_id = str(uuid4())

        # last_update を現在時刻に設定
        last_update = datetime.now()

        # Actor エンティティを作成
        actor = Actor(
            actor_id=actor_id,
            first_name=first_name,
            last_name=last_name,
            last_update=last_update,
            delete_flag=False
        )

        # リポジトリを使用して Actor を作成
        return self.repository.create(actor)

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
