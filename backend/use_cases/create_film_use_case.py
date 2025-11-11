"""映画作成ユースケース"""
from datetime import datetime
from typing import Optional
from uuid import uuid4

from backend.entities.film import Film
from backend.entities.rating import Rating
from backend.exceptions import ValidationError
from backend.repositories.film_repository import FilmRepository


class CreateFilmUseCase:
    """映画を作成するユースケース"""

    def __init__(self, repository: FilmRepository):
        """
        Args:
            repository: Film リポジトリ
        """
        self.repository = repository

    def execute(
        self,
        title: str,
        rating: Rating,
        description: Optional[str] = None,
        image_path: Optional[str] = None,
        release_year: Optional[int] = None
    ) -> Film:
        """
        新しい映画を作成する

        Args:
            title: 映画のタイトル
            rating: 映画のレーティング
            description: 映画の説明（オプション）
            image_path: 画像パス（オプション）
            release_year: 公開年（オプション）

        Returns:
            作成された Film エンティティ

        Raises:
            ValidationError: 入力データの検証に失敗した場合
            DatabaseError: データベース操作に失敗した場合
        """
        # 入力データの検証
        self._validate_input(title, rating, release_year)

        # UUID で film_id を生成
        film_id = str(uuid4())

        # last_update を現在時刻に設定
        last_update = datetime.now()

        # Film エンティティを作成
        film = Film(
            film_id=film_id,
            title=title,
            rating=rating,
            description=description,
            image_path=image_path,
            release_year=release_year,
            last_update=last_update,
            delete_flag=False
        )

        # リポジトリを使用して Film を作成
        return self.repository.create(film)

    def _validate_input(self, title: str, rating: Rating, release_year: Optional[int] = None) -> None:
        """
        入力データを検証する

        Args:
            title: 映画のタイトル
            rating: 映画のレーティング
            release_year: 公開年（オプション）

        Raises:
            ValidationError: 検証に失敗した場合
        """
        # title が空でないことを検証
        if not title or not title.strip():
            raise ValidationError("Title cannot be empty")

        # rating が有効な Rating Enum の値であることを検証
        if not isinstance(rating, Rating):
            raise ValidationError(f"Invalid rating. Must be one of: {', '.join([r.value for r in Rating])}")

        # release_year が提供される場合、有効な年（1800-2100）であることを検証
        if release_year is not None:
            if not isinstance(release_year, int) or release_year < 1800 or release_year > 2100:
                raise ValidationError("Release year must be between 1800 and 2100")
