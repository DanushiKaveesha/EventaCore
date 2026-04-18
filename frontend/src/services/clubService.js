import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clubs';

export const createClub = async (formData) => {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error creating club';
    }
};
export const getAllClubs = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching clubs';
    }
};

export const getClubById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching club details';
    }
};

export const updateClub = async (id, formData) => {
    try {
        // If formData is a plain object (no image), send as JSON
        // If it's a FormData instance (has image), send as multipart
        const isMultipart = formData instanceof FormData;
        const config = isMultipart
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};
        const response = await axios.put(`${API_URL}/${id}`, formData, config);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating club';
    }
};

export const deleteClub = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error deleting club';
    }
};

export const addEvent = async (clubId, eventData) => {
    try {
        const response = await axios.post(`${API_URL}/${clubId}/events`, eventData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error adding event';
    }
};
