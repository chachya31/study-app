"""映画一覧取得ユースケース"""
from typing import List

from backend.entities.film import Film
from backend.repositories.film_repository import FilmRepository


class GetFilmsUseCase:
    """削除されていない全ての映画を取得するユースケース"""

    def __init__(self, repository: FilmRepository):
        """
        Args:
            repository: Film リポジトリ
        """
        self.repository = repository

    def execute(self) -> List[Film]:
        """
        削除されていない全ての映画を取得する (delete_flag=False)

        Returns:
            Film エンティティのリスト

        Raises:
            DatabaseError: データベース操作に失敗した場合
        """
        return self.repository.get_all()
