import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

// Create a new event with image upload
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all events
export const getEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single event by ID
export const getEvent = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update an event
export const updateEvent = async (id, eventData) => {
  try {
    // We do NOT manual override Content-Type here because we are passing FormData. 
    // Axios calculates the multipart boundary itself.
    const response = await axios.put(`${API_URL}/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
