import axios from 'axios';

const API_URL = 'http://localhost:5000/api/event-registrations';

export const registerForEvent = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error submitting event registration';
    }
};

export const getMyEventRequests = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/my-requests`, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching event requests';
    }
};

export const getAdminEventRequests = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching admin event requests';
    }
};

export const updateEventRequestStatus = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating event request';
    }
};

export const deleteEventRequest = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error deleting event request';
    }
};
