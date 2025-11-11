"""MySQL を使用した Film リポジトリの実装"""
from typing import List, Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError

from backend.entities.film import Film
from backend.entities.rating import Rating
from backend.repositories.film_repository import FilmRepository
from backend.repositories.models import FilmModel
from backend.config.settings import settings


class MySQLFilmRepository(FilmRepository):
    """MySQL を使用した Film リポジトリの実装"""

    def __init__(self):
        """SQLAlchemy エンジンとセッションを初期化"""
        self.engine = create_engine(settings.mysql_url, pool_pre_ping=True)
        self.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )

    def _get_session(self) -> Session:
        """新しいデータベースセッションを取得"""
        return self.SessionLocal()

    def _model_to_entity(self, model: FilmModel) -> Film:
        """FilmModel を Film エンティティに変換"""
        return Film(
            film_id=model.film_id,
            title=model.title,
            rating=Rating(model.rating),
            last_update=model.last_update,
            description=model.description,
            image_path=model.image_path,
            release_year=model.release_year,
            delete_flag=model.delete_flag
        )

    def _entity_to_model(self, film: Film) -> FilmModel:
        """Film エンティティを FilmModel に変換"""
        return FilmModel(
            film_id=film.film_id,
            title=film.title,
            rating=film.rating.value,
            last_update=film.last_update,
            description=film.description,
            image_path=film.image_path,
            release_year=film.release_year,
            delete_flag=film.delete_flag
        )

    def create(self, film: Film) -> Film:
        """
        新しい Film を作成する

        Args:
            film: 作成する Film エンティティ

        Returns:
            作成された Film エンティティ

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            film_model = self._entity_to_model(film)
            session.add(film_model)
            session.commit()
            session.refresh(film_model)
            return self._model_to_entity(film_model)
        except SQLAlchemyError as e:
            session.rollback()
            raise Exception(f"Failed to create film: {str(e)}") from e
        finally:
            session.close()

    def get_all(self) -> List[Film]:
        """
        削除されていない全ての Film を取得する (delete_flag=False)

        Returns:
            Film エンティティのリスト

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            film_models = session.query(FilmModel).filter(
                FilmModel.delete_flag == False
            ).all()
            return [self._model_to_entity(model) for model in film_models]
        except SQLAlchemyError as e:
            raise Exception(f"Failed to get all films: {str(e)}") from e
        finally:
            session.close()

    def get_by_id(self, film_id: str) -> Optional[Film]:
        """
        指定された film_id の Film を取得する

        Args:
            film_id: 取得する Film の ID

        Returns:
            Film エンティティ、見つからない場合は None

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            film_model = session.query(FilmModel).filter(
                FilmModel.film_id == film_id
            ).first()

            if film_model is None:
                return None

            return self._model_to_entity(film_model)
        except SQLAlchemyError as e:
            raise Exception(f"Failed to get film by id: {str(e)}") from e
        finally:
            session.close()

    def update(self, film: Film) -> Film:
        """
        既存の Film を更新する

        Args:
            film: 更新する Film エンティティ

        Returns:
            更新された Film エンティティ

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            film_model = session.query(FilmModel).filter(
                FilmModel.film_id == film.film_id
            ).first()

            if film_model is None:
                raise Exception(f"Film with id {film.film_id} not found")

            # 更新
            film_model.title = film.title
            film_model.rating = film.rating.value
            film_model.last_update = film.last_update
            film_model.description = film.description
            film_model.image_path = film.image_path
            film_model.release_year = film.release_year
            film_model.delete_flag = film.delete_flag

            session.commit()
            session.refresh(film_model)
            return self._model_to_entity(film_model)
        except SQLAlchemyError as e:
            session.rollback()
            raise Exception(f"Failed to update film: {str(e)}") from e
        finally:
            session.close()

    def delete(self, film_id: str) -> bool:
        """
        指定された film_id の Film を論理削除する (delete_flag=True)

        Args:
            film_id: 削除する Film の ID

        Returns:
            削除が成功した場合 True、Film が見つからない場合 False

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            film_model = session.query(FilmModel).filter(
                FilmModel.film_id == film_id
            ).first()

            if film_model is None:
                return False

            # delete_flag を True に更新
            film_model.delete_flag = True
            session.commit()
            return True
        except SQLAlchemyError as e:
            session.rollback()
            raise Exception(f"Failed to delete film: {str(e)}") from e
        finally:
            session.close()
