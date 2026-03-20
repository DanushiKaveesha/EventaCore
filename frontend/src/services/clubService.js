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
