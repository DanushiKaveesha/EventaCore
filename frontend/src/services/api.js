import axios from 'axios';

// Centralised API URL. Change this here to update all services!
// Currently set to 5000 to match your running backend.
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
