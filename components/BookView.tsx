import React, { useState, useEffect } from 'react';
import type { FullBook, GlossaryTerm, BookChapter } from '../types';
import jsPDF from 'jspdf';

interface BookViewProps {
  book: FullBook;
  onClose: () => void;
  locale: {
    close: string;
    author: string;
    tocTitle: string;
    introductionTitle: string;
    glossaryTitle: string;
    theEnd: string;
    finalMessage: string;
    allRightsReserved: string;
    exportToPdf: string;
    exportingPdf: string;
  };
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const MiniSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const PaperPage: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-base-200 dark:bg-dark-base-200 rounded-lg shadow-xl max-w-4xl mx-auto mb-8 p-10 md:p-16 lg:p-20 font-serif ${className}`}>
        {children}
    </div>
);

const BookView: React.FC<BookViewProps> = ({ book, onClose, locale }) => {
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 50;
        const contentWidth = pdfWidth - margin * 2;
        let cursorY = margin;
        let pageCounter = 0;

        const addPageNumber = (pageNum: number) => {
            if (pageNum > 1) { // No number on cover page
                pdf.setFontSize(9).setFont('helvetica', 'normal');
                pdf.text(String(pageNum), pdfWidth / 2, pdfHeight - 20, { align: 'center' });
            }
        };
        
        const checkAndAddPage = (requiredHeight: number) => {
             if (cursorY + requiredHeight > pdfHeight - margin) {
                addPageNumber(pageCounter);
                pdf.addPage();
                pageCounter++;
                cursorY = margin;
             }
        }
        
        const renderText = (text: string, options: {font: string, style: string, size: number, x?: number, align?: 'left' | 'center' | 'right' | 'justify', lineHeightFactor?: number, spaceAfter?: number}) => {
            const { font, style, size, align = 'left', lineHeightFactor = 1.15, spaceAfter = 0 } = options;
            pdf.setFont(font, style).setFontSize(size);
            
            const lines = pdf.splitTextToSize(text, contentWidth);
            const textHeight = lines.length * size * (lineHeightFactor - 0.15);
            
            checkAndAddPage(textHeight);

            let xPos: number;
            if (align === 'center') {
                xPos = pdfWidth / 2;
            } else if (align === 'right') {
                xPos = pdfWidth - margin;
            } else { // 'left' or 'justify'
                xPos = options.x !== undefined ? options.x : margin;
            }
            
            pdf.text(lines, xPos, cursorY, { align, lineHeightFactor });
            cursorY += textHeight + spaceAfter;
        };

        // --- PDF Generation Flow ---
        
        // 1. Cover Page
        pageCounter++;
        cursorY = pdfHeight / 3;
        renderText(book.title, { font: 'helvetica', style: 'bold', size: 32, align: 'center', spaceAfter: 12 });
        renderText(locale.author, { font: 'helvetica', style: 'normal', size: 16, align: 'center' });
        
        // 2. TOC
        pdf.addPage();
        pageCounter++;
        cursorY = margin;
        renderText(locale.tocTitle, { font: 'helvetica', style: 'bold', size: 24, align: 'center', spaceAfter: 30 });
        const tocItems = [locale.introductionTitle, ...book.chapters.map(c => c.title), locale.glossaryTitle];
        tocItems.forEach(item => renderText(item, { font: 'times', style: 'normal', size: 12, spaceAfter: 4 }));

        // 3. Introduction
        pdf.addPage();
        pageCounter++;
        cursorY = margin;
        renderText(locale.introductionTitle, { font: 'helvetica', style: 'bold', size: 20, align: 'center', spaceAfter: 20 });
        book.summary.split(/\n\s*\n/).forEach(p => renderText(p, { font: 'times', style: 'normal', size: 12, spaceAfter: 8, align: 'left' }));
        addPageNumber(pageCounter);

        // 4. Chapters
        for (const chapter of book.chapters) {
            pdf.addPage();
            pageCounter++;
            cursorY = margin;
            renderText(chapter.title, { font: 'helvetica', style: 'bold', size: 24, align: 'center', spaceAfter: 30 });
            chapter.content.split(/\n\s*\n/).forEach(p => renderText(p, { font: 'times', style: 'normal', size: 12, spaceAfter: 8, align: 'left' }));
            addPageNumber(pageCounter);
        }

        // 5. Glossary
        if (book.glossary && book.glossary.length > 0) {
            pdf.addPage();
            pageCounter++;
            cursorY = margin;
            renderText(locale.glossaryTitle, { font: 'helvetica', style: 'bold', size: 24, align: 'center', spaceAfter: 30 });
            for (const term of book.glossary) {
                renderText(term.term, { font: 'times', style: 'bold', size: 12, spaceAfter: 2 });
                renderText(term.definition, { font: 'times', style: 'normal', size: 12, x: margin + 15, spaceAfter: 12 });
            }
            addPageNumber(pageCounter);
        }
        
        // 6. Final Page
        pdf.addPage();
        pageCounter++;
        cursorY = pdfHeight / 3;
        renderText(locale.theEnd, { font: 'helvetica', style: 'bold', size: 28, align: 'center', spaceAfter: 30 });
        renderText(locale.finalMessage, { font: 'times', style: 'italic', size: 12, align: 'center', spaceAfter: 20 });
        renderText(locale.allRightsReserved, { font: 'times', style: 'normal', size: 10, align: 'center' });
        addPageNumber(pageCounter);
        
        pdf.save(`${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    } catch (err) {
        console.error("Failed to export PDF", err);
    } finally {
        setIsExporting(false);
    }
  };

  const renderParagraphs = (text: string) => (
      text.split(/\n\s*\n/).map((p, i) => (
          <p key={i} className="mb-4 text-justify text-content-100 dark:text-dark-content-100 leading-relaxed indent-8 first:indent-0">
              {p}
          </p>
      ))
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-base-300/80 dark:bg-dark-base-300/80 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
        {/* Top Toolbar */}
        <header className="flex-shrink-0 w-full bg-base-100/80 dark:bg-dark-base-200/80 backdrop-blur-sm border-b border-base-300 dark:border-dark-base-300 shadow-sm">
            <div className="max-w-5xl mx-auto p-3 flex justify-between items-center text-content-100 dark:text-dark-content-100">
                <button 
                    onClick={onClose} 
                    aria-label={locale.close}
                    className="p-2 rounded-full hover:bg-base-300 dark:hover:bg-dark-base-300 transition-colors"
                >
                    <CloseIcon />
                </button>
                <h2 className="font-semibold text-base md:text-lg truncate px-4">{book.title}</h2>
                <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-primary text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait"
                >
                    {isExporting ? <MiniSpinner /> : <DownloadIcon />}
                    <span className="hidden md:inline">{isExporting ? locale.exportingPdf : locale.exportToPdf}</span>
                </button>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-4 pt-8 pb-16">
            
            {/* Cover */}
            <PaperPage className="flex flex-col items-center justify-center text-center min-h-[70vh]">
                <h1 className="text-3xl md:text-5xl font-bold text-content-100 dark:text-dark-content-100 mb-4">{book.title}</h1>
                <p className="text-lg text-content-200 dark:text-dark-content-200">{locale.author}</p>
            </PaperPage>

            {/* Table of Contents */}
            <PaperPage>
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{locale.tocTitle}</h2>
                <div className="space-y-3 text-lg max-w-md mx-auto">
                    <p>{locale.introductionTitle}</p>
                    {book.chapters.map((chap) => <p key={chap.title}>{chap.title}</p>)}
                    <p>{locale.glossaryTitle}</p>
                </div>
            </PaperPage>

            {/* Introduction */}
            <PaperPage>
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{locale.introductionTitle}</h2>
                {renderParagraphs(book.summary)}
            </PaperPage>

            {/* Chapters */}
            {book.chapters.map((chapter: BookChapter) => (
                <PaperPage key={chapter.title}>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{chapter.title}</h2>
                    {renderParagraphs(chapter.content)}
                </PaperPage>
            ))}

            {/* Glossary */}
            {book.glossary && book.glossary.length > 0 && (
                <PaperPage>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{locale.glossaryTitle}</h2>
                    <div className="space-y-5">
                        {book.glossary.map((term: GlossaryTerm) => (
                            <div key={term.term}>
                                <h3 className="font-bold text-lg mb-1">{term.term}</h3>
                                <p className="text-content-200 dark:text-dark-content-200">{term.definition}</p>
                            </div>
                        ))}
                    </div>
                </PaperPage>
            )}

            {/* Final Page */}
            <PaperPage className="flex flex-col items-center justify-center text-center min-h-[50vh]">
                 <h2 className="text-3xl md:text-4xl font-bold text-content-100 dark:text-dark-content-100 mb-6">{locale.theEnd}</h2>
                 <p className="text-base text-content-200 dark:text-dark-content-200 italic max-w-xl mb-8">{locale.finalMessage}</p>
                 <p className="text-sm text-content-200/70 dark:text-dark-content-200/70">{locale.allRightsReserved}</p>
            </PaperPage>

        </main>
    </div>
  );
};

export default BookView;