import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

export const getNotifications = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch notifications';
    }
};

export const markAsRead = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/read`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to mark notification as read';
    }
};
