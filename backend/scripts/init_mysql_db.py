"""MySQL データベース初期化スクリプト"""
import sys
from pathlib import Path

# プロジェクトルートをパスに追加
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import create_engine
from backend.repositories.models import Base
from backend.config.settings import settings


def init_database():
    """データベースを初期化してテーブルを作成"""
    try:
        print(f"Connecting to MySQL database: {settings.mysql_host}/{settings.mysql_database}")
        engine = create_engine(settings.mysql_url, echo=True)

        print("Creating tables...")
        Base.metadata.create_all(bind=engine)

        print("Database initialization completed successfully!")
        return True
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        return False


if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
