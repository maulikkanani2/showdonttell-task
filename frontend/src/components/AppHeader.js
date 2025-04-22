import React from 'react';
import { format } from 'date-fns';
import './AppHeader.css';


function AppHeader({ selectedDate, onDateChange }) {
  const handleTodayClick = (e) => {
    e.preventDefault();
    const today = format(new Date(), 'yyyy-MM-dd');
    onDateChange({ target: { value: today } });
  };

  return (
    <header className="app-header">
      <div className="logo">
        <h1>French Laudure</h1>
        <h2>Morning Huddle</h2>
      </div>
      <div className="date-controls">
        <input
          type="date"
          value={selectedDate}
          onChange={onDateChange}
          className="date-input"
        />
        <button onClick={handleTodayClick} className="today-button">
          Today
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
