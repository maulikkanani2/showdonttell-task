import React from 'react';
import { AlertTriangle } from 'react-feather';

function ErrorState({ error, onRetry, onToday }) {
  return (
    <div className="error-state">
      <div className="error-icon">
        <AlertTriangle size={48} />
      </div>
      <h3>No reservations found for</h3>
      <p className="error-message">{error}</p>
      <div className="error-actions">
        <button className="btn-secondary" onClick={onRetry}>
          Try Again
        </button>
        <button className="btn-primary" onClick={onToday}>
          View Today
        </button>
      </div>
    </div>
  );
}

export default ErrorState;