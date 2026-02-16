from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models import UserUpdate, UserRole
from app.database import get_database
from app.auth import get_current_user, require_role
from bson import ObjectId
from typing import Optional

router = APIRouter()

@router.get("/", response_model=dict)
async def get_users(
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(require_role(UserRole.admin))
):
    """Get all users (Admin only)"""
    db = get_database()
    
    # Build query
    query = {}
    if role:
        query["role"] = role.value
    if is_active is not None:
        query["is_active"] = is_active
    
    # Get total count
    total = await db.users.count_documents(query)
    
    # Get paginated users
    skip = (page - 1) * limit
    cursor = db.users.find(query, {"password": 0}).sort("created_at", -1).skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for user in users:
        user["_id"] = str(user["_id"])
    
    return {
        "status": "success",
        "results": len(users),
        "data": {
            "users": users,
            "pagination": {
                "current_page": page,
                "total_pages": (total + limit - 1) // limit,
                "total_users": total
            }
        }
    }

@router.get("/{user_id}", response_model=dict)
async def get_user(
    user_id: str,
    current_user: dict = Depends(require_role(UserRole.admin))
):
    """Get a single user by ID (Admin only)"""
    db = get_database()
    
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user["_id"] = str(user["_id"])
    
    return {
        "status": "success",
        "data": {"user": user}
    }

@router.put("/{user_id}", response_model=dict)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: dict = Depends(require_role(UserRole.admin))
):
    """Update a user (Admin only)"""
    db = get_database()
    
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update only provided fields
    update_data = {k: v for k, v in user_update.model_dump(exclude_unset=True).items() if v is not None}
    
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
    
    # Fetch updated user
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    updated_user["_id"] = str(updated_user["_id"])
    
    return {
        "status": "success",
        "message": "User updated successfully",
        "data": {"user": updated_user}
    }

@router.delete("/{user_id}", response_model=dict)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(require_role(UserRole.admin))
):
    """Delete a user (Admin only)"""
    db = get_database()
    
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Don't allow deleting yourself
    if str(user["_id"]) == current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    await db.users.delete_one({"_id": ObjectId(user_id)})
    
    return {
        "status": "success",
        "message": "User deleted successfully",
        "data": None
    }
