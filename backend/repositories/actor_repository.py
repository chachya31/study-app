"""Actor リポジトリの抽象基底クラス"""
from abc import ABC, abstractmethod
from typing import List, Optional

from backend.entities.actor import Actor


class ActorRepository(ABC):
    """Actor エンティティのデータアクセスを定義する抽象基底クラス"""

    @abstractmethod
    def create(self, actor: Actor) -> Actor:
        """
        新しい Actor を作成する

        Args:
            actor: 作成する Actor エンティティ

        Returns:
            作成された Actor エンティティ

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        pass

    @abstractmethod
    def get_all(self) -> List[Actor]:
        """
        削除されていない全ての Actor を取得する (delete_flag=False)

        Returns:
            Actor エンティティのリスト

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        pass

    @abstractmethod
    def get_by_id(self, actor_id: str) -> Optional[Actor]:
        """
        指定された actor_id の Actor を取得する

        Args:
            actor_id: 取得する Actor の ID

        Returns:
            Actor エンティティ、見つからない場合は None

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        pass

    @abstractmethod
    def update(self, actor: Actor) -> Actor:
        """
        既存の Actor を更新する

        Args:
            actor: 更新する Actor エンティティ

        Returns:
            更新された Actor エンティティ

        Raises:
            NotFoundError: Actor が見つからない場合
            DatabaseError: データベース操作に失敗した場合
        """
        pass

    @abstractmethod
    def delete(self, actor_id: str) -> bool:
        """
        指定された actor_id の Actor を論理削除する (delete_flag=True)

        Args:
            actor_id: 削除する Actor の ID

        Returns:
            削除が成功した場合 True、Actor が見つからない場合 False

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        pass
