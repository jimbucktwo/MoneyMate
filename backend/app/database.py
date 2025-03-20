from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

def get_database():
    uri = os.getenv('MONGO_DB_URI')
    client = MongoClient(uri, server_api=ServerApi(version='1'))
    return client["MoneyMate"]

collection = get_database()["users"]
