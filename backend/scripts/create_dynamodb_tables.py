"""DynamoDB テーブル作成スクリプト

Films と Actors テーブルを作成し、delete_flag-index GSI を設定します。
"""
import boto3
from botocore.exceptions import ClientError
import sys
import os

# backend ディレクトリをパスに追加
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.config.settings import settings


def create_films_table(dynamodb):
    """Films テーブルを作成"""
    try:
        table = dynamodb.create_table(
            TableName=settings.dynamodb_films_table,
            KeySchema=[
                {
                    'AttributeName': 'film_id',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'film_id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'delete_flag',
                    'AttributeType': 'N'  # DynamoDB では boolean は数値として扱う
                }
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'delete_flag-index',
                    'KeySchema': [
                        {
                            'AttributeName': 'delete_flag',
                            'KeyType': 'HASH'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        
        # テーブルが作成されるまで待機
        table.wait_until_exists()
        print(f"✓ Films テーブル '{settings.dynamodb_films_table}' を作成しました")
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"! Films テーブル '{settings.dynamodb_films_table}' は既に存在します")
            return True
        else:
            print(f"✗ Films テーブルの作成に失敗しました: {e.response['Error']['Message']}")
            return False


def create_actors_table(dynamodb):
    """Actors テーブルを作成"""
    try:
        table = dynamodb.create_table(
            TableName=settings.dynamodb_actors_table,
            KeySchema=[
                {
                    'AttributeName': 'actor_id',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'actor_id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'delete_flag',
                    'AttributeType': 'N'  # DynamoDB では boolean は数値として扱う
                }
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'delete_flag-index',
                    'KeySchema': [
                        {
                            'AttributeName': 'delete_flag',
                            'KeyType': 'HASH'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        
        # テーブルが作成されるまで待機
        table.wait_until_exists()
        print(f"✓ Actors テーブル '{settings.dynamodb_actors_table}' を作成しました")
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"! Actors テーブル '{settings.dynamodb_actors_table}' は既に存在します")
            return True
        else:
            print(f"✗ Actors テーブルの作成に失敗しました: {e.response['Error']['Message']}")
            return False


def main():
    """メイン処理"""
    print("DynamoDB テーブル作成スクリプト")
    print("=" * 50)
    print(f"リージョン: {settings.aws_region}")
    
    # DynamoDB クライアントを初期化
    dynamodb_config = {
        'region_name': settings.aws_region
    }
    
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        dynamodb_config['aws_access_key_id'] = settings.aws_access_key_id
        dynamodb_config['aws_secret_access_key'] = settings.aws_secret_access_key
    
    if settings.dynamodb_endpoint_url:
        dynamodb_config['endpoint_url'] = settings.dynamodb_endpoint_url
        print(f"エンドポイント: {settings.dynamodb_endpoint_url}")
    
    print("=" * 50)
    print()
    
    try:
        dynamodb = boto3.resource('dynamodb', **dynamodb_config)
        
        # Films テーブルを作成
        films_success = create_films_table(dynamodb)
        
        # Actors テーブルを作成
        actors_success = create_actors_table(dynamodb)
        
        print()
        print("=" * 50)
        if films_success and actors_success:
            print("✓ すべてのテーブルが正常に作成されました")
            return 0
        else:
            print("✗ 一部のテーブルの作成に失敗しました")
            return 1
    except Exception as e:
        print(f"✗ エラーが発生しました: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
