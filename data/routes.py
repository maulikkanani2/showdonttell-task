from fastapi import APIRouter, HTTPException
from datetime import datetime, date
from typing import Optional
from models import MorningHuddle, GuestInsight,diners_data
from fastapi.responses import JSONResponse


router = APIRouter()

@router.get("/api/welcome")
async def welcome():
    return JSONResponse(content={
        "message": "Welcome to this Morning Huddle"
    })

@router.get("/api/huddle/", response_model=MorningHuddle)
@router.get("/api/huddle/{target_date}", response_model=MorningHuddle)
def get_morning_huddle(target_date: Optional[str] = None):
    if target_date is None:
        parsed_date = date.today()
    else:
        try:
            parsed_date = datetime.strptime(target_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    date_str = parsed_date.strftime("%Y-%m-%d")
    guests_today = []
    menu_items = {}
    total_guests = 0

    for diner in diners_data.diners:
        if not diner.reservations:
            continue

        todays_reservations = []
        for r in diner.reservations:
            res_date = r.date
            if isinstance(res_date, str):
                try:
                    res_date = datetime.strptime(res_date, "%Y-%m-%d").date()
                except ValueError:
                    continue
            if res_date == parsed_date:
                todays_reservations.append(r)

        if not todays_reservations:
            continue

        for reservation in todays_reservations:
            total_guests += reservation.number_of_people

            for order in reservation.orders:
                item_name = order.item
                if item_name in menu_items:
                    menu_items[item_name]["count"] += 1
                else:
                    menu_items[item_name] = {
                        "count": 1,
                        "price": order.price,
                        "dietary_tags": order.dietary_tags
                    }

            previous_visits = False
            avg_rating = None
            if diner.reviews:
                reviews = [r for r in diner.reviews if r.restaurant_name == "French Laudure"]
                if reviews:
                    previous_visits = True
                    avg_rating = sum(r.rating for r in reviews) / len(reviews)

            special_request = None
            special_occasion = None
            vip_status = False

            if diner.emails:
                relevant_emails = []
                for e in diner.emails:
                    email_date = e.date
                    if isinstance(email_date, str):
                        try:
                            email_date = datetime.strptime(email_date, "%Y-%m-%d").date()
                        except ValueError:
                            continue
                    if abs((email_date - parsed_date).days) <= 7:
                        relevant_emails.append(e)

                for email in relevant_emails:
                    content = email.combined_thread.lower()
                    if any(x in content for x in ["allergy", "dietary", "gluten"]):
                        special_request = "Dietary needs mentioned in email"
                    if "birthday" in content:
                        special_occasion = "Birthday"
                    elif "anniversary" in content:
                        special_occasion = "Anniversary"
                    elif "celebration" in content:
                        special_occasion = "Celebration"
                    if any(x in content for x in ["vip", "private dining", "special table"]):
                        vip_status = True

            diet_preferences = []
            for order in reservation.orders:
                for tag in order.dietary_tags:
                    if tag not in diet_preferences:
                        diet_preferences.append(tag)

            guests_today.append(GuestInsight(
                name=diner.name,
                number_of_people=reservation.number_of_people,
                orders=reservation.orders,
                diet_preferences=diet_preferences,
                previous_visits=previous_visits,
                previous_ratings=avg_rating,
                special_requests=special_request,
                vip_status=vip_status,
                special_occasion=special_occasion
            ))

    if not guests_today:
        raise HTTPException(status_code=404, detail=f"No reservations found for {date_str}")

    return MorningHuddle(
        date=date_str,
        total_guests=total_guests,
        total_reservations=len(guests_today),
        guest_insights=guests_today,
        menu_items_ordered=menu_items
    )
