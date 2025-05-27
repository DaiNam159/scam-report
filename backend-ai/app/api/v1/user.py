from fastapi import APIRouter
from app.schemas.user import UserCreate

router = APIRouter()

@router.post("/")
def create_user(user: UserCreate):
    return {"message": f"User {user.username} created."}
