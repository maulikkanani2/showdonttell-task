import React from 'react';
import './reservationList.css';


function ReservationList({ guests, onSelectGuest, selectedGuest }) {
  const sortedGuests = [...guests].sort((a, b) => {
    if (a.vip_status && !b.vip_status) return -1;
    if (!a.vip_status && b.vip_status) return 1;
    
    if (a.special_occasion && !b.special_occasion) return -1;
    if (!a.special_occasion && b.special_occasion) return 1;
    
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="reservation-list">
      <h2>Today's Guests</h2>
      <div className="guest-list">
        {sortedGuests.map((guest, index) => (
          <div 
            key={index}
            className={`guest-card ${selectedGuest && selectedGuest.name === guest.name ? 'selected' : ''} ${guest.vip_status ? 'vip' : ''}`}
            onClick={() => onSelectGuest(guest)}
          >
            <div className="guest-header">
              <h3>{guest.name}</h3>
              <span className="party-size">Party of {guest.number_of_people}</span>
            </div>
            
            <div className="guest-highlights">
              {guest.vip_status && <span className="highlight vip">VIP</span>}
              {guest.special_occasion && <span className="highlight occasion">{guest.special_occasion}</span>}
              {guest.previous_visits && <span className="highlight returning">Returning</span>}
              {guest.diet_preferences.length > 0 && <span className="highlight dietary">Dietary Needs</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReservationList;