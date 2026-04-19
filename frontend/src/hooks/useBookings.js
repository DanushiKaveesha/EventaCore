import { useState, useEffect, useCallback } from 'react';
import { getMyBookings } from '../services/bookingService';
import { useAuth } from './useAuth';

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const data = await getMyBookings(user._id);
      setBookings(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refreshBookings: fetchBookings };
};
