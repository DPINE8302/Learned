import React from 'react';

// Icons for features
const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const CheckBadgeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center p-6 text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-content-100 dark:text-dark-content-100 mb-2">{title}</h3>
        <p className="text-content-200 dark:text-dark-content-200">{description}</p>
    </div>
);


interface WelcomeProps {
    locale: {
        welcomeTitle: string;
        welcomeSubtitle: string;
        feature1Title: string;
        feature1Desc: string;
        feature2Title: string;
        feature2Desc: string;
        feature3Title: string;
        feature3Desc: string;
    }
}

const Welcome: React.FC<WelcomeProps> = ({ locale }) => {
    return (
        <div className="text-center py-8 animate-fade-in">
            <h2 className="text-4xl font-bold text-content-100 dark:text-dark-content-100 mb-2">{locale.welcomeTitle}</h2>
            <p className="text-lg text-content-200 dark:text-dark-content-200 max-w-2xl mx-auto mb-12">{locale.welcomeSubtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <FeatureCard 
                    icon={<BookOpenIcon />} 
                    title={locale.feature1Title}
                    description={locale.feature1Desc}
                />
                <FeatureCard 
                    icon={<CheckBadgeIcon />} 
                    title={locale.feature2Title}
                    description={locale.feature2Desc}
                />
                <FeatureCard 
                    icon={<ChatBubbleIcon />} 
                    title={locale.feature3Title}
                    description={locale.feature3Desc}
                />
            </div>
        </div>
    );
};

export default Welcome;
