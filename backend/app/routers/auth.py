from fastapi import APIRouter, HTTPException, status, Depends
from app.models import UserCreate, UserLogin, Token, UserResponse
from app.database import get_database
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """Register a new user"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create user document
    user_dict = {
        "name": user.name,
        "email": user.email,
        "password": get_password_hash(user.password),
        "role": user.role.value,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "last_login": None
    }
    
    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_id, "role": user.role.value}
    )
    
    return {
        "status": "success",
        "message": "User registered successfully",
        "data": {
            "user": {
                "id": user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value
            },
            "token": access_token
        }
    }

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    db = get_database()
    
    # Find user by email
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated"
        )
    
    # Update last login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]}
    )
    
    return {
        "status": "success",
        "message": "Login successful",
        "data": {
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            },
            "token": access_token
        }
    }

@router.get("/me", response_model=dict)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return {
        "status": "success",
        "data": {
            "user": {
                "id": current_user["_id"],
                "name": current_user["name"],
                "email": current_user["email"],
                "role": current_user["role"],
                "is_active": current_user.get("is_active", True),
                "created_at": current_user["created_at"]
            }
        }
    }
