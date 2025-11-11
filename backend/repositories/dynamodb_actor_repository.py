"""DynamoDB を使用した Actor リポジトリの実装"""
from datetime import datetime
from typing import List, Optional
import boto3
from botocore.exceptions import ClientError

from backend.entities.actor import Actor
from backend.repositories.actor_repository import ActorRepository
from backend.config.settings import settings


class DynamoDBActorRepository(ActorRepository):
    """DynamoDB を使用した Actor リポジトリの実装"""

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
        self.table = self.dynamodb.Table(settings.dynamodb_actors_table)

    def _entity_to_item(self, actor: Actor) -> dict:
        """Actor エンティティを DynamoDB アイテムに変換"""
        return {
            'actor_id': actor.actor_id,
            'first_name': actor.first_name,
            'last_name': actor.last_name,
            'last_update': actor.last_update.isoformat(),
            'delete_flag': actor.delete_flag
        }

    def _item_to_entity(self, item: dict) -> Actor:
        """DynamoDB アイテムを Actor エンティティに変換"""
        return Actor(
            actor_id=item['actor_id'],
            first_name=item['first_name'],
            last_name=item['last_name'],
            last_update=datetime.fromisoformat(item['last_update']),
            delete_flag=item.get('delete_flag', False)
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
        try:
            item = self._entity_to_item(actor)
            self.table.put_item(Item=item)
            return actor
        except ClientError as e:
            raise Exception(f"Failed to create actor: {e.response['Error']['Message']}") from e

    def get_all(self) -> List[Actor]:
        """
        削除されていない全ての Actor を取得する (delete_flag=False)

        Returns:
            Actor エンティティのリスト

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
            
            actors = [self._item_to_entity(item) for item in response.get('Items', [])]
            
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
                actors.extend([self._item_to_entity(item) for item in response.get('Items', [])])
            
            return actors
        except ClientError as e:
            raise Exception(f"Failed to get all actors: {e.response['Error']['Message']}") from e

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
        try:
            response = self.table.get_item(Key={'actor_id': actor_id})
            item = response.get('Item')
            
            if item is None:
                return None
            
            return self._item_to_entity(item)
        except ClientError as e:
            raise Exception(f"Failed to get actor by id: {e.response['Error']['Message']}") from e

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
        try:
            item = self._entity_to_item(actor)
            self.table.put_item(Item=item)
            return actor
        except ClientError as e:
            raise Exception(f"Failed to update actor: {e.response['Error']['Message']}") from e

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
        try:
            # まず Actor が存在するか確認
            actor = self.get_by_id(actor_id)
            if actor is None:
                return False
            
            # delete_flag を True に更新
            self.table.update_item(
                Key={'actor_id': actor_id},
                UpdateExpression='SET delete_flag = :flag, last_update = :update',
                ExpressionAttributeValues={
                    ':flag': True,
                    ':update': datetime.now().isoformat()
                }
            )
            return True
        except ClientError as e:
            raise Exception(f"Failed to delete actor: {e.response['Error']['Message']}") from e
