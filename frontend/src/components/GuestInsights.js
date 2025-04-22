import React, { useMemo } from 'react';
import { Star, Heart, AlertCircle, Gift } from 'react-feather';
import './GuestInsights.css';



function GuestInsights({ guest, isToday }) {
  const dietaryTags = useMemo(() => {
    const tags = new Set();
    guest.orders.forEach(order => {
      order.dietary_tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [guest.orders]);

  const totalSpent = useMemo(() => {
    return guest.orders.reduce((sum, order) => sum + order.price, 0);
  }, [guest.orders]);

  return (
    <div className="guest-details card fade-in">
      <header className="guest-header">
        <h2>{guest.name}</h2>
        <div className="guest-meta">
          <span className="party-size">{guest.number_of_people} people</span>
          {guest.vip_status && (
            <span className="badge vip">
              <Star size={14} /> VIP
            </span>
          )}
          {guest.previous_visits && (
            <span className="badge returning">
              <Heart size={14} /> Returning
            </span>
          )}
        </div>
      </header>

      <div className="detail-section">
        <h3 className="section-title">Reservation Details</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Party Size</span>
            <span className="detail-value">{guest.number_of_people}</span>
          </div>
          {guest.reservation_time && (
            <div className="detail-item">
              <span className="detail-label">Time</span>
              <span className="detail-value">{guest.reservation_time}</span>
            </div>
          )}
          {guest.special_occasion && (
            <div className="detail-item">
              <span className="detail-label">Occasion</span>
              <span className="detail-value">
                <Gift size={16} /> {guest.special_occasion}
              </span>
            </div>
          )}
          {guest.previous_ratings && (
            <div className="detail-item">
              <span className="detail-label">Avg Rating</span>
              <span className="detail-value">
                {guest.previous_ratings.toFixed(1)}/5
              </span>
            </div>
          )}
        </div>
      </div>

      {dietaryTags.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Dietary Preferences</h3>
          <div className="tags-container">
            {dietaryTags.map((tag, index) => (
              <span key={index} className="tag dietary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {guest.special_requests && (
        <div className="detail-section alert">
          <h3 className="section-title">
            <AlertCircle size={18} /> Special Requests
          </h3>
          <p>{guest.special_requests}</p>
        </div>
      )}

      <div className="detail-section">
        <h3 className="section-title">Order Summary</h3>
        <div className="orders-list">
          {guest.orders.map((order, index) => (
            <div key={index} className="order-item">
              <div className="order-main">
                <span className="order-name">{order.item}</span>
                <span className="order-price">${order.price.toFixed(2)}</span>
              </div>
              {order.dietary_tags.length > 0 && (
                <div className="order-tags">
                  {order.dietary_tags.map((tag, i) => (
                    <span key={i} className="tag small">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="order-total">
            <span>Estimated Total</span>
            <span>${totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {isToday && guest.previous_visits && (
        <div className="detail-section personalization">
          <h3 className="section-title">Service Notes</h3>
          <ul className="notes-list">
            <li>Acknowledge as a returning guest</li>
            {guest.previous_ratings >= 4.5 && (
              <li>Previous high rating - ensure exceptional service</li>
            )}
            {guest.vip_status && <li>Provide VIP treatment</li>}
            {guest.special_occasion && (
              <li>Prepare for {guest.special_occasion.toLowerCase()} celebration</li>
            )}
            {guest.favorite_items?.length > 0 && (
              <li>
                Previously enjoyed: {guest.favorite_items.join(', ')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GuestInsights;