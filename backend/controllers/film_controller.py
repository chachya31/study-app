"""Film コントローラー"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.entities.rating import Rating
from backend.repositories.film_repository import FilmRepository
from backend.controllers.dependencies import get_film_repository
from backend.services.auth_middleware import get_current_user
from backend.use_cases.create_film_use_case import CreateFilmUseCase
from backend.use_cases.get_films_use_case import GetFilmsUseCase
from backend.use_cases.get_film_by_id_use_case import GetFilmByIdUseCase
from backend.use_cases.update_film_use_case import UpdateFilmUseCase
from backend.use_cases.delete_film_use_case import DeleteFilmUseCase
from backend.exceptions import ValidationError, NotFoundError


router = APIRouter(prefix="/api/films", tags=["films"])


class FilmRequest(BaseModel):
    """Film 作成・更新リクエストモデル"""
    title: str
    rating: Rating
    description: Optional[str] = None
    image_path: Optional[str] = None
    release_year: Optional[int] = None


class FilmResponse(BaseModel):
    """Film レスポンスモデル"""
    film_id: str
    title: str
    rating: Rating
    description: Optional[str] = None
    image_path: Optional[str] = None
    release_year: Optional[int] = None
    last_update: str
    delete_flag: bool

    class Config:
        from_attributes = True


class FilmsListResponse(BaseModel):
    """Films リストレスポンスモデル"""
    films: List[FilmResponse]


@router.get("", response_model=FilmsListResponse, status_code=status.HTTP_200_OK)
async def get_films(
    repository: FilmRepository = Depends(get_film_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    全映画を取得するエンドポイント

    Args:
        repository: Film リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Returns:
        FilmsListResponse: 映画のリスト

    Raises:
        HTTPException: データベース操作に失敗した場合
    """
    try:
        use_case = GetFilmsUseCase(repository)
        films = use_case.execute()
        film_responses = [
            FilmResponse(
                film_id=str(film.film_id),
                title=film.title,
                rating=film.rating,
                description=film.description,
                image_path=film.image_path,
                release_year=film.release_year,
                last_update=film.last_update.isoformat(),
                delete_flag=film.delete_flag
            )
            for film in films
        ]
        return FilmsListResponse(films=film_responses)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"映画の取得中にエラーが発生しました: {str(e)}"
        )


@router.post("", response_model=FilmResponse, status_code=status.HTTP_201_CREATED)
async def create_film(
    request: FilmRequest,
    repository: FilmRepository = Depends(get_film_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    映画を作成するエンドポイント

    Args:
        request: 映画作成リクエスト
        repository: Film リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Returns:
        FilmResponse: 作成された映画

    Raises:
        HTTPException: 検証エラーまたはデータベース操作に失敗した場合
    """
    try:
        use_case = CreateFilmUseCase(repository)
        film = use_case.execute(
            title=request.title,
            rating=request.rating,
            description=request.description,
            image_path=request.image_path,
            release_year=request.release_year
        )
        return FilmResponse(
            film_id=film.film_id,
            title=film.title,
            rating=film.rating,
            description=film.description,
            image_path=film.image_path,
            release_year=film.release_year,
            last_update=film.last_update.isoformat(),
            delete_flag=film.delete_flag
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"映画の作成中にエラーが発生しました: {str(e)}"
        )


@router.get("/{film_id}", response_model=FilmResponse, status_code=status.HTTP_200_OK)
async def get_film(
    film_id: str,
    repository: FilmRepository = Depends(get_film_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    指定された ID の映画を取得するエンドポイント

    Args:
        film_id: 映画 ID
        repository: Film リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Returns:
        FilmResponse: 映画情報

    Raises:
        HTTPException: 映画が見つからない場合またはデータベース操作に失敗した場合
    """
    try:
        use_case = GetFilmByIdUseCase(repository)
        film = use_case.execute(film_id)
        return FilmResponse(
            film_id=film.film_id,
            title=film.title,
            rating=film.rating,
            description=film.description,
            image_path=film.image_path,
            release_year=film.release_year,
            last_update=film.last_update.isoformat(),
            delete_flag=film.delete_flag
        )
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"映画の取得中にエラーが発生しました: {str(e)}"
        )


@router.put("/{film_id}", response_model=FilmResponse, status_code=status.HTTP_200_OK)
async def update_film(
    film_id: str,
    request: FilmRequest,
    repository: FilmRepository = Depends(get_film_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    映画を更新するエンドポイント

    Args:
        film_id: 映画 ID
        request: 映画更新リクエスト
        repository: Film リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Returns:
        FilmResponse: 更新された映画

    Raises:
        HTTPException: 検証エラー、映画が見つからない場合、またはデータベース操作に失敗した場合
    """
    try:
        use_case = UpdateFilmUseCase(repository)
        film = use_case.execute(
            film_id=film_id,
            title=request.title,
            rating=request.rating,
            description=request.description,
            image_path=request.image_path,
            release_year=request.release_year
        )
        return FilmResponse(
            film_id=film.film_id,
            title=film.title,
            rating=film.rating,
            description=film.description,
            image_path=film.image_path,
            release_year=film.release_year,
            last_update=film.last_update.isoformat(),
            delete_flag=film.delete_flag
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
            detail=f"映画の更新中にエラーが発生しました: {str(e)}"
        )


@router.delete("/{film_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_film(
    film_id: str,
    repository: FilmRepository = Depends(get_film_repository),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    映画を削除するエンドポイント（論理削除）

    Args:
        film_id: 映画 ID
        repository: Film リポジトリ
        current_user: 現在のユーザー情報（認証済み）

    Raises:
        HTTPException: 映画が見つからない場合またはデータベース操作に失敗した場合
    """
    try:
        use_case = DeleteFilmUseCase(repository)
        use_case.execute(film_id)
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"映画の削除中にエラーが発生しました: {str(e)}"
        )
