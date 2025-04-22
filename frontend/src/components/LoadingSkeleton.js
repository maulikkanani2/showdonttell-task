import React from 'react';

function LoadingSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header"></div>
      <div className="skeleton-overview">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-stat"></div>
        ))}
      </div>
      <div className="skeleton-list">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card"></div>
        ))}
      </div>
      <div className="skeleton-details"></div>
    </div>
  );
}

export default LoadingSkeleton;