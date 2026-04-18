import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const getConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };
};

export const getUsers = async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`, getConfig());
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(API_URL, userData, getConfig());
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await axios.put(`${API_URL}/${userId}`, userData, getConfig());
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/${userId}`, getConfig());
    return response.data;
};

export const toggleUserStatus = async (userId) => {
    const response = await axios.patch(`${API_URL}/${userId}/toggle-status`, {}, getConfig());
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await axios.patch(`${API_URL}/${userId}/role`, { role }, getConfig());
    return response.data;
};

export const getUserStats = async () => {
    const response = await axios.get(`${API_URL}/stats`, getConfig());
    return response.data;
};

export const deactivateProfile = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;
    if (!token) throw new Error('No authentication token found. Please log in again.');
    try {
        const response = await axios.patch(`${API_URL}/profile/deactivate`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error calling deactivateProfile:', err.response?.data || err.message);
        throw err;
    }
};
