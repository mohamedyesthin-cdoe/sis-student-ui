from src.db.session import SessionLocal, get_db
from sqlalchemy.orm import Session
from src.models.user import User,  Group, user_group
from src.utils.hash import hash_password
from src.repositories import user as user_repo
from fastapi import HTTPException

def creatsuperuser():
    db: Session = SessionLocal()
    email = "hariKrishnanmsd@gmail.com"
    password = "admin@123"
    username = "admin"

    if user_repo.get_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if user_repo.get_user_by_username(db, username):
        raise HTTPException(status_code=400, detail="Username already registered")

    user = User(
        username = username,
        email = email,
        hashed_password = hash_password(password),
        is_active = True,
        is_superuser = True,
    )
    print(user.hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Assign user to Admin group
    admin_group = db.query(Group).filter(Group.name == 'Admin').first()
    if not admin_group:
        admin_group = Group(name='Admin')
        db.add(admin_group)
        db.commit()
        db.refresh(admin_group)

    user.groups.append(admin_group)
    
    db.commit()
    db.refresh(user)
    print("Superuser created:", user.email)

if __name__ == "__main__":
    creatsuperuser()