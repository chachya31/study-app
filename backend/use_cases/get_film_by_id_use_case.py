"""映画取得ユースケース"""
from backend.entities.film import Film
from backend.exceptions import NotFoundError
from backend.repositories.film_repository import FilmRepository


class GetFilmByIdUseCase:
    """指定された ID の映画を取得するユースケース"""

    def __init__(self, repository: FilmRepository):
        """
        Args:
            repository: Film リポジトリ
        """
        self.repository = repository

    def execute(self, film_id: str) -> Film:
        """
        指定された film_id の映画を取得する

        Args:
            film_id: 取得する映画の ID

        Returns:
            Film エンティティ

        Raises:
            NotFoundError: 映画が見つからない場合
            DatabaseError: データベース操作に失敗した場合
        """
        film = self.repository.get_by_id(film_id)

        if film is None:
            raise NotFoundError(f"Film with id {film_id} not found")

        return film
