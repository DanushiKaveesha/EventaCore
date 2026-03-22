import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const getUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(API_URL, userData);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
};

export const toggleUserStatus = async (userId) => {
    const response = await axios.patch(`${API_URL}/${userId}/toggle-status`);
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await axios.patch(`${API_URL}/${userId}/role`, { role });
    return response.data;
};

export const getUserStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};
