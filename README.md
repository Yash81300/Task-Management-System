# 🚀 Task Management API - FastAPI + Vanilla JS

A modern, scalable REST API built with **FastAPI** and **MongoDB**, featuring JWT authentication, role-based access control, and a clean **Vanilla JavaScript** frontend.

## ✨ Features

### Backend (FastAPI)
- ✅ **JWT Authentication** with secure password hashing (bcrypt)
- ✅ **Role-Based Access Control** (User & Admin roles)
- ✅ **Async/Await** - Full async support with Motor (async MongoDB driver)
- ✅ **Automatic API Documentation** - Interactive Swagger UI & ReDoc
- ✅ **Pydantic Models** - Automatic validation and serialization
- ✅ **CRUD Operations** for tasks with filtering & pagination
- ✅ **MongoDB** with indexes for performance
- ✅ **CORS** configured for frontend integration
- ✅ **Error Handling** - Comprehensive error responses

### Frontend (Vanilla JS)
- ✅ **No Framework** - Pure HTML, CSS, and JavaScript
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **JWT Token Management** - Secure authentication flow
- ✅ **Task CRUD** - Create, read, update, delete tasks
- ✅ **Filtering** - Filter by status and priority
- ✅ **Statistics Dashboard** - Real-time task statistics
- ✅ **Clean UI** - Modern gradient design

## 🛠 Tech Stack

### Backend
- **Language**: Python 3.8+
- **Framework**: FastAPI
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Passlib with bcrypt
- **Validation**: Pydantic
- **Server**: Uvicorn (ASGI server)

### Frontend
- **HTML5**
- **CSS3** (with Flexbox & Grid)
- **Vanilla JavaScript** (ES6+)
- **Fetch API** for HTTP requests

## 📁 Project Structure

```
fastapi-assignment/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── tasks.py         # Task CRUD endpoints
│   │   │   └── users.py         # User management (Admin)
│   │   ├── auth.py              # JWT & password utilities
│   │   ├── config.py            # Configuration settings
│   │   ├── database.py          # MongoDB connection
│   │   └── models.py            # Pydantic models
│   ├── main.py                  # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables example
├── frontend/
│   ├── css/
│   │   └── style.css           # Styling
│   ├── js/
│   │   ├── config.js           # API configuration
│   │   ├── auth.js             # Authentication logic
│   │   ├── api.js              # API calls
│   │   ├── ui.js               # UI rendering
│   │   └── app.js              # Main application
│   └── index.html              # Main HTML file
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- MongoDB (local or MongoDB Atlas)
- pip (Python package manager)

### Step 1: Clone & Navigate

```bash
cd fastapi-assignment
```

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment

Copy `.env.example` to `.env` and update the values before running the project:

```env
# For local MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=fastapi_tasks

# For MongoDB Atlas (cloud)
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
# DATABASE_NAME=fastapi_tasks

SECRET_KEY=your_super_secret_key_change_this_in_production
```

### Step 4: Start MongoDB

**If using local MongoDB:**
```bash
# Windows
net start MongoDB
# Or
mongod

# Mac/Linux
brew services start mongodb-community
# Or
mongod
```

**If using MongoDB Atlas:**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Whitelist your IP address
- Copy connection string to `.env`

### Step 5: Start Backend Server

```bash
# Make sure you're in the backend directory
uvicorn main:app --reload --port 8000
```

Backend will run on: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

### Step 6: Start Frontend

Open a new terminal:

```bash
cd frontend

# Option 1: Using Python's built-in server
python -m http.server 3000

# Option 2: Using Node.js http-server (if installed)
npx http-server -p 3000

