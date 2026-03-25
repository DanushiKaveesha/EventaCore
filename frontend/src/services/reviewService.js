import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

// Get reviews for an event
export const getEventReviews = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Add a new review
export const addReview = async (reviewData) => {
  try {
    const response = await axios.post(API_URL, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};
