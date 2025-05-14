"""
Module d'intégration pour le Chatbot AI CodeGuide.
Permet de communiquer avec différents LLMs (Claude de Anthropic ou Gemini de Google)
pour fournir des conseils et réponses aux questions sur le développement de produits.
"""

import os
import logging
import json
from typing import Dict, Any, Optional, List, Union, Literal

# Imports conditionnel pour éviter les erreurs si une bibliothèque n'est pas installée
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

# Configuration du logging
logger = logging.getLogger(__name__)

class AICodeGuide:
    """
    Classe principale pour l'intégration avec les LLMs.
    """
    def __init__(self, provider: Literal["claude", "gemini"] = "claude"):
        """
        Initialise le Chatbot CodeGuide avec le fournisseur spécifié.
        
        Args:
            provider: Le fournisseur de LLM à utiliser: "claude" ou "gemini"
        """
        self.provider = provider
        self.client = None
        self._setup_client()
        
    def _setup_client(self):
        """
        Configure le client approprié selon le fournisseur choisi.
        Vérifie la disponibilité des clés API nécessaires.
        """
        if self.provider == "claude":
            if not ANTHROPIC_AVAILABLE:
                raise ImportError("La bibliothèque anthropic n'est pas installée. Utilisez 'pip install anthropic'.")
            
            api_key = os.environ.get('ANTHROPIC_API_KEY')
            if not api_key:
                raise ValueError("La clé API ANTHROPIC_API_KEY n'est pas définie dans les variables d'environnement.")
            
            # Utiliser AsyncAnthropic pour les opérations asynchrones
            self.client = anthropic.AsyncAnthropic(api_key=api_key)
            logger.info("Client AsyncAnthropic (Claude) initialisé avec succès.")
            
        elif self.provider == "gemini":
            if not GENAI_AVAILABLE:
                raise ImportError("La bibliothèque google-generativeai n'est pas installée. Utilisez 'pip install google-generativeai'.")
            
            api_key = os.environ.get('GOOGLE_API_KEY')
            if not api_key:
                raise ValueError("La clé API GOOGLE_API_KEY n'est pas définie dans les variables d'environnement.")
            
            genai.configure(api_key=api_key)
            self.client = genai
            logger.info("Client Google Generative AI (Gemini) initialisé avec succès.")
            
        else:
            raise ValueError(f"Fournisseur non pris en charge: {self.provider}. Utilisez 'claude' ou 'gemini'.")
    
    async def get_response(self, 
                           question: str,
                           project_context: Optional[Dict[str, Any]] = None,
                           prd_content: Optional[Dict[str, Any]] = None,
                           message_history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Obtient une réponse du LLM à la question posée, en tenant compte du contexte.
        
        Args:
            question: La question posée par l'utilisateur
            project_context: Contexte du projet (optionnel)
            prd_content: Contenu du PRD actuel (optionnel)
            message_history: Historique de la conversation (optionnel)
            
        Returns:
            La réponse générée par le LLM
        """
        logger.info(f"Obtention d'une réponse pour la question: {question[:50]}...")
        
        # Construction du prompt avec le contexte et la question
        system_prompt = self._build_system_prompt(project_context, prd_content)
        
        if self.provider == "claude":
            return await self._get_claude_response(question, system_prompt, message_history)
        elif self.provider == "gemini":
            return await self._get_gemini_response(question, system_prompt, message_history)
        else:
            raise ValueError(f"Fournisseur non pris en charge: {self.provider}. Utilisez 'claude' ou 'gemini'.")
    
    def _build_system_prompt(self, 
                            project_context: Optional[Dict[str, Any]] = None,
                            prd_content: Optional[Dict[str, Any]] = None) -> str:
        """
        Construit le prompt système pour guider le LLM.
        
        Args:
            project_context: Informations sur le projet
            prd_content: Contenu du PRD actuel
            
        Returns:
            Le prompt système formaté
        """
        system_prompt = """
        Tu es CodeGuide, un assistant expert en développement de produits, documentation technique, et bonnes pratiques de développement.
        
        Ta mission est d'aider les utilisateurs à rédiger des PRD (Product Requirements Documents) de haute qualité, 
        à comprendre les aspects techniques de leur projet, et à prendre des décisions éclairées sur l'architecture et les technologies.
        
        Réponds dans un style professionnel, concis et constructif. Fournis des exemples pertinents quand c'est utile.
        """
        
        if project_context:
            project_info = f"""
            Informations sur le projet:
            - Nom: {project_context.get('name', 'Non spécifié')}
            - Type: {project_context.get('project_type', 'Non spécifié')}
            - Description: {project_context.get('description', 'Non spécifiée')}
            """
            system_prompt += project_info
        
        if prd_content:
            prd_sections = []
            for key, value in prd_content.items():
                if value.get('title') and value.get('content'):
                    section = f"{value.get('title')}: {value.get('content')[:200]}..."
                    prd_sections.append(section)
            
            if prd_sections:
                prd_info = "Sections du PRD actuel (extraits):\n" + "\n".join(prd_sections)
                system_prompt += f"\n\n{prd_info}"
        
        return system_prompt
    
    async def _get_claude_response(self, 
                                  question: str,
                                  system_prompt: str,
                                  message_history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Obtient une réponse de Claude (Anthropic).
        
        Args:
            question: La question de l'utilisateur
            system_prompt: Le prompt système/contexte
            message_history: L'historique de la conversation
        
        Returns:
            La réponse de Claude
        """
        try:
            messages = []
            
            # Ajouter l'historique des messages s'il existe
            if message_history:
                for msg in message_history:
                    if msg.get("role") == "user":
                        messages.append({"role": "user", "content": msg.get("content", "")})
                    elif msg.get("role") == "assistant":
                        messages.append({"role": "assistant", "content": msg.get("content", "")})
            
            # Ajouter la question actuelle
            messages.append({"role": "user", "content": question})
            
            # Appeler l'API Claude
            response_object = await self.client.messages.create(
                model="claude-3-haiku-20240307",
                system=system_prompt,
                messages=messages,
                max_tokens=1024
            )
            
            # Récupérer le texte de la réponse
            if response_object.content and isinstance(response_object.content, list) and len(response_object.content) > 0:
                if hasattr(response_object.content[0], 'text'):
                    return response_object.content[0].text
                else:
                    logger.error("Le premier bloc de contenu de la réponse Claude n'a pas d'attribut 'text'.")
                    return "Erreur: Le format de la réponse de Claude est inattendu (pas de texte dans le premier bloc)."
            else:
                logger.error("La réponse de Claude ne contient pas de contenu valide ou est vide.")
                return "Erreur: La réponse de Claude est vide ou mal formatée."
        
        except Exception as e:
            logger.error(f"Erreur lors de l'appel à l'API Claude: {str(e)}", exc_info=True)
            return f"Désolé, je n'ai pas pu obtenir une réponse. Erreur: {str(e)}"
    
    async def _get_gemini_response(self, 
                                   question: str,
                                   system_prompt: str,
                                   message_history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Obtient une réponse de Gemini (Google).
        
        Args:
            question: La question de l'utilisateur
            system_prompt: Le prompt système/contexte
            message_history: L'historique de la conversation
        
        Returns:
            La réponse de Gemini
        """
        try:
            # Configurer le modèle
            model = self.client.GenerativeModel('gemini-1.5-pro')
            
            # Préparer l'historique et la nouvelle question
            chat = model.start_chat(history=[])
            
            if message_history:
                for msg in message_history:
                    if msg.get("role") == "user":
                        chat.history.append({"role": "user", "parts": [msg.get("content", "")]})
                    elif msg.get("role") == "model":
                        chat.history.append({"role": "model", "parts": [msg.get("content", "")]})
            
            # Ajouter le prompt système comme premier message si l'historique est vide
            if not message_history:
                chat.history.append({"role": "user", "parts": [system_prompt]})
                chat.history.append({"role": "model", "parts": ["Je comprends mon rôle et je suis prêt à aider."]})
            
            # Envoyer la question
            response = chat.send_message(question)
            
            # Récupérer la réponse
            return response.text
        
        except Exception as e:
            logger.error(f"Erreur lors de l'appel à l'API Gemini: {str(e)}")
            return f"Désolé, je n'ai pas pu obtenir une réponse. Erreur: {str(e)}" 