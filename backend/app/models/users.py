from pydantic import BaseModel, Field
from bson import ObjectId


class User(BaseModel):
    id: str
    username: str
    firstName: str
    lastName: str
    email: str