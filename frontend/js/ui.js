// UI Rendering Functions

function showAlert(message, type = 'error') {
    return `<div class="alert alert-${type}">${message}</div>`;
}

function renderLogin() {
    return `
        <div class="auth-container">
            <div class="auth-box">
                <h2>Welcome Back</h2>
                <p class="auth-subtitle">Log in to your workspace</p>
                <div id="loginMessage"></div>
                <form id="loginForm">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="loginEmail" required placeholder="Email or username">
                    </div>
                    <div class="form-group password-group">
                        <label>Password</label>
                        <input type="password" id="loginPassword" required placeholder="Enter your password">
                        <button type="button" class="password-toggle" onclick="togglePassword('loginPassword', this)">
                            <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                    <button type="submit" class="btn btn-primary" id="loginBtn">Log In</button>
                </form>
                <div class="auth-switch">
                    Don't have an account? <a onclick="showRegister()">Sign up</a>
                </div>
            </div>
        </div>
    `;
}

function renderRegister() {
    return `
        <div class="auth-container">
            <div class="auth-box">
                <h2>Create Account</h2>
                <p class="auth-subtitle">Join your team's workspace</p>
                <div id="registerMessage"></div>
                <form id="registerForm">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="registerName" required placeholder="Full name">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="registerEmail" required placeholder="Email address">
                    </div>
                    <div class="form-group password-group">
                        <label>Password</label>
                        <input type="password" id="registerPassword" required minlength="6" placeholder="Create password (min 6 chars)">
                        <button type="button" class="password-toggle" onclick="togglePassword('registerPassword', this)">
                            <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select id="registerRole">
                            <option value="user">Team Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" id="registerBtn">Create Account</button>
                </form>
                <div class="auth-switch">
                    Already have an account? <a onclick="showLogin()">Log in</a>
                </div>
            </div>
        </div>
    `;
}

function renderDashboard() {
    return `
        <div class="container">
            <div class="dashboard">
                <h2>Task Board</h2>
                <div id="dashboardMessage"></div>
                
                <!-- Stats -->
                <div class="stats" id="stats">
                    <div class="stat-card">
                        <h3>Total Tasks</h3>
                        <p id="totalTasks">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>To Do</h3>
                        <p id="pendingTasks">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>In Progress</h3>
                        <p id="inProgressTasks">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Completed</h3>
                        <p id="completedTasks">0</p>
                    </div>
                </div>
                
                <!-- Tasks Header -->
                <div class="tasks-header">
                    <h3>Your Tasks</h3>
                    <div class="filters">
                        <select id="statusFilter">
                            <option value="">All Status</option>
                            <option value="pending">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select id="priorityFilter">
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button onclick="showTaskModal()" class="btn btn-success">+ Add New Task</button>
                    </div>
                </div>
                
                <!-- Tasks List -->
                <div id="tasksList"></div>
            </div>
        </div>
    `;
}

function renderTasksList(tasks) {
    if (!tasks || tasks.length === 0) {
        return `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Create your first task to get started!</p>
            </div>
        `;
    }
    
    return `
        <div class="task-list">
            ${tasks.map(task => `
                <div class="task-card">
                    <div class="task-header">
                        <div>
                            <h4 class="task-title">${escapeHtml(task.title)}</h4>
                            <div class="task-meta">
                                <span class="status-badge status-${task.status}">${task.status}</span>
                                <span class="status-badge priority-${task.priority}">${task.priority}</span>
                            </div>
                        </div>
                    </div>
                    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                    <div class="task-actions">
                        <button onclick="editTask('${task._id}')" class="btn btn-secondary btn-small">Edit</button>
                        <button onclick="deleteTask('${task._id}')" class="btn btn-danger btn-small">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderTaskModal(task = null) {
    const isEdit = !!task;
    return `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <h3>${isEdit ? 'Edit Task' : 'Create New Task'}</h3>
                <div id="taskModalMessage"></div>
                <form id="taskForm">
                    <div class="form-group">
                        <label>Title *</label>
                        <input type="text" id="taskTitle" required placeholder="Enter task title" value="${isEdit ? escapeHtml(task.title) : ''}">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="taskDescription" placeholder="Enter task description">${isEdit ? escapeHtml(task.description || '') : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="taskStatus">
                            <option value="pending" ${isEdit && task.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${isEdit && task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${isEdit && task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Priority</label>
                        <select id="taskPriority">
                            <option value="low" ${isEdit && task.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${isEdit && task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${isEdit && task.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" id="taskDueDate" value="${isEdit && task.due_date ? task.due_date.split('T')[0] : ''}">
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary" id="taskSubmitBtn">
                            ${isEdit ? 'Update Task' : 'Create Task'}
                        </button>
                        <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
}

// Toggle password visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        input.type = 'password';
        icon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// Custom confirmation modal
function showConfirmModal(message, onConfirm) {
    const modalHtml = `
        <div class="modal-overlay" id="confirmModal">
            <div class="modal confirm-modal">
                <h3>Confirm Action</h3>
                <p class="confirm-message">${escapeHtml(message)}</p>
                <div class="modal-actions">
                    <button class="btn btn-danger" id="confirmYes">Delete</button>
                    <button class="btn btn-secondary" id="confirmNo">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    document.getElementById('confirmYes').addEventListener('click', () => {
        document.getElementById('confirmModal').remove();
        onConfirm();
    });
    
    document.getElementById('confirmNo').addEventListener('click', () => {
        document.getElementById('confirmModal').remove();
    });
    
    // Close on overlay click
    document.getElementById('confirmModal').addEventListener('click', (e) => {
        if (e.target.id === 'confirmModal') {
            document.getElementById('confirmModal').remove();
        }
    });
}