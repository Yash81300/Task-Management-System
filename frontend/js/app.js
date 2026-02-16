// Main Application Logic

let currentTask = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        showDashboard();
    } else {
        showLogin();
    }
});

// Show Login Page
function showLogin() {
    hideNavbar();
    document.getElementById('app').innerHTML = renderLogin();
    
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });
}

// Show Register Page
function showRegister() {
    hideNavbar();
    document.getElementById('app').innerHTML = renderRegister();
    
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRegister();
    });
}

// Show Dashboard
async function showDashboard() {
    const user = getUser();
    if (!user) {
        showLogin();
        return;
    }
    
    showNavbar(user);
    document.getElementById('app').innerHTML = renderDashboard();
    
    // Add filter listeners
    document.getElementById('statusFilter').addEventListener('change', loadTasks);
    document.getElementById('priorityFilter').addEventListener('change', loadTasks);
    
    // Load data
    await Promise.all([loadStats(), loadTasks()]);
}

// Handle Login
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');
    const submitBtn = document.getElementById('loginBtn');
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        const response = await authAPI.login({ email, password });
        
        const { user, token } = response.data;
        setToken(token);
        setUser(user);
        
        showDashboard();
    } catch (error) {
        messageDiv.innerHTML = showAlert(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

// Handle Register
async function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    const messageDiv = document.getElementById('registerMessage');
    const submitBtn = document.getElementById('registerBtn');
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
        
        const response = await authAPI.register({ name, email, password, role });
        
        const { user, token } = response.data;
        setToken(token);
        setUser(user);
        
        showDashboard();
    } catch (error) {
        messageDiv.innerHTML = showAlert(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
}

// Load Statistics
async function loadStats() {
    try {
        const response = await tasksAPI.getStats();
        const { total_tasks, by_status } = response.data;
        
        document.getElementById('totalTasks').textContent = total_tasks;
        
        const pending = by_status.find(s => s._id === 'pending')?.count || 0;
        const inProgress = by_status.find(s => s._id === 'in-progress')?.count || 0;
        const completed = by_status.find(s => s._id === 'completed')?.count || 0;
        
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('inProgressTasks').textContent = inProgress;
        document.getElementById('completedTasks').textContent = completed;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Load Tasks
async function loadTasks() {
    const statusFilter = document.getElementById('statusFilter')?.value;
    const priorityFilter = document.getElementById('priorityFilter')?.value;
    const tasksList = document.getElementById('tasksList');
    
    try {
        tasksList.innerHTML = '<div class="loading">Loading tasks...</div>';
        
        const filters = {};
        if (statusFilter) filters.status = statusFilter;
        if (priorityFilter) filters.priority = priorityFilter;
        
        const response = await tasksAPI.getTasks(filters);
        console.log('Tasks API response:', response); // Debug log
        
        // Check different possible response structures
        const tasks = response.data?.tasks || response.tasks || response.data || [];
        console.log('Extracted tasks:', tasks); // Debug log
        
        tasksList.innerHTML = renderTasksList(tasks);
    } catch (error) {
        console.error('Load tasks error:', error);
        tasksList.innerHTML = showAlert('Failed to load tasks', 'error');
    }
}

// Show Task Modal
function showTaskModal(taskId = null) {
    if (taskId) {
        // Load task and show edit modal
        tasksAPI.getTask(taskId).then(response => {
            currentTask = response.data.task;
            showModal();
        }).catch(error => {
            alert('Failed to load task: ' + error.message);
        });
    } else {
        currentTask = null;
        showModal();
    }
}

function showModal() {
    const modalHtml = renderTaskModal(currentTask);
    const modalContainer = document.createElement('div');
    modalContainer.id = 'taskModal';
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    document.getElementById('taskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleTaskSubmit();
    });
}

// Close Modal
function closeModal(event) {
    if (event && event.target.classList.contains('modal-overlay')) {
        const modal = document.getElementById('taskModal');
        if (modal) modal.remove();
        currentTask = null;
    } else if (!event) {
        const modal = document.getElementById('taskModal');
        if (modal) modal.remove();
        currentTask = null;
    }
}

// Handle Task Submit
async function handleTaskSubmit() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const status = document.getElementById('taskStatus').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const messageDiv = document.getElementById('taskModalMessage');
    const submitBtn = document.getElementById('taskSubmitBtn');
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        // Convert date to ISO datetime format if provided
        let dueDateISO = null;
        if (dueDate) {
            // Add time component to make it a valid datetime
            dueDateISO = dueDate + 'T23:59:59';
        }
        
        const taskData = {
            title,
            description: description || null,
            status,
            priority,
            due_date: dueDateISO
        };
        
        if (currentTask) {
            await tasksAPI.updateTask(currentTask._id, taskData);
        } else {
            await tasksAPI.createTask(taskData);
        }
        
        closeModal();
        await Promise.all([loadStats(), loadTasks()]);
        
        const dashboardMessage = document.getElementById('dashboardMessage');
        dashboardMessage.innerHTML = showAlert(
            currentTask ? 'Task updated successfully' : 'Task created successfully',
            'success'
        );
        setTimeout(() => dashboardMessage.innerHTML = '', 3000);
    } catch (error) {
        messageDiv.innerHTML = showAlert(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = currentTask ? 'Update Task' : 'Create Task';
    }
}

// Edit Task
function editTask(taskId) {
    showTaskModal(taskId);
}

// Delete Task
async function deleteTask(taskId) {
    showConfirmModal('Are you sure you want to delete this task?', async () => {
        try {
            await tasksAPI.deleteTask(taskId);
            await Promise.all([loadStats(), loadTasks()]);
            
            const dashboardMessage = document.getElementById('dashboardMessage');
            dashboardMessage.innerHTML = showAlert('Task deleted successfully', 'success');
            setTimeout(() => dashboardMessage.innerHTML = '', 3000);
        } catch (error) {
            const dashboardMessage = document.getElementById('dashboardMessage');
            dashboardMessage.innerHTML = showAlert('Failed to delete task: ' + error.message, 'error');
            setTimeout(() => dashboardMessage.innerHTML = '', 3000);
        }
    });
}