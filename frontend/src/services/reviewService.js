import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

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

export const getEventReviews = async (eventId) => {
  const response = await axios.get(`${API_URL}/event/${eventId}`);
  return response.data;
};

export const addReview = async (reviewData) => {
  const response = await axios.post(API_URL, reviewData, getAuthConfig());
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

export const updateReview = async (reviewId, payload) => {
  const response = await axios.put(`${API_URL}/${reviewId}`, payload, getAuthConfig());
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axios.delete(`${API_URL}/${reviewId}`, getAuthConfig());
  return response.data;
};
