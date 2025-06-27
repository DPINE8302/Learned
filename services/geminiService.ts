
import { GoogleGenAI, Chat } from "@google/genai";
import { StudyGuide, Language, Quiz, Difficulty, FullBook, CoreConcept, KeyTerm, GlossaryTerm } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonFromMarkdown = <T,>(text: string): T => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonStr);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};

export const generateStudyGuide = async (topic: string, language: Language, fileContent?: string | null): Promise<StudyGuide> => {
  const languageInstruction = language === 'th' ? 'Thai' : 'English';
  
  let contextInstruction: string;
  if (fileContent) {
    if (topic) {
      contextInstruction = `Based *primarily* on the following document content, generate a study guide for the specific topic: "${topic}". If the topic isn't well-covered in the document, explain that and create the guide based on general knowledge about the topic, but note that the document didn't contain the information. Document Content:\n\n${fileContent}`;
    } else {
      contextInstruction = `The user has uploaded a document. Your task is to first identify the main topic of this document. Then, generate a comprehensive study guide on that identified topic, using only the information provided in the document. The "topic" field in your JSON response should be the main topic you identified. Document Content:\n\n${fileContent}`;
    }
  } else {
    contextInstruction = `Generate a comprehensive study guide for the topic "${topic}".`;
  }

  const prompt = `
    Act as an expert educator and a patient, knowledgeable teacher. Your goal is to make complex topics easy to understand.
    ${contextInstruction}

    Please provide the output strictly in JSON format with the following structure. All text values in the JSON response must be in ${languageInstruction}.
    {
      "topic": "${topic || 'auto-identified topic'}",
      "summary": "A concise, one-paragraph overview of the topic. Explain it as you would to someone for the first time.",
      "core_concepts": [
        {
          "concept": "Name of the first key concept",
          "explanation": "A detailed but easy-to-understand explanation of this concept. Use an analogy if it helps clarify the idea."
        }
      ],
      "key_terms": [
        {
          "term": "First key term",
          "definition": "A clear definition of the first term, avoiding jargon where possible."
        }
      ]
    }

    Ensure the JSON is valid and complete.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    const parsedGuide = parseJsonFromMarkdown<StudyGuide>(response.text);
    if (!topic) { // If topic was auto-identified, keep it. Otherwise, use user's original topic.
        parsedGuide.topic = parsedGuide.topic;
    } else {
        parsedGuide.topic = topic;
    }
    return parsedGuide;
  } catch (error) {
    console.error("Error generating study guide:", error);
    throw new Error("Failed to generate study guide. Please check your connection or API key.");
  }
};

export const generateFullBook = async (studyGuide: StudyGuide, language: Language, fileContent?: string | null): Promise<FullBook> => {
    const languageInstruction = language === 'th' ? 'Thai' : 'English';
    const contextInstruction = fileContent
      ? `The content should be primarily based on the user's uploaded document about "${studyGuide.topic}". Reference it to provide specific examples or details where appropriate.`
      : `The content should be based on general knowledge about the topic of "${studyGuide.topic}".`;
  
    const prompt = `
      Act as an expert author and educator. Your task is to write a complete digital book based on the provided study guide.
  
      Study Guide Topic: "${studyGuide.topic}"
      Study Guide Summary (this will be the book's introduction): "${studyGuide.summary}"
  
      The book must be structured as follows:
      1.  **Chapters**: Create a chapter for each of the core concepts listed below. Each chapter should be a detailed, engaging exploration of its concept, expanding significantly on the initial explanation provided in the study guide. Write in a clear, narrative style. Use examples, analogies, and structure the content logically with paragraphs separated by \\n\\n.
          - Core Concepts to expand into chapters: ${JSON.stringify(studyGuide.core_concepts.map(c => ({ concept: c.concept, explanation: c.explanation })), null, 2)}
      2.  **Glossary**: Create a comprehensive glossary based on the key terms listed below. Expand or clarify the provided definitions to make them suitable for a full book glossary.
          - Key Terms for the glossary: ${JSON.stringify(studyGuide.key_terms, null, 2)}
  
      ${contextInstruction}
  
      Please provide the output strictly in a single, valid JSON object. All text values in the JSON response must be in ${languageInstruction}.
      The JSON structure must be:
      {
        "title": "The book title, which should be the study guide topic",
        "summary": "The book summary, which is the same as the study guide summary.",
        "chapters": [
          {
            "title": "Title of the first chapter (must match a core concept)",
            "content": "The full, well-written text content for the first chapter, with paragraphs separated by \\n\\n."
          }
        ],
        "glossary": [
          {
            "term": "A key term",
            "definition": "The expanded and clear definition for the term."
          }
        ]
      }
  
      Ensure the generated 'title' and 'summary' in the JSON match the topic and summary from the study guide. The number of chapters must match the number of core concepts provided. The chapters must be in the same order as the core concepts.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
      
      const book = parseJsonFromMarkdown<FullBook>(response.text);
      
      // Data integrity checks, just in case the AI deviates.
      if (!book.title) book.title = studyGuide.topic;
      if (!book.summary) book.summary = studyGuide.summary;
      
      return book;
  
    } catch (error) {
      console.error("Error generating full book:", error);
      throw new Error("Failed to generate the book. The AI may be busy. Please try again.");
    }
  };


export const generateQuiz = async (topic: string, language: Language, difficulty: Difficulty, fileContent?: string | null): Promise<Quiz> => {
    const languageInstruction = language === 'th' ? 'Thai' : 'English';
    const difficultyInstruction = {
      easy: "The questions should be straightforward, focusing on the main definitions and key concepts.",
      medium: "The questions should require some synthesis of information and understanding of relationships between concepts.",
      hard: "The questions should be challenging, requiring deep understanding, application of knowledge, or interpretation of nuanced details.",
    };

    const contextInstruction = fileContent ? `Base the quiz questions on the following document content, focusing on "${topic}". Document Content:\n\n${fileContent}` : `Base the quiz questions on the topic of "${topic}".`;

    const prompt = `
      Act as an expert quiz creator. ${contextInstruction}
      Create an interactive 5-question multiple-choice quiz in ${languageInstruction}.
      The difficulty level should be ${difficulty}. ${difficultyInstruction[difficulty]}

      Provide the output strictly in JSON format. The root should be an array of question objects. Each object should have the following structure:
      {
        "question": "The text of the question.",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer_index": N,
        "explanation": "A brief explanation for why the correct answer is right. This should also be in ${languageInstruction}."
      }

      Ensure the JSON is valid, complete, and all text values are in ${languageInstruction}.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
      return parseJsonFromMarkdown<Quiz>(response.text);
    } catch (error) {
      console.error("Error generating quiz:", error);
      throw new Error("Failed to generate quiz. The AI might be busy. Please try again in a moment.");
    }
};


export const startChat = (topic: string, language: Language, fileContent?: string | null): Chat => {
  const languageInstruction = language === 'th' ? 'Thai' : 'English';
  
  const contextInstruction = fileContent 
    ? `The user has just read a study guide about "${topic}" which was generated from a document they provided. Your role is to answer their follow-up questions in ${languageInstruction}, using the context from that document.`
    : `The user has just finished reading a study guide about "${topic}". Your role is to answer their follow-up questions in ${languageInstruction}.`;

  return ai.chats.create({
    model: 'gemini-2.5-flash-preview-04-17',
    config: {
      systemInstruction: `You are a friendly and helpful tutor. ${contextInstruction} Your goal is to give simple, direct, and short answers. Use easy-to-understand language and be very encouraging. Explain things like you're helping a friend who needs a quick, clear explanation.`,
    },
  });
};