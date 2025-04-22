from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime
import json
import os

class Review(BaseModel):
    restaurant_name: str
    date: date
    rating: int = Field(..., ge=1, le=5)
    content: str

class Order(BaseModel):
    item: str
    dietary_tags: List[str]
    price: float

class Reservation(BaseModel):
    date: date
    number_of_people: int
    orders: List[Order]

class Email(BaseModel):
    date: date
    subject: str
    combined_thread: str

class Diner(BaseModel):
    name: str
    reviews: Optional[List[Review]] = None
    reservations: Optional[List[Reservation]] = None
    emails: Optional[List[Email]] = None

class DinersList(BaseModel):
    diners: List[Diner]

    @classmethod
    def load_from_json(cls, json_path: str) -> "DinersList":
        with open(json_path) as f:
            data = json.load(f)

        for diner in data["diners"]:
            if diner.get("reviews"):
                for review in diner["reviews"]:
                    review["date"] = datetime.strptime(review["date"], "%Y-%m-%d").date()
            if diner.get("reservations"):
                for reservation in diner["reservations"]:
                    reservation["date"] = datetime.strptime(reservation["date"], "%Y-%m-%d").date()
            if diner.get("emails"):
                for email in diner["emails"]:
                    email["date"] = datetime.strptime(email["date"], "%Y-%m-%d").date()

        return cls(**data)

class GuestInsight(BaseModel):
    name: str
    number_of_people: int
    orders: List[Order]
    diet_preferences: List[str]
    previous_visits: bool
    previous_ratings: Optional[float] = None
    special_requests: Optional[str] = None
    vip_status: bool = False
    special_occasion: Optional[str] = None

class MorningHuddle(BaseModel):
    date: str
    total_guests: int
    total_reservations: int
    guest_insights: List[GuestInsight]
    menu_items_ordered: dict

#Load diners_data on import
try:
    DATA_PATH = os.path.join(os.path.dirname(__file__), "fine-dining-dataset.json")
    diners_data = DinersList.load_from_json(DATA_PATH)
except FileNotFoundError:
    diners_data = DinersList(diners=[])
    print("⚠️  Warning: fine-dining-dataset.json not found. Using empty dataset.")
