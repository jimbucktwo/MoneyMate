from pydantic import BaseModel, Field
from bson import ObjectId


class Budget(BaseModel):
    id: str
    category: str
    amount: float
    limit: float