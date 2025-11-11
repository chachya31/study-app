"""映画削除ユースケース"""
from backend.exceptions import NotFoundError
from backend.repositories.film_repository import FilmRepository


class DeleteFilmUseCase:
    """映画を論理削除するユースケース"""

    def __init__(self, repository: FilmRepository):
        """
        Args:
            repository: Film リポジトリ
        """
        self.repository = repository

    def execute(self, film_id: str) -> bool:
        """
        指定された film_id の映画を論理削除する (delete_flag=True)

        Args:
            film_id: 削除する映画の ID

        Returns:
            削除が成功した場合 True

        Raises:
            NotFoundError: 映画が見つからない場合
            DatabaseError: データベース操作に失敗した場合
        """
        # リポジトリを使用して削除
        result = self.repository.delete(film_id)

        if not result:
            raise NotFoundError(f"Film with id {film_id} not found")

        return result
