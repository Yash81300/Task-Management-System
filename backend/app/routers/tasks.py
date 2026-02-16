from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models import TaskCreate, TaskUpdate, TaskResponse, TaskStatus, TaskPriority
from app.database import get_database
from app.auth import get_current_user
from datetime import datetime
from bson import ObjectId
from typing import Optional, List

router = APIRouter()

@router.get("/", response_model=dict)
async def get_tasks(
    status_filter: Optional[TaskStatus] = Query(None, alias="status"),
    priority: Optional[TaskPriority] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get all tasks for current user with filtering and pagination"""
    db = get_database()
    
    # Build query - convert user_id string to ObjectId
    query = {"user_id": ObjectId(current_user["_id"])}
    if status_filter:
        query["status"] = status_filter.value
    if priority:
        query["priority"] = priority.value
    
    # Get total count
    total = await db.tasks.count_documents(query)
    
    # Get paginated tasks
    skip = (page - 1) * limit
    cursor = db.tasks.find(query).sort("created_at", -1).skip(skip).limit(limit)
    tasks = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for task in tasks:
        task["_id"] = str(task["_id"])
        task["user_id"] = str(task["user_id"])
    
    return {
        "status": "success",
        "results": len(tasks),
        "data": {
            "tasks": tasks,
            "pagination": {
                "current_page": page,
                "total_pages": (total + limit - 1) // limit,
                "total_tasks": total
            }
        }
    }

@router.get("/stats", response_model=dict)
async def get_task_stats(current_user: dict = Depends(get_current_user)):
    """Get task statistics for current user"""
    db = get_database()
    
    user_id = ObjectId(current_user["_id"])
    
    # Aggregate by status
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    
    stats_cursor = db.tasks.aggregate(pipeline)
    stats = await stats_cursor.to_list(length=None)
    
    # Get total count
    total = await db.tasks.count_documents({"user_id": user_id})
    
    return {
        "status": "success",
        "data": {
            "total_tasks": total,
            "by_status": stats
        }
    }

@router.get("/{task_id}", response_model=dict)
async def get_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a single task by ID"""
    db = get_database()
    
    try:
        task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID"
        )
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check ownership
    if str(task["user_id"]) != current_user["_id"] and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    
    task["_id"] = str(task["_id"])
    task["user_id"] = str(task["user_id"])
    
    return {
        "status": "success",
        "data": {"task": task}
    }

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new task"""
    db = get_database()
    
    task_dict = {
        **task.model_dump(),
        "user_id": ObjectId(current_user["_id"]),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.tasks.insert_one(task_dict)
    task_dict["_id"] = str(result.inserted_id)
    task_dict["user_id"] = str(task_dict["user_id"])
    
    return {
        "status": "success",
        "message": "Task created successfully",
        "data": {"task": task_dict}
    }

@router.put("/{task_id}", response_model=dict)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a task"""
    db = get_database()
    
    try:
        task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID"
        )
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check ownership
    if str(task["user_id"]) != current_user["_id"] and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )
    
    # Update only provided fields
    update_data = {k: v for k, v in task_update.model_dump(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_data}
    )
    
    # Fetch updated task
    updated_task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    updated_task["_id"] = str(updated_task["_id"])
    updated_task["user_id"] = str(updated_task["user_id"])
    
    return {
        "status": "success",
        "message": "Task updated successfully",
        "data": {"task": updated_task}
    }

@router.delete("/{task_id}", response_model=dict)
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a task"""
    db = get_database()
    
    try:
        task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID"
        )
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check ownership
    if str(task["user_id"]) != current_user["_id"] and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )
    
    await db.tasks.delete_one({"_id": ObjectId(task_id)})
    
    return {
        "status": "success",
        "message": "Task deleted successfully",
        "data": None
    }