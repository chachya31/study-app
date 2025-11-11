"""Actor コントローラー"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.repositories.actor_repository import ActorRepository
from backend.controllers.dependencies import get_actor_repository
from backend.services.auth_middleware import get_current_user
from backend.use_cases.create_actor_use_case import CreateActorUseCase
from backend.use_cases.get_actors_use_case import GetActorsUseCase
from backend.use_cases.get_actor_by_id_use_case import GetActorByIdUseCase
from backend.use_cases.update_actor_use_case import UpdateActorUseCase
from backend.use_cases.delete_actor_use_case import DeleteActorUseCase
from backend.exceptions import ValidationError, NotFoundError


router = APIRouter(prefix="/api/actors", tags=["actors"])


class ActorRequest(BaseModel):
    """Actor 作成・更新リクエストモデル"""
    first_name: str
    last_name: str


class ActorResponse(BaseModel):
    """Actor レスポンスモデル"""
    actor_id: str
    first_name: str
    last_name: str
    last_update: str
    delete_flag: bool

    class Config:
        from_attributes = True


@router.get("", response_model=List[ActorResponse], status_code=status.HTTP_200_OK)
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
        use_case = GetActorsUseCase(repository)
        actors = use_case.execute()
        return [
            ActorResponse(
                actor_id=actor.actor_id,
                first_name=actor.first_name,
                last_name=actor.last_name,
                last_update=actor.last_update.isoformat(),
                delete_flag=actor.delete_flag
            )
            for actor in actors
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"アクターの取得中にエラーが発生しました: {str(e)}"
        )


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
        use_case = CreateActorUseCase(repository)
        actor = use_case.execute(
            first_name=request.first_name,
            last_name=request.last_name
        )
        return ActorResponse(
            actor_id=actor.actor_id,
            first_name=actor.first_name,
            last_name=actor.last_name,
            last_update=actor.last_update.isoformat(),
            delete_flag=actor.delete_flag
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"アクターの作成中にエラーが発生しました: {str(e)}"
        )


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
        use_case = GetActorByIdUseCase(repository)
        actor = use_case.execute(actor_id)
        return ActorResponse(
            actor_id=actor.actor_id,
            first_name=actor.first_name,
            last_name=actor.last_name,
            last_update=actor.last_update.isoformat(),
            delete_flag=actor.delete_flag
        )
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"アクターの取得中にエラーが発生しました: {str(e)}"
        )


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
        use_case = UpdateActorUseCase(repository)
        actor = use_case.execute(
            actor_id=actor_id,
            first_name=request.first_name,
            last_name=request.last_name
        )
        return ActorResponse(
            actor_id=actor.actor_id,
            first_name=actor.first_name,
            last_name=actor.last_name,
            last_update=actor.last_update.isoformat(),
            delete_flag=actor.delete_flag
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"アクターの更新中にエラーが発生しました: {str(e)}"
        )


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
        use_case = DeleteActorUseCase(repository)
        use_case.execute(actor_id)
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"アクターの削除中にエラーが発生しました: {str(e)}"
        )
