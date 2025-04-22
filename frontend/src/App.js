import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { format, parseISO, isToday as isTodayDate } from 'date-fns';
import AppHeader from './components/AppHeader';
import DailyOverview from './components/DailyOverview';
import ReservationList from './components/ReservationList';
import GuestInsights from './components/GuestInsights';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import Welcome from './components/Welcome'; // <-- New import

function App() {
  const [huddleData, setHuddleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true); // <-- New state

  const isToday = isTodayDate(parseISO(selectedDate));

  const fetchHuddleData = useCallback(async (date) => {
    try {
      setLoading(true);
      setError(null);
      setHuddleData(null);
      setSelectedGuest(null);

      const response = await fetch(`http://localhost:8000/api/huddle/${date}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`${format(parseISO(date), 'MMMM d, yyyy')}`);
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setHuddleData(data);
    } catch (err) {
      console.error("Error fetching huddle data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showWelcome && selectedDate && typeof selectedDate === "string") {
      fetchHuddleData(selectedDate);
    }
  }, [selectedDate, showWelcome, fetchHuddleData]);

  const handleGuestSelect = useCallback((guest) => {
    setSelectedGuest(guest);
  }, []);

  const handleDateChange = useCallback((event) => {
    setSelectedDate(event.target.value);
  }, []);

  return (
    <div className="app">
      {showWelcome ? (
        <Welcome onContinue={() => setShowWelcome(false)} />
      ) : (
        <>
          <AppHeader 
            selectedDate={selectedDate} 
            onDateChange={handleDateChange}
          />
          <main className="main-content">
            {loading ? (
              <LoadingSkeleton />
            ) : error ? ( 
              <ErrorState 
                error={error}
                onRetry={() => fetchHuddleData(selectedDate)}
                onToday={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
              />
            ) : huddleData ? (
              <>
                <div className="left-panel">
                  <DailyOverview 
                    data={huddleData} 
                    isToday={isToday}
                  />
                  <ReservationList 
                    guests={huddleData.guest_insights} 
                    onSelectGuest={handleGuestSelect}
                    selectedGuest={selectedGuest}
                  />
                </div>
                <div className="right-panel">
                  {selectedGuest ? (
                    <GuestInsights 
                      guest={selectedGuest} 
                      isToday={isToday}
                    />
                  ) : (
                    <EmptyState 
                      icon="👋" 
                      title="Select a Guest"
                      message="Choose a guest from the list to view detailed insights and preferences"
                    />
                  )}
                </div>
              </>
            ) : (
              <EmptyState 
                icon="📅" 
                title="No Reservations"
                message={`No reservations found for ${format(parseISO(selectedDate), 'MMMM d, yyyy')}`}
                action={
                  <button 
                    className="btn-primary"
                    onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
                  >
                    View Today's Reservations
                  </button>
                }
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
