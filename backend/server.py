from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import httpx
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase URL and key from environment variables
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://your-supabase-project.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_ANON_KEY', 'your-supabase-anon-key')

# Create the main app without a prefix
app = FastAPI(title="Klarity API", description="Backend API for Klarity - Vision-First Platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models for the application
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PRDBase(BaseModel):
    content: Dict[str, Any]  # JSON content with sections
    project_id: str

class PRDCreate(PRDBase):
    pass

class PRD(PRDBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Helper function to make authenticated requests to Supabase
async def supabase_request(method: str, endpoint: str, json_data: Optional[Dict] = None, params: Optional[Dict] = None):
    url = f"{SUPABASE_URL}{endpoint}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        if method.lower() == "get":
            response = await client.get(url, headers=headers, params=params)
        elif method.lower() == "post":
            response = await client.post(url, headers=headers, json=json_data)
        elif method.lower() == "put":
            response = await client.put(url, headers=headers, json=json_data)
        elif method.lower() == "delete":
            response = await client.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        if response.status_code >= 400:
            try:
                error_detail = response.json()
                raise HTTPException(status_code=response.status_code, detail=error_detail)
            except json.JSONDecodeError:
                raise HTTPException(status_code=response.status_code, detail=response.text)
                
        return response.json()

# Routes
@api_router.get("/")
async def root():
    return {"message": "Welcome to Klarity API - Your Vision-First Platform"}

# User management routes (these would typically be handled by Supabase directly on the frontend)
@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    data = await supabase_request(
        "post", 
        "/auth/v1/signup", 
        {
            "email": user.email,
            "password": user.password,
            "data": {
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        }
    )
    return data

# Project routes
@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate, user_id: str):
    data = {
        "name": project.name,
        "description": project.description,
        "project_type": project.project_type,
        "user_id": user_id
    }
    response = await supabase_request("post", "/rest/v1/projects", data)
    return response

@api_router.get("/projects", response_model=List[Project])
async def get_projects(user_id: str):
    params = {"user_id": f"eq.{user_id}"}
    response = await supabase_request("get", "/rest/v1/projects", params=params)
    return response

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    params = {"id": f"eq.{project_id}"}
    response = await supabase_request("get", "/rest/v1/projects", params=params)
    if not response:
        raise HTTPException(status_code=404, detail="Project not found")
    return response[0]

# PRD routes
@api_router.post("/prds", response_model=PRD)
async def create_prd(prd: PRDCreate, user_id: str):
    data = {
        "content": prd.content,
        "project_id": prd.project_id,
        "user_id": user_id
    }
    response = await supabase_request("post", "/rest/v1/prds", data)
    return response

@api_router.get("/prds/{project_id}", response_model=PRD)
async def get_prd(project_id: str):
    params = {"project_id": f"eq.{project_id}"}
    response = await supabase_request("get", "/rest/v1/prds", params=params)
    if not response:
        raise HTTPException(status_code=404, detail="PRD not found")
    return response[0]

@api_router.put("/prds/{prd_id}", response_model=PRD)
async def update_prd(prd_id: str, prd_update: Dict[str, Any]):
    data = {
        "content": prd_update.get("content"),
        "updated_at": datetime.utcnow().isoformat()
    }
    params = {"id": f"eq.{prd_id}"}
    response = await supabase_request("put", "/rest/v1/prds", data, params)
    return response

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
