from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any, Union
import uuid
from datetime import datetime, timedelta
import httpx
import json
from io import BytesIO
from starlette.responses import StreamingResponse

# Import pour le Chatbot AI CodeGuide
from external_integrations.ai_codeguide import AICodeGuide
# Import pour l'Assistant IA contextuel par section
from external_integrations.ai_section_assistant import AISectionAssistant

# Suppression des imports WeasyPrint
# from weasyprint import HTML, CSS
# from weasyprint.fonts import FontConfiguration

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

# Model for PDF export request
class PDFRequest(BaseModel):
    html_content: str
    filename: str = "exported_prd.pdf"

# Modèle pour les requêtes du Chatbot AI CodeGuide
class CodeGuideRequest(BaseModel):
    question: str
    project_id: Optional[str] = None
    message_history: Optional[List[Dict[str, str]]] = None
    provider: Optional[str] = "claude"  # Valeur par défaut: claude

class CodeGuideResponse(BaseModel):
    response: str

# Modèle pour les requêtes d'assistant IA par section
class SectionAssistRequest(BaseModel):
    section_key: str
    section_title: str
    section_text: str
    action_key: str
    project_context: Optional[Dict[str, Any]] = None
    provider: Optional[str] = "claude"  # Valeur par défaut: claude

class SectionAssistResponse(BaseModel):
    response: str

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

# Endpoint pour le Chatbot AI CodeGuide
@api_router.post("/codeguide", response_model=CodeGuideResponse)
async def get_codeguide_response(request: CodeGuideRequest):
    """
    Endpoint pour obtenir des réponses du Chatbot AI CodeGuide.
    """
    logger.info(f"Requête CodeGuide reçue. Question: {request.question[:50]}...")
    
    try:
        # Initialiser le CodeGuide avec le fournisseur demandé
        codeguide = AICodeGuide(provider=request.provider)
        
        # Récupérer les informations du projet si un project_id est fourni
        project_context = None
        prd_content = None
        
        if request.project_id:
            # Récupérer les informations du projet
            try:
                params = {"id": f"eq.{request.project_id}"}
                project_response = await supabase_request("get", "/rest/v1/projects", params=params)
                if project_response:
                    project_context = project_response[0]
                
                # Récupérer le PRD associé
                prd_params = {"project_id": f"eq.{request.project_id}"}
                prd_response = await supabase_request("get", "/rest/v1/prds", params=prd_params)
                if prd_response:
                    prd_content = prd_response[0].get("content", {})
            
            except Exception as e:
                logger.warning(f"Erreur lors de la récupération du contexte du projet: {e}")
                # Continuer sans contexte en cas d'erreur
                pass
        
        # Obtenir la réponse du LLM
        response = await codeguide.get_response(
            question=request.question,
            project_context=project_context,
            prd_content=prd_content,
            message_history=request.message_history
        )
        
        return CodeGuideResponse(response=response)
    
    except Exception as e:
        logger.error(f"Erreur avec le Chatbot AI CodeGuide: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la génération de la réponse: {str(e)}"
        )

# Endpoint pour l'assistance IA contextuelle par section
@api_router.post("/section-assist", response_model=SectionAssistResponse)
async def get_section_assistance(request: SectionAssistRequest):
    """
    Endpoint pour obtenir une assistance IA spécifique à une section du PRD.
    """
    logger.info(f"Requête d'assistance IA pour section {request.section_key}, action {request.action_key}")
    
    try:
        # Initialiser l'assistant avec le fournisseur demandé
        section_assistant = AISectionAssistant(provider=request.provider)
        
        # Obtenir l'assistance pour la section
        response = await section_assistant.get_section_assistance(
            section_key=request.section_key,
            section_title=request.section_title,
            section_text=request.section_text,
            action_key=request.action_key,
            project_context=request.project_context
        )
        
        return SectionAssistResponse(response=response)
    
    except Exception as e:
        logger.error(f"Erreur avec l'Assistant IA par section: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la génération de l'assistance: {str(e)}"
        )

# PDF Export Route - On commente l'implémentation actuelle
# @api_router.post("/prd/export/pdf")
# async def export_prd_pdf(request: PDFRequest):
#     logger.info(f"Received request to export PRD to PDF: {request.filename}")
#     try:
#         # Configure fonts if needed (optional, depends on your HTML content)
#         font_config = FontConfiguration()
# 
#         # Convert HTML to PDF in memory
#         html = HTML(string=request.html_content)
#         pdf_bytes = html.write_pdf(font_config=font_config)
# 
#         logger.info(f"Successfully generated PDF: {request.filename}")
# 
#         # Create a streaming response
#         return StreamingResponse(
#             BytesIO(pdf_bytes),
#             media_type="application/pdf",
#             headers={f'Content-Disposition': f'attachment; filename="{request.filename}"'}
#         )
# 
#     except Exception as e:
#         logger.error(f"Error generating PDF for {request.filename}: {e}", exc_info=True)
#         raise HTTPException(status_code=500, detail=f"Could not generate PDF: {e}")

# Endpoint placeholder simple pour signaler que le PDF n'est pas disponible côté serveur
@api_router.post("/prd/export/pdf")
async def export_prd_pdf(request: PDFRequest):
    logger.info(f"Received PDF export request, but server-side PDF is not available: {request.filename}")
    raise HTTPException(
        status_code=501, 
        detail="Server-side PDF export is not implemented. Please use client-side PDF generation."
    )

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
