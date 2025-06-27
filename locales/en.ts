export const en = {
  // App.tsx
  topicPlaceholder: "Enter a topic, or upload a file...",
  startLearning: "Generate Guide",
  generating: "Generating...",
  errorTopic: "Please enter a topic or upload a file to begin.",
  errorUnknown: "An unknown error occurred. Please try again.",
  errorQuiz: "Failed to generate quiz. The AI may be busy, please try again.",
  errorBook: "Failed to generate the book. The AI may be busy, please try again.",
  toggleTheme: "Toggle theme",
  selectLanguage: "Select language",
  uploadFile: "Upload material (PDF, TXT)",
  parsingFile: "Analyzing file...",
  errorFile: "Unsupported file. Please upload a PDF or .txt file.",
  clearFile: "Clear file",

  // Welcome.tsx
  welcomeTitle: "Welcome to LEARNED",
  welcomeSubtitle: "Your personal AI-powered learning companion. Start by entering a topic or uploading a document to generate a comprehensive study guide.",
  feature1Title: "Dynamic Study Guides",
  feature1Desc: "Instantly create detailed guides on any subject, complete with core concepts and key terms.",
  feature2Title: "Interactive Quizzes",
  feature2Desc: "Test your understanding with custom-generated quizzes at easy, medium, or hard difficulty levels.",
  feature3Title: "AI-Powered Chat",
  feature3Desc: "Ask follow-up questions and dive deeper into topics with a conversational AI tutor.",

  // Spinner.tsx
  spinnerMessage: "Crafting your study guide...",

  // StudyGuideDisplay.tsx
  coreConcepts: "Core Concepts",
  keyTerms: "Key Terms",

  // BookView.tsx
  closeBook: "Close",
  bookAuthor: "A Deep Dive by LEARNED AI",
  tocTitle: "Table of Contents",
  introductionTitle: "Introduction",
  glossaryTitle: "Glossary",
  theEnd: "The End",
  finalMessage: "Your journey into this topic has just begun. This guidebook is yours to keep. Return to it anytime to deepen your understanding and spark new curiosity.",
  allRightsReserved: "All rights reserved.",
  exportToPdf: "Export to PDF",
  exportingPdf: "Exporting...",

  // Interactive Toolkit
  quizToolkitTitle: "Interactive Quiz",
  quizToolkitDescription: "Test your knowledge with a custom quiz.",
  difficulty: "Difficulty",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  generateQuiz: "Generate Quiz",
  generatingQuiz: "Generating your quiz...",
  bookTitle: "Full Guidebook",
  bookDescription: "Expand your study guide into a comprehensive, multi-chapter digital book.",
  generateBook: "Generate Full Book",
  generatingBook: "Writing your book...",

  // QuizDisplay.tsx
  quizTitle: "Knowledge Check",
  questionProgress: (current: number, total: number) => `Question ${current} of ${total}`,
  correct: "Correct!",
  incorrect: "Incorrect",
  previousQuestion: "Previous Question",
  nextQuestion: "Next Question",
  finishQuiz: "Finish Quiz",
  quizResultsTitle: "Quiz Complete!",
  quizResults: (score: number, total: number) => `You scored ${score} out of ${total}.`,
  quizExcellent: "Excellent work!",
  quizGood: "Great job!",
  quizOkay: "Good effort, keep practicing!",
  tryAgain: "Try a New Quiz",

  // ChatInterface.tsx
  chatHeader: "Chat with Your AI Tutor",
  chatPlaceholder: "Ask anything about this topic...",
  chatWelcome: (topic: string) => `Hi there! I've prepared a study guide for you on ${topic}. Feel free to ask me anything about it!`,
  chatError: "Sorry, I encountered an error. Please try again.",
};