# Option 3: Using VS Code Live Server extension
# Right-click index.html -> Open with Live Server
```

Frontend will run on: **http://localhost:3000**

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Endpoints

#### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| GET | `/api/v1/auth/me` | Get current user | Private |

#### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/tasks` | Get all user tasks | Private |
| GET | `/api/v1/tasks/stats` | Get task statistics | Private |
| GET | `/api/v1/tasks/{id}` | Get single task | Private |
| POST | `/api/v1/tasks` | Create new task | Private |
| PUT | `/api/v1/tasks/{id}` | Update task | Private |
| DELETE | `/api/v1/tasks/{id}` | Delete task | Private |

#### Users (Admin Only)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/{id}` | Get single user | Admin |
| PUT | `/api/v1/users/{id}` | Update user | Admin |
| DELETE | `/api/v1/users/{id}` | Delete user | Admin |

## 🧪 Testing the API

### Using the Frontend

1. Open http://localhost:3000
2. Click "Register" and create an account
3. Login with your credentials
4. Create, edit, and delete tasks
5. Try filters and statistics

### Using Swagger UI

1. Go to http://localhost:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. For protected endpoints:
   - First login to get a token
   - Click "Authorize" button at top
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Now you can test protected endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"user"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get tasks (replace TOKEN)
curl http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer TOKEN"
```

## 🔒 Security Features

1. **Password Security**
   - Bcrypt hashing with automatic salt
   - Minimum password length enforcement
   - Passwords never returned in API responses

2. **JWT Authentication**
   - Secure token generation
   - Token expiration (7 days default)
   - Bearer token authentication

3. **Input Validation**
   - Automatic validation with Pydantic
   - Type checking
   - Email format validation
   - String length constraints

4. **Role-Based Access Control**
   - User and Admin roles
   - Route-level authorization
   - Resource ownership verification

5. **CORS Protection**
   - Configured allowed origins
   - Credential support

## 🏗 Scalability Features

### Database Optimization
- Indexed fields: `email` (unique), `user_id` + `status`
- Async operations with Motor
- Pagination support
- Efficient aggregation queries

### API Design
- Stateless architecture (JWT)
- Async/await for concurrent requests
- Horizontal scaling ready
- Load balancer compatible

### Future Enhancements
- Redis caching layer
- Rate limiting with Redis
- Message queue (Celery/RQ)
- Microservices architecture
- Docker containerization
- Kubernetes deployment

## 🐛 Troubleshooting

### Backend won't start

**MongoDB connection error:**
```bash
# Check if MongoDB is running
mongod --version
net start MongoDB  # Windows
```

**Port 8000 already in use:**
```bash
# Use a different port
uvicorn main:app --reload --port 8001
# Update frontend config.js API_BASE_URL
```

### Frontend issues

**CORS errors:**
- Make sure backend is running on port 8000
- Check backend CORS settings in `main.py`

**Can't login:**
- Check browser console for errors
- Verify backend is accessible at http://localhost:8000
- Check network tab for API responses

### MongoDB issues

**Data directory not found:**
```bash
mkdir C:\data\db  # Windows
mkdir -p /data/db  # Mac/Linux
```

**Using MongoDB Atlas:**
- Whitelist your IP in Network Access
- Check connection string format
- Ensure database user has proper permissions

## 📊 Example Usage

### Create Admin User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Create Task

```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete FastAPI assignment",
    "description": "Build a REST API with authentication",
    "status": "in-progress",
    "priority": "high"
  }'
```

## 🎯 Development Tips

1. **Virtual Environment**: Always use a virtual environment for Python projects
2. **Environment Variables**: Never commit `.env` file with real secrets
3. **Auto-reload**: Use `--reload` flag during development
4. **API Testing**: Use Swagger UI for quick testing
5. **Browser DevTools**: Use Network tab to debug API calls

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👤 Author

**Your Name**
- Email: yashmalik81300@gmail.com
- GitHub: [Yash81300](https://github.com/Yash81300)

## 🙏 Acknowledgments

- FastAPI team for the excellent framework
- MongoDB team for the robust database
- Pydantic for awesome data validation

---

**Happy Coding! 🚀**

For questions or issues, please open an issue on GitHub or contact me.
