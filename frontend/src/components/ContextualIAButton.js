import React, { useState, useRef, useEffect } from 'react';
import '../styles/ContextualIAButton.css';

/**
 * Bouton IA contextuel qui affiche un menu déroulant d'actions IA
 * @param {string} sectionTitle - Titre de la section (pour l'info-bulle)
 * @param {Array} iaActions - Tableau d'objets {key, label} pour les actions IA disponibles
 * @param {Function} onActionSelect - Fonction appelée avec (actionKey, sectionTitle) à la sélection
 */
const ContextualIAButton = ({ sectionTitle, iaActions, onActionSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Si pas d'actions disponibles, ne pas afficher le bouton
  if (!iaActions || iaActions.length === 0) {
    return null;
  }

  return (
    <div className="ia-button-container" ref={dropdownRef}>
      <button
        className="ia-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        title={`Assistance IA pour ${sectionTitle}`}
      >
        <span role="img" aria-label="AI Assistant">💡</span>
      </button>
      
      {isDropdownOpen && (
        <div className="ia-dropdown">
          <div className="ia-dropdown-header">
            Assistance IA pour {sectionTitle}
          </div>
          <ul className="ia-dropdown-menu">
            {iaActions.map((action) => (
              <li key={action.key} className="ia-dropdown-item">
                <button
                  className="ia-action-button"
                  onClick={() => {
                    onActionSelect(action.key, sectionTitle);
                    setIsDropdownOpen(false);
                  }}
                >
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContextualIAButton; 