from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

def get_database():
    uri = os.getenv('MONGO_DB_URI')
    client = MongoClient(uri, server_api=ServerApi(version='1'))
    return client["MoneyMate"]

collection = get_database()["users"]
print(collection.find_one())