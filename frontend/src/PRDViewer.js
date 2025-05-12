import React from 'react';
import ReactMarkdown from 'react-markdown';

const PRDViewer = ({ prdContent }) => {
  // Convertir le contenu JSON du PRD en format Markdown
  const generateMarkdown = () => {
    if (!prdContent) return '';
    
    let markdown = '';
    
    Object.keys(prdContent).forEach(key => {
      const section = prdContent[key];
      if (section.title && section.content) {
        markdown += `## ${section.title}\n\n${section.content || 'No content yet.'}\n\n`;
      }
    });
    
    return markdown;
  };

  const markdownContent = generateMarkdown();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown>
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PRDViewer;