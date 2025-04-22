import json
from datetime import datetime
from models import DinersList

def load_data(json_path: str) -> DinersList:
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

    return DinersList(**data)
