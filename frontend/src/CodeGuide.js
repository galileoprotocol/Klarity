import React, { useState, useEffect, useRef } from 'react';
import { supabase, codeGuideAPI } from './api';
import './CodeGuide.css';

const CodeGuide = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState('claude'); // 'claude' ou 'gemini'
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scrolle automatiquement vers le dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fonction pour envoyer une question au backend
  const sendQuestion = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // Ajoute le message de l'utilisateur à la conversation
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    
    try {
      // Prépare les données pour la requête
      const questionData = {
        question: input,
        project_id: projectId || null,
        message_history: messages,
        provider: provider
      };
      
      // Appel à l'API backend via notre module API
      const response = await codeGuideAPI.askQuestion(questionData);
      
      // Ajoute la réponse du chatbot à la conversation
      setMessages([...updatedMessages, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Erreur CodeGuide:', error);
      setError(error.message || 'Une erreur est survenue lors de la communication avec le serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    sendQuestion();
  };

  // Formater les messages avec du Markdown basique (pour les listes et le code)
  const formatMessage = (content) => {
    // Cette fonction est simpliste, pour un vrai rendu Markdown,
    // il faudrait utiliser une bibliothèque comme react-markdown
    return content
      .replace(/\n/g, '<br/>')
      .replace(/```(.+?)```/gs, '<pre><code>$1</code></pre>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  };

  return (
    <div className="codeguide-container">
      <div className="codeguide-header">
        <h2>CodeGuide AI Assistant</h2>
        <div className="provider-selector">
          <label>Modèle IA:</label>
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            disabled={isLoading}
          >
            <option value="claude">Claude (Anthropic)</option>
            <option value="gemini">Gemini (Google)</option>
          </select>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Posez une question sur votre développement, architecture, ou bonnes pratiques.</p>
            <p>Exemples :</p>
            <ul>
              <li>"Comment structurer mon PRD pour un projet SaaS B2B ?"</li>
              <li>"Quelle architecture recommandée pour mon application de gestion de données ?"</li>
              <li>"Comment écrire des user stories efficaces pour cette fonctionnalité ?"</li>
            </ul>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-header">
                <strong>{msg.role === 'user' ? 'Vous' : 'CodeGuide'}</strong>
              </div>
              <div 
                className="message-content"
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="loading-indicator">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>CodeGuide réfléchit...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>Erreur: {error}</p>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question ici..."
          disabled={isLoading}
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default CodeGuide; 