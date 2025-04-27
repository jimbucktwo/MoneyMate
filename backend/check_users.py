from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Connect to MongoDB using your existing URI
client = MongoClient(os.getenv("MONGO_DB_URI"))

# Select your DB and collection
db = client["MoneyMate"]   # <-- change if your DB name is different
collection = db["users"]

# Find all users and print their IDs and budgets
for user in collection.find({}, {"_id": 1, "username": 1, "budgets": 1}):
    print("\n🧾 USER DOCUMENT:")
    print("ID:", user["_id"])
    print("Username:", user.get("username"))
    print("Budgets:")
    for budget in user.get("budgets", []):
        print("   ", budget)
