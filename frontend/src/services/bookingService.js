import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

// Create a new booking
export const createBooking = async (bookingData) => {
  const response = await axios.post(API_URL, bookingData);
  return response.data;
};

// Upload payment slip
export const uploadPaymentSlip = async (bookingId, formData) => {
  const response = await axios.put(`${API_URL}/${bookingId}/upload-slip`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get user's bookings
export const getMyBookings = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

// Get single booking details
export const getBookingDetails = async (bookingId) => {
  const response = await axios.get(`${API_URL}/${bookingId}`);
  return response.data;
};

// Update booking status (Admin/Organizer)
export const updateBookingStatus = async (bookingId, status) => {
  const response = await axios.put(`${API_URL}/status/${bookingId}`, { status });
  return response.data;
};

// Get all bookings (Admin)
export const getAllBookings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
