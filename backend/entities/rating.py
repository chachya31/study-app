from enum import Enum


class Rating(str, Enum):
    """映画のレーティングを表す列挙型"""
    G = "G"
    PG = "PG"
    PG_13 = "PG-13"
    R = "R"
    NC_17 = "NC-17"
