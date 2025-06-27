import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  history: ChatMessage[];
  isResponding: boolean;
  onSendMessage: (message: string) => void;
  headerText: string;
  placeholderText: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, isResponding, onSendMessage, headerText, placeholderText }) => {
  const [message, setMessage] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isResponding) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="mt-12 animate-fade-in">
      <div className="bg-base-200 dark:bg-dark-base-200 rounded-2xl shadow-apple dark:shadow-apple-dark p-4 md:p-6">
        <h3 className="text-xl font-semibold text-content-100 dark:text-dark-content-100 mb-4 text-center">{headerText}</h3>
        <div className="h-96 overflow-y-auto pr-4 space-y-4 mb-4">
          {history.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                  chat.role === 'user'
                    ? 'bg-brand-primary text-white'
                    : 'bg-base-300 dark:bg-dark-base-300 text-content-100 dark:text-dark-content-100'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {chat.text}
                  {chat.role === 'model' && isResponding && index === history.length - 1 && (
                    <span className="inline-block w-0.5 h-4 bg-current translate-y-0.5 ml-1 animate-blinking-cursor"></span>
                  )}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholderText}
            className="flex-grow bg-base-100 dark:bg-dark-base-300 text-content-100 dark:text-dark-content-100 rounded-full px-5 py-3 border border-transparent focus:border-brand-primary focus:outline-none transition-colors"
            disabled={isResponding}
          />
          <button
            type="submit"
            disabled={isResponding || !message.trim()}
            className="bg-brand-primary text-white rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ease-in-out hover:scale-110 disabled:bg-gray-500 disabled:scale-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L11.25 9.25v1.5l-7.44 1.259a.75.75 0 00-.95.826l1.414 4.949a.75.75 0 00.95.826l14.25-2.451a.75.75 0 000-1.424L3.105 2.29z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;