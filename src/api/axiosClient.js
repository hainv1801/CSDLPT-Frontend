import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080', // Đường dẫn tới Spring Boot
    withCredentials: true, // Quan trọng: Cho phép gửi và nhận cookie (chứa refresh token)
});

// Thêm interceptor để tự động đính access_token vào header
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;