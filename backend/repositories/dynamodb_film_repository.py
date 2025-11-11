"""DynamoDB を使用した Film リポジトリの実装"""
from datetime import datetime
from typing import List, Optional
import boto3
from botocore.exceptions import ClientError

from backend.entities.film import Film
from backend.entities.rating import Rating
from backend.repositories.film_repository import FilmRepository
from backend.config.settings import settings


class DynamoDBFilmRepository(FilmRepository):
    """DynamoDB を使用した Film リポジトリの実装"""

    def __init__(self):
        """DynamoDB クライアントを初期化"""
        dynamodb_config = {
            'region_name': settings.aws_region
        }
        
        if settings.aws_access_key_id and settings.aws_secret_access_key:
            dynamodb_config['aws_access_key_id'] = settings.aws_access_key_id
            dynamodb_config['aws_secret_access_key'] = settings.aws_secret_access_key
        
        if settings.dynamodb_endpoint_url:
            dynamodb_config['endpoint_url'] = settings.dynamodb_endpoint_url
        
        self.dynamodb = boto3.resource('dynamodb', **dynamodb_config)
        self.table = self.dynamodb.Table(settings.dynamodb_films_table)

    def _entity_to_item(self, film: Film) -> dict:
        """Film エンティティを DynamoDB アイテムに変換"""
        item = {
            'film_id': film.film_id,
            'title': film.title,
            'rating': film.rating.value,
            'last_update': film.last_update.isoformat(),
            'delete_flag': film.delete_flag
        }
        
        if film.description is not None:
            item['description'] = film.description
        if film.image_path is not None:
            item['image_path'] = film.image_path
        if film.release_year is not None:
            item['release_year'] = film.release_year
        
        return item

    def _item_to_entity(self, item: dict) -> Film:
        """DynamoDB アイテムを Film エンティティに変換"""
        release_year = item.get('release_year')
        return Film(
            film_id=item['film_id'],
            title=item['title'],
            rating=Rating(item['rating']),
            last_update=datetime.fromisoformat(item['last_update']),
            description=item.get('description'),
            image_path=item.get('image_path'),
            release_year=int(release_year) if release_year is not None else None,
            delete_flag=item.get('delete_flag', False)
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
        try:
            item = self._entity_to_item(film)
            self.table.put_item(Item=item)
            return film
        except ClientError as e:
            raise Exception(f"Failed to create film: {e.response['Error']['Message']}") from e

    def get_all(self) -> List[Film]:
        """
        削除されていない全ての Film を取得する (delete_flag=False)

        Returns:
            Film エンティティのリスト

        Raises:
            Exception: データベース操作に失敗した場合
        """
        try:
            # delete_flag-index GSI を使用してクエリ
            response = self.table.query(
                IndexName='delete_flag-index',
                KeyConditionExpression='delete_flag = :flag',
                ExpressionAttributeValues={
                    ':flag': False
                }
            )
            
            films = [self._item_to_entity(item) for item in response.get('Items', [])]
            
            # ページネーションがある場合は続きを取得
            while 'LastEvaluatedKey' in response:
                response = self.table.query(
                    IndexName='delete_flag-index',
                    KeyConditionExpression='delete_flag = :flag',
                    ExpressionAttributeValues={
                        ':flag': False
                    },
                    ExclusiveStartKey=response['LastEvaluatedKey']
                )
                films.extend([self._item_to_entity(item) for item in response.get('Items', [])])
            
            return films
        except ClientError as e:
            raise Exception(f"Failed to get all films: {e.response['Error']['Message']}") from e

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
        try:
            response = self.table.get_item(Key={'film_id': film_id})
            item = response.get('Item')
            
            if item is None:
                return None
            
            return self._item_to_entity(item)
        except ClientError as e:
            raise Exception(f"Failed to get film by id: {e.response['Error']['Message']}") from e

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
        try:
            item = self._entity_to_item(film)
            self.table.put_item(Item=item)
            return film
        except ClientError as e:
            raise Exception(f"Failed to update film: {e.response['Error']['Message']}") from e

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
        try:
            # まず Film が存在するか確認
            film = self.get_by_id(film_id)
            if film is None:
                return False
            
            # delete_flag を True に更新
            self.table.update_item(
                Key={'film_id': film_id},
                UpdateExpression='SET delete_flag = :flag, last_update = :update',
                ExpressionAttributeValues={
                    ':flag': True,
                    ':update': datetime.now().isoformat()
                }
            )
            return True
        except ClientError as e:
            raise Exception(f"Failed to delete film: {e.response['Error']['Message']}") from e
