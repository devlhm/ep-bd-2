import axios from 'axios';

const apiClient = axios.create({
    // baseURL: process.env.REACT_APP_API_URL,
    baseURL: "http://localhost:5155/api",
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;