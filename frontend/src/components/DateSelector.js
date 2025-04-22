import React from 'react';

function DateSelector({ onDateChange, currentDate }) {
  const formatDateForInput = (date) => {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    onDateChange(newDate);
  };

  return (
    <div className="date-selector">
      <div className="date-controls">
        <input
          type="date"
          value={formatDateForInput(currentDate)}
          onChange={handleDateChange}
          className="date-input"
        />
        <button
          onClick={() => onDateChange(formatDateForInput(new Date()))}
          className="today-button"
        >
          Today
        </button>
      </div>
    </div>
  );
}

export default DateSelector;
