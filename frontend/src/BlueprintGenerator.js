import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Composant pour le générateur de Blueprint technique (version basique pour MVP1.4)
const BlueprintGenerator = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  // États pour le questionnaire
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    projectType: '',
    userCount: '',
    dataComplexity: '',
    securityLevel: '',
    timeConstraint: '',
    budget: '',
    platformType: ''
  });
  
  // Options pour le questionnaire
  const projectTypes = [
    { id: 'web_app', name: 'Application Web' },
    { id: 'mobile_app', name: 'Application Mobile' },
    { id: 'saas', name: 'SaaS (Software as a Service)' },
    { id: 'ecommerce', name: 'E-Commerce' },
    { id: 'marketplace', name: 'Marketplace' },
    { id: 'ai_ml', name: 'Solution IA/ML' },
    { id: 'other', name: 'Autre' }
  ];
  
  const userCounts = [
    { id: 'small', name: 'Petit (< 100 utilisateurs)' },
    { id: 'medium', name: 'Moyen (100-1000 utilisateurs)' },
    { id: 'large', name: 'Grand (1000-10,000 utilisateurs)' },
    { id: 'enterprise', name: 'Enterprise (> 10,000 utilisateurs)' }
  ];
  
  const dataComplexities = [
    { id: 'simple', name: 'Simple (quelques entités)' },
    { id: 'moderate', name: 'Modéré (10-20 entités)' },
    { id: 'complex', name: 'Complexe (20+ entités, relations complexes)' }
  ];
  
  const securityLevels = [
    { id: 'basic', name: 'Basique (authentification simple)' },
    { id: 'medium', name: 'Moyen (authentification, autorisation, données chiffrées)' },
    { id: 'high', name: 'Élevé (conformité réglementaire, audit, multi-facteur)' }
  ];
  
  const timeConstraints = [
    { id: 'urgent', name: 'Urgent (< 1 mois)' },
    { id: 'normal', name: 'Normal (1-3 mois)' },
    { id: 'relaxed', name: 'Détendu (3+ mois)' }
  ];
  
  const budgets = [
    { id: 'low', name: 'Faible (< 10k€)' },
    { id: 'medium', name: 'Moyen (10k-50k€)' },
    { id: 'high', name: 'Élevé (50k-200k€)' },
    { id: 'enterprise', name: 'Enterprise (200k€+)' }
  ];
  
  const platformTypes = [
    { id: 'web', name: 'Web uniquement' },
    { id: 'android', name: 'Android uniquement' },
    { id: 'ios', name: 'iOS uniquement' },
    { id: 'cross_platform', name: 'Multi-plateforme (Web & Mobile)' }
  ];
  
  // Mise à jour des réponses
  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value
    });
  };
  
  // Navigation entre les étapes
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Générer des recommandations basées sur les réponses
  const generateRecommendations = () => {
    // Dans une version future, ce serait basé sur l'IA ou des règles plus complexes
    // Pour MVP1.4, nous utilisons des recommandations simplifiées basées sur des règles
    
    let frontend = '';
    let backend = '';
    let database = '';
    let hosting = '';
    let additionalServices = [];
    
    // Déterminer le frontend
    if (answers.projectType === 'web_app' || answers.projectType === 'saas' || answers.platformType === 'web') {
      frontend = 'React.js avec Next.js, Tailwind CSS pour l\'UI';
    } else if (answers.projectType === 'mobile_app') {
      if (answers.platformType === 'android') {
        frontend = 'Native Android (Kotlin)';
      } else if (answers.platformType === 'ios') {
        frontend = 'Native iOS (Swift)';
      } else {
        frontend = 'React Native ou Flutter pour développement cross-platform';
      }
    } else if (answers.platformType === 'cross_platform') {
      frontend = 'React.js pour web, React Native pour mobile';
    }
    
    // Déterminer le backend
    if (answers.dataComplexity === 'complex' || answers.securityLevel === 'high') {
      backend = 'Node.js (Express) ou Python (FastAPI/Django) avec architecture microservices';
    } else {
      backend = 'Node.js (Express) ou Python (FastAPI) avec architecture monolithique';
    }
    
    // Déterminer la base de données
    if (answers.dataComplexity === 'complex') {
      database = 'PostgreSQL avec potentiellement MongoDB pour certains aspects';
    } else if (answers.dataComplexity === 'moderate') {
      database = 'PostgreSQL';
    } else {
      database = 'SQLite ou PostgreSQL simple';
    }
    
    // Déterminer l'hébergement
    if (answers.userCount === 'enterprise' || answers.userCount === 'large') {
      hosting = 'AWS ou GCP avec Kubernetes pour la scalabilité';
    } else if (answers.timeConstraint === 'urgent') {
      hosting = 'Vercel, Netlify, ou Heroku pour un déploiement rapide';
    } else {
      hosting = 'AWS, GCP ou Azure avec conteneurs Docker';
    }
    
    // Services additionnels
    if (answers.securityLevel === 'high') {
      additionalServices.push('AWS Cognito ou Auth0 pour l\'authentification avancée');
      additionalServices.push('Audit de sécurité régulier');
    }
    
    if (answers.userCount === 'enterprise' || answers.userCount === 'large') {
      additionalServices.push('CDN pour optimisation globale');
      additionalServices.push('Système de monitoring et alerting (Datadog, New Relic)');
    }
    
    if (answers.projectType === 'ecommerce' || answers.projectType === 'marketplace') {
      additionalServices.push('Stripe ou PayPal pour les paiements');
      additionalServices.push('Système de notification par email/SMS');
    }
    
    if (answers.projectType === 'ai_ml') {
      additionalServices.push('TensorFlow ou PyTorch pour les modèles ML');
      additionalServices.push('Infrastructure GPU si nécessaire');
    }
    
    return {
      frontend,
      backend,
      database,
      hosting,
      additionalServices
    };
  };
  
  // Contenu basé sur l'étape actuelle
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Type de Projet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Sélectionnez le type de projet que vous développez.
            </p>
            <div className="mt-4">
              <select
                name="projectType"
                value={answers.projectType}
                onChange={handleChange}
                className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez un type...</option>
                {projectTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Plateforme Cible</h4>
              <select
                name="platformType"
                value={answers.platformType}
                onChange={handleChange}
                className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez une plateforme...</option>
                {platformTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Échelle et Complexité</h3>
            <p className="text-sm text-gray-500 mb-4">
              Évaluez la taille et la complexité de votre projet.
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Nombre d'Utilisateurs Estimé</h4>
              <select
                name="userCount"
                value={answers.userCount}
                onChange={handleChange}
                className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez une échelle...</option>
                {userCounts.map(count => (
                  <option key={count.id} value={count.id}>{count.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Complexité des Données</h4>
              <select
                name="dataComplexity"
                value={answers.dataComplexity}
                onChange={handleChange}
                className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez la complexité...</option>
                {dataComplexities.map(complexity => (
                  <option key={complexity.id} value={complexity.id}>{complexity.name}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contraintes du Projet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Définissez les contraintes principales de votre projet.
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Niveau de Sécurité Requis</h4>
              <select
                name="securityLevel"
                value={answers.securityLevel}
                onChange={handleChange}
                className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez un niveau...</option>
                {securityLevels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Contrainte de Temps</h4>
              <select
                name="timeConstraint"
                value={answers.timeConstraint}
                onChange={handleChange}
                className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez une contrainte...</option>
                {timeConstraints.map(constraint => (
                  <option key={constraint.id} value={constraint.id}>{constraint.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Approximatif</h4>
              <select
                name="budget"
                value={answers.budget}
                onChange={handleChange}
                className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez un budget...</option>
                {budgets.map(budget => (
                  <option key={budget.id} value={budget.id}>{budget.name}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 4:
        const recommendations = generateRecommendations();
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recommandations Techniques</h3>
            <p className="text-sm text-gray-500 mb-4">
              Basé sur vos réponses, voici nos recommandations techniques pour votre projet.
            </p>
            
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Blueprint Technique Recommandé
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Ces recommandations sont basées sur vos réponses et les meilleures pratiques de l'industrie.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Frontend</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{recommendations.frontend}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Backend</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{recommendations.backend}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Base de Données</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{recommendations.database}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Hébergement</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{recommendations.hosting}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Services Additionnels</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {recommendations.additionalServices.length > 0 ? (
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {recommendations.additionalServices.map((service, index) => (
                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                <span className="ml-2 flex-1 w-0 truncate">{service}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>Aucun service additionnel recommandé.</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Note: Ces recommandations sont génériques et devraient être adaptées à vos besoins spécifiques. 
                Dans une prochaine version, nous fournirons des recommandations plus personnalisées et détaillées.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Vérifier si le bouton suivant doit être désactivé
  const isNextDisabled = () => {
    switch(step) {
      case 1:
        return !answers.projectType || !answers.platformType;
      case 2:
        return !answers.userCount || !answers.dataComplexity;
      case 3:
        return !answers.securityLevel || !answers.timeConstraint || !answers.budget;
      default:
        return false;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              Générateur de Blueprint Technique
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Répondez à quelques questions pour obtenir des recommandations techniques pour votre projet.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retour au Projet
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
            {[
              { id: 1, name: 'Type de Projet' },
              { id: 2, name: 'Échelle et Complexité' },
              { id: 3, name: 'Contraintes' },
              { id: 4, name: 'Recommandations' }
            ].map((stepItem) => (
              <li key={stepItem.id} className="md:flex-1">
                <div
                  className={`flex flex-col border-l-4 ${
                    step === stepItem.id
                      ? 'border-primary-500'
                      : step > stepItem.id
                      ? 'border-primary-300'
                      : 'border-gray-200'
                  } py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                >
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      step === stepItem.id
                        ? 'text-primary-600'
                        : step > stepItem.id
                        ? 'text-primary-400'
                        : 'text-gray-500'
                    }`}
                  >
                    Étape {stepItem.id}
                  </span>
                  <span className="text-sm font-medium">{stepItem.name}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Main Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                  step === 1
                    ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                Précédent
              </button>
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isNextDisabled()
                      ? 'bg-primary-300 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  }`}
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${projectId}`)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Terminer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintGenerator;