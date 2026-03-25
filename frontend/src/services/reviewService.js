import axios from 'axios';

const API_URL = '/api/reviews';

const getAuthConfig = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));

    if (storedUser?.token) {
      return {
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
        },
      };
    }
  } catch (error) {
    console.error('Error reading user session:', error);
  }

  return {};
};

// Get reviews for an event
export const getEventReviews = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Add a new review
export const addReview = async (reviewData) => {
  try {
    const response = await axios.post(API_URL, reviewData, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const getAllReviews = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

export const updateReview = async (reviewId, payload) => {
  try {
    const response = await axios.put(`${API_URL}/${reviewId}`, payload, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`${API_URL}/${reviewId}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
