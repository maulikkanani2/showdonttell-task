from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import DinersList
from utils import load_data
from routes import router

app = FastAPI(title="French Laudure Morning Huddle API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    diners_data = load_data("fine-dining-dataset.json")
except Exception as e:
    print(f"[ERROR] Failed to load diner data: {e}")
    diners_data = DinersList(diners=[])

app.include_router(router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to French Laudure Morning Huddle API"}
