import axios from 'axios';

const API_URL = 'http://localhost:5000/api/memberships';

export const requestMembership = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error submitting request';
    }
};

export const getMyRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/my-requests`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching requests';
    }
};

export const updateMembershipRequest = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating request';
    }
};

export const deleteMembershipRequest = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error deleting request';
    }
};
