// API Communication

async function apiCall(url, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Try to parse JSON response
        let data;
        try {
            data = await response.json();
        } catch (e) {
            // If JSON parsing fails, create a generic error
            data = { detail: 'Server error occurred' };
        }
        
        if (!response.ok) {
            // Handle different status codes
            if (response.status === 401) {
                // Unauthorized - could be wrong credentials or expired session
                if (token) {
                    logout();
                    throw new Error('Session expired. Please login again.');
                } else {
                    throw new Error('Invalid email or password');
                }
            } else if (response.status === 422) {
                // Validation error
                throw new Error(data.detail || 'Invalid input data');
            } else if (response.status === 404) {
                throw new Error('Resource not found');
            } else if (response.status === 500) {
                throw new Error('Server error occurred');
            }
            
            // Generic error with detail from server
            throw new Error(data.detail || `Error: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        // Re-throw the error to be caught by the calling function
        throw error;
    }
}

// Auth API
const authAPI = {
    async register(userData) {
        return await apiCall(API_ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    
    async login(credentials) {
        return await apiCall(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },
    
    async getMe() {
        return await apiCall(API_ENDPOINTS.ME);
    }
};

// Tasks API
const tasksAPI = {
    async getTasks(filters = {}) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        
        const url = `${API_ENDPOINTS.TASKS}${params.toString() ? '?' + params.toString() : ''}`;
        return await apiCall(url);
    },
    
    async getTask(id) {
        return await apiCall(`${API_ENDPOINTS.TASKS}/${id}`);
    },
    
    async createTask(taskData) {
        return await apiCall(API_ENDPOINTS.TASKS, {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    },
    
    async updateTask(id, taskData) {
        return await apiCall(`${API_ENDPOINTS.TASKS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    },
    
    async deleteTask(id) {
        return await apiCall(`${API_ENDPOINTS.TASKS}/${id}`, {
            method: 'DELETE'
        });
    },
    
    async getStats() {
        return await apiCall(API_ENDPOINTS.TASK_STATS);
    }
};

// Users API (Admin)
const usersAPI = {
    async getUsers(filters = {}) {
        const params = new URLSearchParams();
        if (filters.role) params.append('role', filters.role);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        
        const url = `${API_ENDPOINTS.USERS}${params.toString() ? '?' + params.toString() : ''}`;
        return await apiCall(url);
    },
    
    async getUser(id) {
        return await apiCall(`${API_ENDPOINTS.USERS}/${id}`);
    },
    
    async updateUser(id, userData) {
        return await apiCall(`${API_ENDPOINTS.USERS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },
    
    async deleteUser(id) {
        return await apiCall(`${API_ENDPOINTS.USERS}/${id}`, {
            method: 'DELETE'
        });
    }
};