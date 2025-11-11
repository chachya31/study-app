"""MySQL を使用した Actor リポジトリの実装"""
from typing import List, Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError

from backend.entities.actor import Actor
from backend.repositories.actor_repository import ActorRepository
from backend.repositories.models import ActorModel
from backend.config.settings import settings


class MySQLActorRepository(ActorRepository):
    """MySQL を使用した Actor リポジトリの実装"""

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

    def _model_to_entity(self, model: ActorModel) -> Actor:
        """ActorModel を Actor エンティティに変換"""
        return Actor(
            actor_id=model.actor_id,
            first_name=model.first_name,
            last_name=model.last_name,
            last_update=model.last_update,
            delete_flag=model.delete_flag
        )

    def _entity_to_model(self, actor: Actor) -> ActorModel:
        """Actor エンティティを ActorModel に変換"""
        return ActorModel(
            actor_id=actor.actor_id,
            first_name=actor.first_name,
            last_name=actor.last_name,
            last_update=actor.last_update,
            delete_flag=actor.delete_flag
        )

    def create(self, actor: Actor) -> Actor:
        """
        新しい Actor を作成する

        Args:
            actor: 作成する Actor エンティティ

        Returns:
            作成された Actor エンティティ

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            actor_model = self._entity_to_model(actor)
            session.add(actor_model)
            session.commit()
            session.refresh(actor_model)
            return self._model_to_entity(actor_model)
        except SQLAlchemyError as e:
            session.rollback()
            raise Exception(f"Failed to create actor: {str(e)}") from e
        finally:
            session.close()

    def get_all(self) -> List[Actor]:
        """
        削除されていない全ての Actor を取得する (delete_flag=False)

        Returns:
            Actor エンティティのリスト

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            actor_models = session.query(ActorModel).filter(
                ActorModel.delete_flag == False
            ).all()
            return [self._model_to_entity(model) for model in actor_models]
        except SQLAlchemyError as e:
            raise Exception(f"Failed to get all actors: {str(e)}") from e
        finally:
            session.close()

    def get_by_id(self, actor_id: str) -> Optional[Actor]:
        """
        指定された actor_id の Actor を取得する

        Args:
            actor_id: 取得する Actor の ID

        Returns:
            Actor エンティティ、見つからない場合は None

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            actor_model = session.query(ActorModel).filter(
                ActorModel.actor_id == actor_id
            ).first()

            if actor_model is None:
                return None

            return self._model_to_entity(actor_model)
        except SQLAlchemyError as e:
            raise Exception(f"Failed to get actor by id: {str(e)}") from e
        finally:
            session.close()

    def update(self, actor: Actor) -> Actor:
        """
        既存の Actor を更新する

        Args:
            actor: 更新する Actor エンティティ

        Returns:
            更新された Actor エンティティ

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            actor_model = session.query(ActorModel).filter(
                ActorModel.actor_id == actor.actor_id
            ).first()

            if actor_model is None:
                raise Exception(f"Actor with id {actor.actor_id} not found")

            # 更新
            actor_model.first_name = actor.first_name
            actor_model.last_name = actor.last_name
            actor_model.last_update = actor.last_update
            actor_model.delete_flag = actor.delete_flag

            session.commit()
            session.refresh(actor_model)
            return self._model_to_entity(actor_model)
        except SQLAlchemyError as e:
            session.rollback()
            raise Exception(f"Failed to update actor: {str(e)}") from e
        finally:
            session.close()

    def delete(self, actor_id: str) -> bool:
        """
        指定された actor_id の Actor を論理削除する (delete_flag=True)

        Args:
            actor_id: 削除する Actor の ID

        Returns:
            削除が成功した場合 True、Actor が見つからない場合 False

        Raises:
            Exception: データベース操作に失敗した場合
        """
        session = self._get_session()
        try:
            actor_model = session.query(ActorModel).filter(
                ActorModel.actor_id == actor_id
            ).first()

            if actor_model is None:
                return False

            # delete_flag を True に更新
            actor_model.delete_flag = True
            session.commit()
            return True
        except SQLAlchemyError as e:
            session.rollback()
            raise Exception(f"Failed to delete actor: {str(e)}") from e
        finally:
            session.close()
