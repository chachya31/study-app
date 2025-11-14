"""Actor コントローラー"""
import logging
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status

from backend.repositories.actor_repository import ActorRepository
from backend.controllers.dependencies import get_actor_repository
from backend.services.auth_middleware import get_current_user
from backend.use_cases.create_actor_use_case import CreateActorUseCase
from backend.use_cases.get_actors_use_case import GetActorsUseCase
from backend.use_cases.get_actor_by_id_use_case import GetActorByIdUseCase
from backend.use_cases.update_actor_use_case import UpdateActorUseCase
from backend.use_cases.delete_actor_use_case import DeleteActorUseCase
from backend.exceptions import ValidationError, NotFoundError, DatabaseError
from backend.schemas.actor_schemas import ActorRequest, ActorResponse, ActorsListResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/actors", tags=["actors"])


@router.get("", response_model=ActorsListResponse, status_code=status.HTTP_200_OK)
async def get_actors(
    repository: ActorRepository = Depends(get_actor_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    全アクターを取得するエンドポイント

    Args:
        repository: Actor リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Returns:
        List[ActorResponse]: アクターのリスト

    Raises:
        HTTPException: データベース操作に失敗した場合
    """
    try:
        logger.info("全アクターの取得を開始")
        use_case = GetActorsUseCase(repository)
        actors = use_case.execute()
        logger.info(f"アクターを {len(actors)} 件取得しました")
        actors_responses = [
            ActorResponse(
                actor_id=str(actor.actor_id),
                first_name=actor.first_name,
                last_name=actor.last_name,
                last_update=actor.last_update.isoformat(),
                delete_flag=actor.delete_flag
            )
            for actor in actors
        ]
        return ActorsListResponse(actors=actors_responses)
    except Exception as e:
        logger.error(f"アクターの取得中にエラーが発生: {str(e)}", exc_info=True)
        raise DatabaseError(f"アクターの取得中にエラーが発生しました: {str(e)}") from e


@router.post("", response_model=ActorResponse, status_code=status.HTTP_201_CREATED)
async def create_actor(
    request: ActorRequest,
    repository: ActorRepository = Depends(get_actor_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    アクターを作成するエンドポイント

    Args:
        request: アクター作成リクエスト
        repository: Actor リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Returns:
        ActorResponse: 作成されたアクター

    Raises:
        HTTPException: 検証エラーまたはデータベース操作に失敗した場合
    """
    try:
        logger.info(f"アクターの作成を開始: {request.first_name} {request.last_name}")
        use_case = CreateActorUseCase(repository)
        actor = use_case.execute(
            first_name=request.first_name,
            last_name=request.last_name
        )
        logger.info(f"アクターを作成しました: ID={actor.actor_id}")
        return ActorResponse(
            actor_id=actor.actor_id,
            first_name=actor.first_name,
            last_name=actor.last_name,
            last_update=actor.last_update.isoformat(),
            delete_flag=actor.delete_flag
        )
    except ValidationError as e:
        logger.warning(f"アクター作成の検証エラー: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"アクターの作成中にエラーが発生: {str(e)}", exc_info=True)
        raise DatabaseError(f"アクターの作成中にエラーが発生しました: {str(e)}") from e


@router.get("/{actor_id}", response_model=ActorResponse, status_code=status.HTTP_200_OK)
async def get_actor(
    actor_id: str,
    repository: ActorRepository = Depends(get_actor_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    指定された ID のアクターを取得するエンドポイント

    Args:
        actor_id: アクター ID
        repository: Actor リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Returns:
        ActorResponse: アクター情報

    Raises:
        HTTPException: アクターが見つからない場合またはデータベース操作に失敗した場合
    """
    try:
        logger.info(f"アクターの取得を開始: ID={actor_id}")
        use_case = GetActorByIdUseCase(repository)
        actor = use_case.execute(actor_id)
        logger.info(f"アクターを取得しました: ID={actor_id}")
        return ActorResponse(
            actor_id=str(actor.actor_id),
            first_name=actor.first_name,
            last_name=actor.last_name,
            last_update=actor.last_update.isoformat(),
            delete_flag=actor.delete_flag
        )
    except NotFoundError as e:
        logger.warning(f"アクターが見つかりません: ID={actor_id}")
        raise
    except Exception as e:
        logger.error(f"アクターの取得中にエラーが発生: ID={actor_id}, {str(e)}", exc_info=True)
        raise DatabaseError(f"アクターの取得中にエラーが発生しました: {str(e)}") from e


@router.put("/{actor_id}", response_model=ActorResponse, status_code=status.HTTP_200_OK)
async def update_actor(
    actor_id: str,
    request: ActorRequest,
    repository: ActorRepository = Depends(get_actor_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    アクターを更新するエンドポイント

    Args:
        actor_id: アクター ID
        request: アクター更新リクエスト
        repository: Actor リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Returns:
        ActorResponse: 更新されたアクター

    Raises:
        HTTPException: 検証エラー、アクターが見つからない場合、またはデータベース操作に失敗した場合
    """
    try:
        logger.info(f"アクターの更新を開始: ID={actor_id}")
        use_case = UpdateActorUseCase(repository)
        actor = use_case.execute(
            actor_id=actor_id,
            first_name=request.first_name,
            last_name=request.last_name
        )
        logger.info(f"アクターを更新しました: ID={actor_id}")
        return ActorResponse(
            actor_id=actor.actor_id,
            first_name=actor.first_name,
            last_name=actor.last_name,
            last_update=actor.last_update.isoformat(),
            delete_flag=actor.delete_flag
        )
    except ValidationError as e:
        logger.warning(f"アクター更新の検証エラー: ID={actor_id}, {str(e)}")
        raise
    except NotFoundError as e:
        logger.warning(f"アクターが見つかりません: ID={actor_id}")
        raise
    except Exception as e:
        logger.error(f"アクターの更新中にエラーが発生: ID={actor_id}, {str(e)}", exc_info=True)
        raise DatabaseError(f"アクターの更新中にエラーが発生しました: {str(e)}") from e


@router.delete("/{actor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_actor(
    actor_id: str,
    repository: ActorRepository = Depends(get_actor_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    アクターを削除するエンドポイント（論理削除）

    Args:
        actor_id: アクター ID
        repository: Actor リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Raises:
        HTTPException: アクターが見つからない場合またはデータベース操作に失敗した場合
    """
    try:
        logger.info(f"アクターの削除を開始: ID={actor_id}")
        use_case = DeleteActorUseCase(repository)
        use_case.execute(actor_id)
        logger.info(f"アクターを削除しました: ID={actor_id}")
    except NotFoundError as e:
        logger.warning(f"アクターが見つかりません: ID={actor_id}")
        raise
    except Exception as e:
        logger.error(f"アクターの削除中にエラーが発生: ID={actor_id}, {str(e)}", exc_info=True)
        raise DatabaseError(f"アクターの削除中にエラーが発生しました: {str(e)}") from e
