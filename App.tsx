


import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateStudyGuide, startChat, generateQuiz, generateFullBook } from './services/geminiService';
import { en } from './locales/en';
import { th } from './locales/th';
import type { StudyGuide, ChatMessage, Language, Quiz, Difficulty, FullBook, BookChapter } from './types';
import type { Chat } from '@google/genai';
import StudyGuideDisplay from './components/StudyGuideDisplay';
import ChatInterface from './components/ChatInterface';
import Spinner from './components/Spinner';
import QuizDisplay from './components/QuizDisplay';
import BookView from './components/BookView';
import Welcome from './components/Welcome';
import InteractiveToolkit from './components/InteractiveToolkit';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const translations = { en, th };

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a6 6 0 100 12 6 6 0 000-12z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.921-.994 6.752-2.625z" />
  </svg>
);

const PaperClipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
    </svg>
);

const DocumentTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const ToastSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isFileProcessing, setIsFileProcessing] = useState<boolean>(false);
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState<boolean>(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatResponding, setIsChatResponding] = useState<boolean>(false);

  const [isBookViewOpen, setIsBookViewOpen] = useState(false);
  const [fullBookContent, setFullBookContent] = useState<FullBook | null>(null);
  const [cachedFullBook, setCachedFullBook] = useState<FullBook | null>(null);
  const [isBookLoading, setIsBookLoading] = useState<boolean>(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = window.localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLang = window.localStorage.getItem('language') as Language;
      if (savedLang) return savedLang;
    }
    return 'en';
  });
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  const prevIsLoading = usePrevious(isLoading);
  const t = translations[language];

  useEffect(() => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.mjs`;
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    // When generation finishes (isLoading changes from true to false) and a guide is present,
    // ensure the user's view remains at the top of the page.
    if (prevIsLoading && !isLoading && studyGuide) {
      window.scrollTo(0, 0);
    }
  }, [isLoading, prevIsLoading, studyGuide]);
  
  useEffect(() => {
    const checkScrollTop = () => {
        if (!showBackToTop && window.pageYOffset > 400) {
            setShowBackToTop(true);
        } else if (showBackToTop && window.pageYOffset <= 400) {
            setShowBackToTop(false);
        }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showBackToTop]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const extractTextFromPdf = async (fileToProcess: File): Promise<string> => {
    if (!window.pdfjsLib) {
      throw new Error("PDF processing library is not loaded yet.");
    }
    const arrayBuffer = await fileToProcess.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const pagePromises = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      pagePromises.push(pdf.getPage(i));
    }
    const pdfPages = await Promise.all(pagePromises);
    
    const textContentPromises = pdfPages.map(page => page.getTextContent());
    const allTextContents = await Promise.all(textContentPromises);
    
    const pageTexts = allTextContents.map(textContent => {
      if (!textContent || textContent.items.length === 0) {
        return "";
      }
      return textContent.items.map((item: any) => item.str).join(' ');
    });
    
    return pageTexts.filter(text => text.trim().length > 0).join('\n\n');
  };

  const handleFileClear = () => {
      setFile(null);
      setFileContent(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
  };

  const handleReset = (clearTopicAndFile = true) => {
    if(clearTopicAndFile) {
      setTopic('');
      handleFileClear();
    }
    setError(null);
    setStudyGuide(null);
    setChatSession(null);
    setChatHistory([]);
    setQuiz(null);
    setQuizError(null);
    setIsBookViewOpen(false);
    setFullBookContent(null);
    setCachedFullBook(null);
    setIsBookLoading(false);
  }
  
  const runGuideGeneration = async (generationTopic: string, generationFileContent: string | null) => {
    if (!generationTopic.trim() && !generationFileContent) {
        setError(t.errorTopic);
        return;
    }

    setIsLoading(true);
    handleReset(false); 

    try {
        const guide = await generateStudyGuide(generationTopic, language, generationFileContent);
        setStudyGuide(guide);
        
        if (!generationTopic.trim() && guide.topic) {
            setTopic(guide.topic);
        }
        
        const chat = startChat(guide.topic, language, generationFileContent);
        setChatSession(chat);
        setChatHistory([{ role: 'model', text: t.chatWelcome(guide.topic) }]);
    } catch (e: any) {
        setError(e.message || t.errorUnknown);
        if(generationFileContent) {
            handleFileClear();
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleGenerateStudyGuide = useCallback(() => {
    runGuideGeneration(topic, fileContent);
  }, [topic, fileContent, language, t]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;

      handleReset(true); 
      setFile(selectedFile);
      setIsFileProcessing(true);

      try {
          let text = '';
          if (selectedFile.type === 'application/pdf') {
              text = await extractTextFromPdf(selectedFile);
          } else if (selectedFile.type.startsWith('text/')) {
              text = await selectedFile.text();
          } else {
              throw new Error(t.errorFile);
          }
          setFileContent(text);
          
          await runGuideGeneration("", text);

      } catch (e: any) {
          setError(e.message || t.errorFile);
          handleFileClear();
      } finally {
          setIsFileProcessing(false);
      }
  };

  const handleGenerateQuiz = useCallback(async () => {
    if (!studyGuide) return;
    setIsQuizLoading(true);
    setQuizError(null);
    setQuiz(null);

    try {
      const newQuiz = await generateQuiz(studyGuide.topic, language, difficulty, fileContent);
      setQuiz(newQuiz);
    } catch (e: any) {
      setQuizError(e.message || t.errorQuiz);
    } finally {
      setIsQuizLoading(false);
    }
  }, [studyGuide, language, difficulty, t, fileContent]);
  
  const handleGenerateFullBook = useCallback(async () => {
    if (!studyGuide) return;

    if (cachedFullBook) {
        setFullBookContent(cachedFullBook);
        setIsBookViewOpen(true);
        return;
    }

    setIsBookLoading(true);
    setError(null);
    try {
        const book = await generateFullBook(studyGuide, language, fileContent);
        
        setFullBookContent(book);
        setCachedFullBook(book);
        setIsBookViewOpen(true);

    } catch (e: any) {
        setError(e.message || t.errorBook);
    } finally {
        setIsBookLoading(false);
    }
  }, [studyGuide, language, fileContent, cachedFullBook, t]);

  const handleQuizReset = () => {
    setQuiz(null);
    setQuizError(null);
  };

  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSession) return;

    setIsChatResponding(true);
    setChatHistory(prev => [...prev, { role: 'user', text: message }, { role: 'model', text: '' }]);

    try {
        const stream = await chatSession.sendMessageStream({ message });
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', text: fullResponse };
                return newHistory;
            });
        }
    } catch (e: any) {
        console.error("Chat error:", e);
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'model', text: t.chatError };
            return newHistory;
        });
    } finally {
        setIsChatResponding(false);
    }
  }, [chatSession, t.chatError]);

  const canGenerate = (topic.trim() || file) && !isLoading && !isFileProcessing;

  return (
    <>
      <div className="min-h-screen p-4 md:p-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-grow">
          <header className="flex justify-between items-center mb-10 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-bold">
              LEARNED
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="text-sm bg-base-200 dark:bg-dark-base-200 text-content-100 dark:text-dark-content-100 rounded-full pl-4 pr-10 py-2.5 border-2 border-transparent hover:bg-base-300 dark:hover:bg-dark-base-300 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none cursor-pointer transition-colors"
                  aria-label={t.selectLanguage}
                >
                  <option value="en">English</option>
                  <option value="th">ไทย</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-content-200 dark:text-dark-content-200">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-content-200 dark:text-dark-content-200 hover:bg-base-300 dark:hover:bg-dark-base-300 transition-colors"
                aria-label={t.toggleTheme}
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>
          </header>

          <main>
            <div className="bg-base-200 dark:bg-dark-base-200 p-4 rounded-2xl shadow-apple dark:shadow-apple-dark mb-12">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <label htmlFor="topic-input" className="sr-only">{t.topicPlaceholder}</label>
                <input
                  id="topic-input"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t.topicPlaceholder}
                  className="flex-grow bg-base-100 dark:bg-dark-base-300 text-lg text-content-100 dark:text-dark-content-100 placeholder-content-200/70 dark:placeholder-dark-content-200/70 rounded-full px-6 py-4 border-2 border-transparent focus:border-brand-primary focus:outline-none transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && canGenerate && handleGenerateStudyGuide()}
                />
                 <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.txt"
                      disabled={isLoading || isFileProcessing}
                  />
                  <label
                      htmlFor="file-upload"
                      title={t.uploadFile}
                      className={`p-3 rounded-full flex-shrink-0 transition-colors ${
                          (isLoading || isFileProcessing)
                              ? 'cursor-not-allowed text-content-200/50 dark:text-dark-content-200/50'
                              : 'cursor-pointer text-content-200 dark:text-dark-content-200 hover:bg-base-100 dark:hover:bg-dark-base-300'
                      }`}
                  >
                      <PaperClipIcon />
                  </label>
                <button
                  onClick={handleGenerateStudyGuide}
                  disabled={!canGenerate}
                  className="w-full sm:w-auto bg-brand-primary text-white font-semibold py-4 px-8 rounded-full hover:opacity-90 transition-opacity duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading ? t.generating : (isFileProcessing ? t.parsingFile : t.startLearning)}
                </button>
              </div>
              {file && (
                <div className="mt-3 text-center text-sm text-content-200 dark:text-dark-content-200 flex items-center justify-center gap-2 animate-fade-in">
                    <DocumentTextIcon />
                    <span className="font-medium">{file.name}</span>
                    <button onClick={handleFileClear} title={t.clearFile} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold text-lg leading-none align-middle px-1 rounded-full">&times;</button>
                </div>
              )}
               {error && !isLoading && <p className="text-red-500 mt-3 text-center">{error}</p>}
            </div>

            <div id="results-section" className="space-y-12">
              {!studyGuide && !isLoading && !isFileProcessing && <Welcome locale={t} />}
              {(isLoading || isFileProcessing) && !studyGuide && <Spinner message={isFileProcessing ? t.parsingFile : (isLoading ? t.spinnerMessage : '...')} />}
              
              {studyGuide && !isLoading && (
                  <div className="space-y-12">
                      <StudyGuideDisplay guide={studyGuide} coreConceptsLabel={t.coreConcepts} keyTermsLabel={t.keyTerms} />

                      <InteractiveToolkit
                          difficulty={difficulty}
                          onDifficultyChange={setDifficulty}
                          onGenerateQuiz={handleGenerateQuiz}
                          isQuizLoading={isQuizLoading}
                          onGenerateBook={handleGenerateFullBook}
                          isBookLoading={isBookLoading}
                          locale={t}
                      />
                      
                      {quiz && <QuizDisplay quiz={quiz} onTryAgain={handleQuizReset} locale={t} />}
                      {quizError && <p className="text-red-500 text-center">{quizError}</p>}

                      {chatSession && (
                          <ChatInterface
                              history={chatHistory}
                              isResponding={isChatResponding}
                              onSendMessage={handleSendMessage}
                              headerText={t.chatHeader}
                              placeholderText={t.chatPlaceholder}
                          />
                      )}
                  </div>
              )}

              {(isLoading && studyGuide) && <Spinner message={t.spinnerMessage} />}
              
              {isBookViewOpen && fullBookContent && (
                <BookView book={fullBookContent} onClose={() => setIsBookViewOpen(false)} locale={{
                    close: t.closeBook,
                    author: t.bookAuthor,
                    tocTitle: t.tocTitle,
                    introductionTitle: t.introductionTitle,
                    glossaryTitle: t.glossaryTitle,
                    theEnd: t.theEnd,
                    finalMessage: t.finalMessage,
                    allRightsReserved: t.allRightsReserved,
                    exportToPdf: t.exportToPdf,
                    exportingPdf: t.exportingPdf
                }}/>
              )}
            </div>
          </main>
          </div>
          <footer className="mt-20 pt-10 border-t border-base-300 dark:border-dark-base-300 text-sm text-content-200 dark:text-dark-content-200">
             <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                         <span className="text-xl" role="img" aria-label="Book emoji">📚</span>
                         <span className="font-bold text-lg text-content-100 dark:text-dark-content-100">LEARNED</span>
                     </div>
                     <p>&copy; 2025 Wiqnnc_. All Rights Reserved.</p>
                 </div>
                 <div className="text-center md:text-right">
                    <p>Made with love by Win</p>
                    <p className="mt-1">Special thanks to Gemini.</p>
                 </div>
             </div>
          </footer>
        
      </div>
      {(isBookLoading && !isBookViewOpen) && (
        <div className="fixed inset-x-0 bottom-8 flex justify-center z-50">
           <div className="bg-dark-base-200/80 text-white font-semibold py-3 px-6 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-3 animate-fade-in">
             <ToastSpinner />
             <span>{t.generatingBook}</span>
           </div>
        </div>
      )}
      {showBackToTop && (
        <button
            onClick={scrollToTop}
            aria-label="Go to top"
            className="fixed bottom-8 right-8 z-50 p-3 bg-brand-primary text-white rounded-full shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-110 animate-fade-in"
        >
            <ArrowUpIcon />
        </button>
      )}
    </>
  );
};

export default App;