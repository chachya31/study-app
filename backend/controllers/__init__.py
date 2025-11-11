"""Controllers パッケージ"""
from backend.controllers import auth_controller, film_controller, actor_controller
from backend.controllers.dependencies import get_film_repository, get_actor_repository

__all__ = [
    "auth_controller",
    "film_controller",
    "actor_controller",
    "get_film_repository",
    "get_actor_repository",
]
