from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_DB_URI"))
db = client["MoneyMate"]  # or whatever your DB name is
collection = db["users"]

# 🔍 Print all user IDs and usernames
for user in collection.find({}, {"_id": 1, "username": 1, "budgets": 1}):
    print(user)
