from fastapi import HTTPException, APIRouter
from app.database import get_database
from pymongo.errors import PyMongoError
from bson import ObjectId
from app.models.users import User
from app.models.budgets import Budget

userCollection = get_database()["users"]
print(userCollection)

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/get_user/{user_id}")
def get_user_by_id(user_id: str):
    try:
        result = userCollection.find_one({"_id": user_id})
        if result:
            result.setdefault("budgets", [])  # ✅ avoid crash on missing
            return result
        else:
            raise HTTPException(status_code=404, detail="Item not found")
    except PyMongoError as e:
        print(f"Database Error: {e}")  # ✅ Log the real error

        raise HTTPException(status_code=500, detail="Database query failed")

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
    
@router.put("/update_user/{user_id}")
def update_user_by_id(user_id: str, budget: Budget):
    try:
        result = userCollection.find_one({"_id": user_id})
        if result:
            budget_dict = budget.model_dump(by_alias=True)
            updated_item = userCollection.update_one(
                {"_id": user_id},
                {"$addToSet": {"budgets": {"id": budget_dict["id"], "category": budget_dict["category"], "amount": budget_dict["amount"], "limit": budget_dict["limit"], 'length': budget_dict['length'], 'recurring': budget_dict['recurring']}}}
            )
            if updated_item.modified_count == 1:
                return {"message": "Item updated successfully!"}
            else:
                raise HTTPException(status_code=400, detail="Failed to update item")
        else:
            # Item not found
            raise HTTPException(status_code=404, detail="Item not found")
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail="Database update failed")
    

@router.put("/update_username/{user_id}")
def update_user_by_id(user_id: str, username: str):
    try:
        result = userCollection.find_one({"_id": user_id})
        if result:
            updated_item = userCollection.update_one(
                {"_id": user_id},
                {"$set": {"username": username}}
            )
            if updated_item.modified_count == 1:
                return {"message": "Item updated successfully!"}
            else:
                raise HTTPException(status_code=400, detail="Failed to update item")
        else:
            # Item not found
            raise HTTPException(status_code=404, detail="Item not found")
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail="Database update failed")
    

@router.put("/update_budget/{user_id}/{budget_id}")
def update_budget_by_id(user_id: str, budget: Budget, budget_id: int):
    try:
        result = userCollection.find_one({"_id": user_id})
        if result:
            budget_dict = budget.model_dump(by_alias=True)
            
            updated_item = userCollection.update_one(
                {"_id": user_id, "budgets.id" : budget_id},
                {
                "$set": {
                    "budgets.$.category": budget_dict["category"],
                    "budgets.$.amount": budget_dict["amount"],
                    "budgets.$.limit": budget_dict["limit"],
                    "budgets.$.length": budget_dict["length"],
                    "budgets.$.recurring": budget_dict["recurring"],
                }
            }
            )
            if updated_item.modified_count == 1:
                return {"message": "Item updated successfully!"}
            else:
                raise HTTPException(status_code=400, detail="Failed to update item")
        else:
            # Item not found
            raise HTTPException(status_code=404, detail="Item not found")
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail="Database update failed")
    
    
