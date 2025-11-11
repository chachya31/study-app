"""Film リポジトリの抽象基底クラス"""
from abc import ABC, abstractmethod
from typing import List, Optional

from backend.entities.film import Film


class FilmRepository(ABC):
    """Film エンティティのデータアクセスを定義する抽象基底クラス"""

    @abstractmethod
    def create(self, film: Film) -> Film:
        """
        新しい Film を作成する

        Args:
            film: 作成する Film エンティティ

        Returns:
            作成された Film エンティティ

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        pass

    @abstractmethod
    def get_all(self) -> List[Film]:
        """
        削除されていない全ての Film を取得する (delete_flag=False)

        Returns:
            Film エンティティのリスト

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        pass

    @abstractmethod
    def get_by_id(self, film_id: str) -> Optional[Film]:
        """
        指定された film_id の Film を取得する

        Args:
            film_id: 取得する Film の ID

        Returns:
            Film エンティティ、見つからない場合は None

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        pass

    @abstractmethod
    def update(self, film: Film) -> Film:
        """
        既存の Film を更新する

        Args:
            film: 更新する Film エンティティ

        Returns:
            更新された Film エンティティ

        Raises:
            NotFoundError: Film が見つからない場合
            DatabaseError: データベース操作に失敗した場合
        """
        pass

    @abstractmethod
    def delete(self, film_id: str) -> bool:
        """
        指定された film_id の Film を論理削除する (delete_flag=True)

        Args:
            film_id: 削除する Film の ID

        Returns:
            削除が成功した場合 True、Film が見つからない場合 False

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        pass
