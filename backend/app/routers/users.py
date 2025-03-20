from fastapi import HTTPException, APIRouter
from app.database import get_database
from pymongo.errors import PyMongoError
from bson import ObjectId
from models.users import User

userCollection = get_database()["users"]
print(userCollection)

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/create_user", response_model=str, status_code=201)
def create_new_user(user: User):
    try:
        user_dict = user.model_dump(by_alias=True, exclude=["id"])
        user_dict["_id"] = user.id
        user_dict["budgets"] = []

        database_response = userCollection.insert_one(user_dict)
        print(f"\n\nNew User Added With ID : {database_response.inserted_id}\n\n")
        return database_response.inserted_id

    except PyMongoError as e:
        print(f"Database Insertion Error: {e}")
        raise HTTPException(status_code=500, detail="Database insertion failed")
    
    except Exception as e:
        print(f"Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")