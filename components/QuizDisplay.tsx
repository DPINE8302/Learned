import React, { useState } from 'react';
import type { Quiz } from '../types';

interface QuizDisplayProps {
  quiz: Quiz;
  onTryAgain: () => void;
  locale: any;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const QuizDisplay: React.FC<QuizDisplayProps> = ({ quiz, onTryAgain, locale }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    Array(quiz.length).fill(null)
  );
  const [quizFinished, setQuizFinished] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const currentQuestion = quiz[currentQuestionIndex];
  const isCurrentQuestionAnswered = userAnswers[currentQuestionIndex] !== null;
  const progressPercent = ((currentQuestionIndex + 1) / quiz.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (isCurrentQuestionAnswered) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = index;
    setUserAnswers(newAnswers);
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    setIsFadingOut(true);
    setTimeout(() => {
        if (direction === 'next' && currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
        } else if (direction === 'prev' && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(i => i - 1);
        }
        setIsFadingOut(false);
    }, 300);
  };

  const handleFinishQuiz = () => {
      setIsFadingOut(true);
      setTimeout(() => {
          setQuizFinished(true);
          setIsFadingOut(false);
      }, 300);
  };
  
  const getButtonClass = (index: number) => {
    let baseClass = "flex justify-between items-center w-full text-left p-4 rounded-xl transition-all duration-300 transform ";
    
    if (!isCurrentQuestionAnswered) {
        return baseClass + "bg-base-200 dark:bg-dark-base-200 hover:bg-base-300 dark:hover:bg-dark-base-300 hover:scale-105";
    }

    const isCorrectAnswer = index === currentQuestion.correct_answer_index;
    const selectedAnswer = userAnswers[currentQuestionIndex];

    if (isCorrectAnswer) {
        return baseClass + "bg-green-500 text-white scale-105 shadow-lg";
    }
    if (index === selectedAnswer) {
        return baseClass + "bg-red-500 text-white";
    }
    return baseClass + "bg-base-200 dark:bg-dark-base-200 opacity-50";
  }

  const getResultFeedback = (score: number) => {
      const percentage = (score / quiz.length) * 100;
      if (percentage === 100) return locale.quizExcellent;
      if (percentage >= 70) return locale.quizGood;
      return locale.quizOkay;
  }

  if (quizFinished) {
    const score = userAnswers.reduce((acc, answer, index) => {
      if (answer === quiz[index].correct_answer_index) {
        return acc + 1;
      }
      return acc;
    }, 0);
    const scorePercentage = (score / quiz.length) * 100;
    const circumference = 2 * Math.PI * 52; // 2 * pi * r

    return (
      <div className="bg-base-200 dark:bg-dark-base-200 rounded-2xl p-6 md:p-8 shadow-apple dark:shadow-apple-dark animate-fade-in text-center flex flex-col items-center">
        <h3 className="text-2xl font-bold text-content-100 dark:text-dark-content-100 mb-4">{locale.quizResultsTitle}</h3>
        
        <div className="relative w-40 h-40 my-4">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-base-300 dark:text-dark-base-300" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle 
                    className="text-brand-primary"
                    strokeWidth="10" 
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (scorePercentage / 100) * circumference}
                    strokeLinecap="round"
                    stroke="currentColor" 
                    fill="transparent" 
                    r="52" cx="60" cy="60"
                    style={{ transition: 'stroke-dashoffset 1s ease-out', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-content-100 dark:text-dark-content-100">{score}</span>
                <span className="text-lg text-content-200 dark:text-dark-content-200">/ {quiz.length}</span>
            </div>
        </div>

        <p className="text-xl font-semibold text-content-100 dark:text-dark-content-100 mb-6">{getResultFeedback(score)}</p>
        <button
          onClick={onTryAgain}
          className="bg-brand-primary text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          {locale.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-base-200 dark:bg-dark-base-200 rounded-2xl p-4 md:p-6 shadow-apple dark:shadow-apple-dark animate-fade-in">
        <div className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-semibold text-content-100 dark:text-dark-content-100">{locale.quizTitle}</h3>
                <p className="text-sm font-medium text-content-200 dark:text-dark-content-200">{locale.questionProgress(currentQuestionIndex + 1, quiz.length)}</p>
            </div>
            <div className="w-full bg-base-300 dark:bg-dark-base-300 rounded-full h-2.5">
                <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>
      
      <div className={`transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-xl text-content-100 dark:text-dark-content-100 mb-8 min-h-[6rem] font-semibold text-center">{currentQuestion.question}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isCurrentQuestionAnswered}
              className={getButtonClass(index)}
            >
              <span>{option}</span>
              {isCurrentQuestionAnswered && (
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/30">
                    {index === currentQuestion.correct_answer_index ? <CheckIcon/> : (index === userAnswers[currentQuestionIndex] ? <XIcon/> : null)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {isCurrentQuestionAnswered && (
        <div className={`mt-6 animate-fade-in transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`p-4 rounded-xl ${userAnswers[currentQuestionIndex] === currentQuestion.correct_answer_index ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
            <h4 className={`font-bold text-lg ${userAnswers[currentQuestionIndex] === currentQuestion.correct_answer_index ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {userAnswers[currentQuestionIndex] === currentQuestion.correct_answer_index ? locale.correct : locale.incorrect}
            </h4>
            <p className="mt-1 text-content-200 dark:text-dark-content-200">{currentQuestion.explanation}</p>
          </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => handleNavigation('prev')}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 font-semibold rounded-full transition-colors text-content-200 dark:text-dark-content-200 hover:bg-base-300 dark:hover:bg-dark-base-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {locale.previousQuestion}
                </button>
                {currentQuestionIndex < quiz.length - 1 ? (
                    <button
                        onClick={() => handleNavigation('next')}
                        className="bg-brand-primary text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity transform hover:scale-105"
                    >
                        {locale.nextQuestion}
                    </button>
                ) : (
                    <button
                        onClick={handleFinishQuiz}
                        className="bg-brand-primary text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity transform hover:scale-105"
                    >
                        {locale.finishQuiz}
                    </button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default QuizDisplay;