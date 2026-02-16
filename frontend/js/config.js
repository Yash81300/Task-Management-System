// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const API_ENDPOINTS = {
    // Auth
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    ME: `${API_BASE_URL}/auth/me`,
    
    // Tasks
    TASKS: `${API_BASE_URL}/tasks`,
    TASK_STATS: `${API_BASE_URL}/tasks/stats`,
    
    // Users (Admin)
    USERS: `${API_BASE_URL}/users`
};
