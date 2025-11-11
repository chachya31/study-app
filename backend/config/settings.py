from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """アプリケーション設定"""
    
    # データベース設定
    database_type: str = "dynamodb"  # "dynamodb" or "mysql"
    
    # AWS 設定
    aws_region: str = "ap-northeast-1"
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    
    # AWS Cognito 設定
    cognito_user_pool_id: str
    cognito_client_id: str
    cognito_region: Optional[str] = None
    
    # DynamoDB 設定
    dynamodb_films_table: str = "Films"
    dynamodb_actors_table: str = "Actors"
    dynamodb_endpoint_url: Optional[str] = None  # ローカル開発用
    
    # MySQL 設定
    mysql_host: Optional[str] = None
    mysql_port: int = 3306
    mysql_database: Optional[str] = None
    mysql_user: Optional[str] = None
    mysql_password: Optional[str] = None
    
    # CORS 設定
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    
    # アプリケーション設定
    app_name: str = "Film Actor Management API"
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def cors_origins_list(self) -> list[str]:
        """CORS オリジンをリストとして返す"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def mysql_url(self) -> str:
        """MySQL 接続 URL を生成"""
        if not all([self.mysql_host, self.mysql_database, self.mysql_user, self.mysql_password]):
            raise ValueError("MySQL configuration is incomplete")
        return f"mysql+pymysql://{self.mysql_user}:{self.mysql_password}@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"


# グローバル設定インスタンス
settings = Settings()
