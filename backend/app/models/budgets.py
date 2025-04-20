from pydantic import BaseModel, Field
from bson import ObjectId


class Budget(BaseModel):
    id: int
    category: str
    amount: float
    limit: float
    length: int
    recurring: bool