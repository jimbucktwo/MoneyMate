from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import app.routers.users as users


app = FastAPI()

app.include_router(users.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
@app.get("/")
def read_root():
    return {"Hello": "World"}