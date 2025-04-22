import React, { useEffect, useState } from 'react';

function Welcome({ onContinue }) {
  const [message, setMessage] = useState("Welcome to this Morning Huddle");

  useEffect(() => {
    fetch('http://localhost:8000/api/welcome')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Welcome to this Morning Huddle"));
  }, []);

  return (
    <div className="welcome-screen">
      <h1>{message}</h1>
      <button className="btn-primary" onClick={onContinue}>
        Go to Huddle
      </button>
    </div>
  );
}

export default Welcome;
