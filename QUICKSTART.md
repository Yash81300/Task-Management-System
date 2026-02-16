# ⚡ Quick Start Guide - FastAPI + Vanilla JS

Get your application running in **5 minutes**!

## 🎯 Prerequisites Checklist

- [ ] Python 3.8+ installed (`python --version`)
- [ ] MongoDB running (local or Atlas account)
- [ ] pip installed (`pip --version`)

## 🚀 3-Step Setup

### Step 1: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Update .env if needed (MongoDB connection)
# For local: mongodb://localhost:27017
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/

# Start server
uvicorn main:app --reload --port 8000
```

✅ **Backend running at: http://localhost:8000**  
📚 **API Docs at: http://localhost:8000/docs**

### Step 2: Frontend Setup (1 minute)

Open new terminal:

```bash
cd frontend

# Start simple HTTP server
python -m http.server 3000
```

✅ **Frontend running at: http://localhost:3000**

### Step 3: Test It! (2 minutes)

1. Open browser: http://localhost:3000
2. Click **"Register"**
3. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
   - Role: user
4. Click **"Register"** button
5. You're in! Create your first task 🎉

## 🎨 What You'll See

### Login/Register Page
- Clean purple gradient background
- White form box
- Email and password fields

### Dashboard
- 4 colorful stat cards (Total, Pending, In Progress, Completed)
- Task filters (status & priority)
- Green "+ New Task" button
- Your tasks list

## 🧪 Quick Tests

### Test 1: Create a Task
1. Click "+ New Task"
2. Title: "Complete assignment"
3. Priority: High
4. Click "Create Task"
5. ✅ Task appears in list!

### Test 2: Filter Tasks
1. Select "High" from priority filter
2. ✅ See only high priority tasks

### Test 3: API Documentation
1. Open http://localhost:8000/docs
2. ✅ See interactive API docs
3. Try endpoints directly!

## 🐛 Quick Fixes

### MongoDB Not Running?

**Windows:**
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Use MongoDB Atlas (Cloud):**
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster (5 minutes)
3. Update backend/.env with connection string

### Port Already in Use?

**Backend (8000):**
```bash
# Use different port
uvicorn main:app --reload --port 8001
# Update frontend/js/config.js: API_BASE_URL = 'http://localhost:8001/api/v1'
```

**Frontend (3000):**
```bash
python -m http.server 3001
# Open http://localhost:3001
```

### CORS Errors in Browser?

Check:
1. Backend is on port 8000
2. Frontend is on port 3000
3. Both are running

## 📊 Test Data

Create these test users:

**Regular User:**
```
Name: John Doe
Email: john@example.com
Password: john123
Role: user
```

**Admin User:**
```
Name: Admin User
Email: admin@example.com
Password: admin123
Role: admin
```

## 🎯 Next Steps

1. ✅ Read full [README.md](README.md)
2. ✅ Explore API docs at http://localhost:8000/docs
3. ✅ Try all CRUD operations
4. ✅ Test with both user and admin roles
5. ✅ Check the code structure

## 💡 Pro Tips

- **Use Swagger UI** for API testing (http://localhost:8000/docs)
- **Check Browser Console** (F12) for frontend errors
- **Check Terminal** for backend errors
- **Keep both terminals open** while testing

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend opens in browser
- [ ] Can register new user
- [ ] Can login
- [ ] Can create task
- [ ] Can edit task
- [ ] Can delete task
- [ ] Can filter tasks
- [ ] Stats update correctly

## 🆘 Still Having Issues?

1. Check full [README.md](README.md) for detailed troubleshooting
2. Verify all prerequisites are installed
3. Make sure MongoDB is running
4. Check both terminal outputs for errors

---

**Ready to code! 🚀**

Total setup time: **~5 minutes**  
You're now running a production-ready FastAPI backend with MongoDB!
