"""SQLAlchemy ORM モデル定義"""
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class FilmModel(Base):
    """Film テーブルの ORM モデル"""
    __tablename__ = 'films'

    film_id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    image_path = Column(String(500), nullable=True)
    release_year = Column(Integer, nullable=True)
    rating = Column(
        Enum('G', 'PG', 'PG-13', 'R', 'NC-17', name='rating_enum'),
        nullable=False
    )
    last_update = Column(
        DateTime,
        nullable=False,
        default=datetime.now,
        onupdate=datetime.now
    )
    delete_flag = Column(Boolean, nullable=False, default=False, index=True)


class ActorModel(Base):
    """Actor テーブルの ORM モデル"""
    __tablename__ = 'actors'

    actor_id = Column(String(36), primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    last_update = Column(
        DateTime,
        nullable=False,
        default=datetime.now,
        onupdate=datetime.now
    )
    delete_flag = Column(Boolean, nullable=False, default=False, index=True)
