"""依存性注入の設定"""
from backend.repositories.film_repository import FilmRepository
from backend.repositories.actor_repository import ActorRepository
from backend.repositories.dynamodb_film_repository import DynamoDBFilmRepository
from backend.repositories.dynamodb_actor_repository import DynamoDBActorRepository
from backend.repositories.mysql_film_repository import MySQLFilmRepository
from backend.repositories.mysql_actor_repository import MySQLActorRepository
from backend.config.settings import settings


def get_film_repository() -> FilmRepository:
    """
    環境変数に基づいて適切な Film リポジトリを返す

    Returns:
        FilmRepository: DynamoDB または MySQL の Film リポジトリ

    Raises:
        ValueError: サポートされていないデータベースタイプの場合
    """
    if settings.database_type == "dynamodb":
        return DynamoDBFilmRepository()
    elif settings.database_type == "mysql":
        return MySQLFilmRepository()
    else:
        raise ValueError(f"Unsupported database type: {settings.database_type}")


def get_actor_repository() -> ActorRepository:
    """
    環境変数に基づいて適切な Actor リポジトリを返す

    Returns:
        ActorRepository: DynamoDB または MySQL の Actor リポジトリ

    Raises:
        ValueError: サポートされていないデータベースタイプの場合
    """
    if settings.database_type == "dynamodb":
        return DynamoDBActorRepository()
    elif settings.database_type == "mysql":
        return MySQLActorRepository()
    else:
        raise ValueError(f"Unsupported database type: {settings.database_type}")
