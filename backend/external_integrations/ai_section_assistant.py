"""
Module d'intégration pour l'Assistant IA contextuel par section.
Génère des conseils, suggestions et amélioration spécifiques à chaque type de section du PRD.
"""

import logging
from typing import Dict, Any, Optional, List, Literal
from .ai_codeguide import AICodeGuide

# Configuration du logging
logger = logging.getLogger(__name__)

class AISectionAssistant:
    """
    Classe pour générer des réponses IA contextuelles spécifiques aux sections du PRD.
    Utilise le module AICodeGuide comme base pour communiquer avec les LLMs.
    """
    def __init__(self, provider: Literal["claude", "gemini"] = "claude"):
        """
        Initialise l'assistant IA avec le provider spécifié.
        
        Args:
            provider: Le fournisseur de LLM à utiliser ("claude" ou "gemini")
        """
        self.codeguide = AICodeGuide(provider=provider)
        
    async def get_section_assistance(self,
                                    section_key: str,
                                    section_title: str,
                                    section_text: str,
                                    action_key: str,
                                    project_context: Optional[Dict[str, Any]] = None) -> str:
        """
        Génère une assistance IA pour une section spécifique du PRD.
        
        Args:
            section_key: Identifiant de la section (ex: "problem", "solution")
            section_title: Titre de la section (ex: "Problem Statement")
            section_text: Contenu actuel de la section
            action_key: Type d'assistance demandé (ex: "clarify_problem")
            project_context: Contexte du projet (optionnel)
            
        Returns:
            La réponse générée par le LLM
        """
        # Construire le prompt spécifique pour cette action et cette section
        prompt = self._build_prompt_for_action(
            section_key=section_key,
            section_title=section_title,
            action_key=action_key,
            section_text=section_text,
            project_context=project_context
        )
        
        # Appeler le LLM via le module AICodeGuide
        response = await self.codeguide.get_response(
            question=prompt,
            project_context=project_context
        )
        
        return response
    
    def _build_prompt_for_action(self,
                               section_key: str,
                               section_title: str,
                               action_key: str,
                               section_text: str,
                               project_context: Optional[Dict[str, Any]] = None) -> str:
        """
        Construit un prompt spécifique pour l'action IA demandée.
        
        Args:
            section_key: Identifiant de la section
            section_title: Titre de la section
            action_key: Type d'assistance demandé
            section_text: Contenu actuel de la section
            project_context: Contexte du projet
            
        Returns:
            Le prompt formaté pour le LLM
        """
        # Base commune du prompt
        base_prompt = f"""
        Tu es un expert en rédaction de PRD (Product Requirements Document) et ton rôle est d'aider à améliorer la section "{section_title}".
        
        Voici le contenu actuel de cette section:
        
        "{section_text}"
        """
        
        # Ajout du contexte du projet si disponible
        if project_context:
            project_info = f"""
            Contexte du projet:
            - Nom: {project_context.get('name', 'Non spécifié')}
            - Type: {project_context.get('project_type', 'Non spécifié')}
            - Description: {project_context.get('description', 'Non spécifiée')}
            """
            base_prompt += f"\n\n{project_info}"
        
        # Partie spécifique du prompt selon l'action demandée
        action_prompts = {
            # Problem section actions
            "clarify_problem": """
                MISSION: Aide à clarifier et affiner la description du problème.
                
                Analyse le contenu existant et fournis:
                1. Une version plus claire et précise du problème
                2. Les éléments qui manquent dans la description actuelle
                3. Des questions pour approfondir la compréhension du problème
                
                Format ta réponse de façon structurée avec ces sections.
            """,
            
            "explore_causes": """
                MISSION: Aide à explorer les causes profondes du problème identifié.
                
                Utilise l'approche des "5 Pourquoi" pour:
                1. Identifier la cause apparente du problème
                2. Pour chaque cause, demander "Pourquoi?" pour aller plus loin
                3. Synthétiser les causes racines découvertes
                
                Format ta réponse comme un arbre de causes, en partant du problème initial pour aller vers les causes profondes.
            """,
            
            "identify_stakeholders": """
                MISSION: Identifier les principales parties prenantes concernées par ce problème.
                
                Basé sur le problème décrit:
                1. Liste les parties prenantes directement impactées
                2. Liste les parties prenantes indirectement impactées
                3. Pour chacune, explique leurs enjeux et perspectives
                
                Format ta réponse sous forme de tableau des parties prenantes avec leurs intérêts.
            """,
            
            # Solution section actions
            "brainstorm_solutions": """
                MISSION: Aide à générer des solutions potentielles au problème.
                
                En tenant compte du contexte:
                1. Propose 3-5 solutions différentes au problème
                2. Pour chaque solution, explique:
                   - Son approche principale
                   - Les bénéfices qu'elle apporterait
                   - Les défis potentiels
                3. Suggère des critères pour comparer ces solutions
                
                Format ta réponse avec des sections clairement délimitées pour chaque solution proposée.
            """,
            
            "evaluate_alternatives": """
                MISSION: Aide à évaluer objectivement différentes alternatives de solution.
                
                En analysant la solution proposée:
                1. Identifie 2-3 approches alternatives
                2. Propose une grille d'évaluation avec critères pertinents (coût, délai, faisabilité, etc.)
                3. Aide à comparer ces solutions de façon méthodique
                
                Format ta réponse sous forme de matrice de décision.
            """,
            
            "highlight_uniqueness": """
                MISSION: Aide à souligner l'unicité de la solution proposée.
                
                Basé sur la solution décrite:
                1. Identifie les éléments différenciateurs
                2. Compare implicitement avec des solutions existantes
                3. Renforce la proposition de valeur unique
                
                Format ta réponse pour mettre en avant les avantages compétitifs.
            """,
            
            # Target audience section actions
            "define_personas": """
                MISSION: Aide à définir des personas précis pour la cible du produit.
                
                À partir des informations sur l'audience cible:
                1. Propose 2-3 personas représentatifs
                2. Pour chaque persona, détaille:
                   - Profil démographique
                   - Objectifs et frustrations
                   - Comportements typiques
                   - Scénarios d'utilisation
                
                Format ta réponse sous forme de fiches de personas structurées.
            """,
            
            "segment_audience": """
                MISSION: Aide à segmenter l'audience cible de façon stratégique.
                
                Analyse l'audience décrite et propose:
                1. Une segmentation en 3-5 segments pertinents
                2. Les critères de segmentation utilisés
                3. Les caractéristiques distinctives de chaque segment
                4. Une priorisation des segments pour le MVP
                
                Format ta réponse avec une structure claire par segment.
            """,
            
            # Default action if none matched
            "default": f"""
                MISSION: Améliore la section "{section_title}" du PRD.
                
                Aide à:
                1. Améliorer la clarté et la précision du contenu
                2. Identifier les éléments manquants ou à développer
                3. Structurer l'information de façon plus efficace
                
                Format ta réponse de manière constructive avec des suggestions concrètes.
            """
        }
        
        # Utiliser le prompt spécifique ou le prompt par défaut
        action_prompt = action_prompts.get(action_key, action_prompts["default"])
        
        return f"{base_prompt}\n\n{action_prompt}" 