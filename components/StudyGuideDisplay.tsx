
import React from 'react';
import { StudyGuide } from '../types';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-base-200 dark:bg-dark-base-200 rounded-2xl p-6 md:p-8 shadow-apple dark:shadow-apple-dark animate-fade-in">
    <h3 className="text-xl font-semibold text-content-100 dark:text-dark-content-100 mb-5">{title}</h3>
    {children}
  </div>
);

interface StudyGuideDisplayProps {
    guide: StudyGuide;
    coreConceptsLabel: string;
    keyTermsLabel: string;
}

const StudyGuideDisplay: React.FC<StudyGuideDisplayProps> = ({ guide, coreConceptsLabel, keyTermsLabel }) => {
  return (
    <div className="space-y-6">
      <header className="animate-fade-in text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-content-100 dark:text-dark-content-100 capitalize">{guide.topic}</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-content-200 dark:text-dark-content-200 leading-relaxed">{guide.summary}</p>
      </header>

      <div className="space-y-6">
        <Section title={coreConceptsLabel}>
          <ul className="space-y-6">
            {guide.core_concepts.map((item, index) => (
              <li key={index} className="border-l-2 border-brand-primary pl-5">
                <h4 className="text-lg font-semibold text-content-100 dark:text-dark-content-100">{item.concept}</h4>
                <p className="mt-1 text-content-200 dark:text-dark-content-200 leading-relaxed">{item.explanation}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={keyTermsLabel}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {guide.key_terms.map((item, index) => (
              <div key={index}>
                <h4 className="font-semibold text-content-100 dark:text-dark-content-100">{item.term}</h4>
                <p className="text-content-200 dark:text-dark-content-200">{item.definition}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default StudyGuideDisplay;
