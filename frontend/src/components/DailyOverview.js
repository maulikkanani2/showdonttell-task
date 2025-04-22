import React from 'react';
import { format, isToday, parseISO } from 'date-fns';

function DailyOverview({ data }) {
  const vipCount = data.guest_insights.filter(guest => guest.vip_status).length;
  const specialOccasions = data.guest_insights.filter(guest => guest.special_occasion).length;
  
  const dietaryNeeds = new Set();
  data.guest_insights.forEach(guest => {
    guest.diet_preferences.forEach(pref => dietaryNeeds.add(pref));
  });

  const formatDisplayDate = (dateString) => {
    const date = parseISO(dateString);
    const formattedDate = format(date, 'MMMM d, yyyy');
    return isToday(date) ? `Today (${formattedDate})` : formattedDate;
  };

  return (
    <div className="daily-overview">
      <h2>{formatDisplayDate(data.date)} Overview</h2>
      <div className="stats-container">
        <div className="stat-box">
          <h3>Reservations</h3>
          <p className="stat-number">{data.total_reservations}</p>
        </div>
        <div className="stat-box">
          <h3>Guests</h3>
          <p className="stat-number">{data.total_guests}</p>
        </div>
        <div className="stat-box">
          <h3>VIPs</h3>
          <p className="stat-number">{vipCount}</p>
        </div>
        <div className="stat-box">
          <h3>Special Occasions</h3>
          <p className="stat-number">{specialOccasions}</p>
        </div>
      </div>
      
      {dietaryNeeds.size > 0 && (
        <div className="dietary-summary">
          <h3>Dietary Considerations</h3>
          <div className="tag-container">
            {Array.from(dietaryNeeds).map(diet => (
              <span key={diet} className="diet-tag">{diet}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyOverview;