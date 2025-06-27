import React from 'react';
import type { Difficulty } from '../types';

// Icons for the toolkit cards
const QuizIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const MiniSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface InteractiveToolkitProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onGenerateQuiz: () => void;
  isQuizLoading: boolean;
  onGenerateBook: () => void;
  isBookLoading: boolean;
  locale: any;
}


const InteractiveToolkit: React.FC<InteractiveToolkitProps> = ({
  difficulty,
  onDifficultyChange,
  onGenerateQuiz,
  isQuizLoading,
  onGenerateBook,
  isBookLoading,
  locale
}) => {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Card */}
        <div className="bg-base-200 dark:bg-dark-base-200 rounded-2xl p-6 shadow-apple dark:shadow-apple-dark flex flex-col">
          <div className="flex items-start gap-4 mb-4">
              <QuizIcon />
              <div>
                  <h3 className="text-xl font-semibold text-content-100 dark:text-dark-content-100">{locale.quizToolkitTitle}</h3>
                  <p className="text-content-200 dark:text-dark-content-200">{locale.quizToolkitDescription}</p>
              </div>
          </div>
          <div className="mt-auto space-y-4 pt-4">
              <div className="flex items-center justify-between">
                  <label htmlFor="difficulty" className="font-medium text-content-100 dark:text-dark-content-100">{locale.difficulty}</label>
                  <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                      className="bg-base-100 dark:bg-dark-base-100 text-content-100 dark:text-dark-content-100 rounded-md px-3 py-1.5 border border-base-300 dark:border-dark-base-300 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                  >
                      <option value="easy">{locale.easy}</option>
                      <option value="medium">{locale.medium}</option>
                      <option value="hard">{locale.hard}</option>
                  </select>
              </div>
              <button
                  onClick={onGenerateQuiz}
                  disabled={isQuizLoading}
                  className="w-full bg-brand-primary text-white font-semibold py-3 px-6 rounded-full hover:opacity-90 transition-opacity transform hover:scale-105 disabled:opacity-75 disabled:cursor-wait"
              >
                  {isQuizLoading ? (
                      <div className="flex items-center justify-center gap-2">
                          <MiniSpinner />
                          <span>{locale.generatingQuiz}</span>
                      </div>
                  ) : (
                      locale.generateQuiz
                  )}
              </button>
          </div>
        </div>

        {/* Book Card */}
        <div className="bg-base-200 dark:bg-dark-base-200 rounded-2xl p-6 shadow-apple dark:shadow-apple-dark flex flex-col">
          <div className="flex items-start gap-4 mb-4">
              <BookIcon />
              <div>
                  <h3 className="text-xl font-semibold text-content-100 dark:text-dark-content-100">{locale.bookTitle}</h3>
                  <p className="text-content-200 dark:text-dark-content-200">{locale.bookDescription}</p>
              </div>
          </div>
          <div className="mt-auto pt-4">
              <button
                  onClick={onGenerateBook}
                  disabled={isBookLoading}
                  className="w-full bg-brand-primary text-white font-semibold py-3 px-6 rounded-full hover:opacity-90 transition-opacity transform hover:scale-105 disabled:opacity-75 disabled:cursor-wait"
              >
                  {isBookLoading ? (
                       <div className="flex items-center justify-center gap-2">
                          <MiniSpinner />
                          <span>{locale.generatingBook}</span>
                      </div>
                  ) : (
                      locale.generateBook
                  )}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveToolkit;
