import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookmarks';

export const toggleBookmark = async (clubId) => {
    try {
        const response = await axios.post(`${API_URL}/toggle`, { clubId });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error toggling bookmark';
    }
};

export const getMyBookmarks = async () => {
    try {
        const response = await axios.get(`${API_URL}/my-bookmarks`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching bookmarks';
    }
};
