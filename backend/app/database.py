from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = None
database = None

async def connect_to_mongo():
    global client, database
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.DATABASE_NAME]
    print(f"✅ Connected to MongoDB: {settings.MONGODB_URL}")
    
    # Create indexes
    await database.users.create_index("email", unique=True)
    await database.tasks.create_index([("user_id", 1), ("status", 1)])
    print("✅ Database indexes created")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("❌ Disconnected from MongoDB")

def get_database():
    return database
