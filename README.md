# LEARNED: AI-Powered Study Guide Generator

**LEARNED** is a minimalist, single-page web application to generate study guides, create full digital books, and have interactive chat sessions on any topic in English or Thai. It leverages the Gemini API to create dynamic, personalized learning experiences.

## 🌐 Live Demo

<!-- Add the link to your deployed GitHub Pages site here! -->
**[Link to your live demo]**

---

## ✨ Features

-   **Dynamic Study Guides**: Generate comprehensive study guides on any topic by simply typing it in.
-   **File-Based Learning**: Upload a PDF or TXT file to have a study guide generated based on its content.
-   **Full Book Generation**: Expand any study guide into a multi-chapter digital book with a glossary.
-   **Interactive Quizzes**: Test your knowledge with quizzes generated on the fly, with adjustable difficulty (Easy, Medium, Hard).
-   **AI Tutor Chat**: Ask follow-up questions and dive deeper into the topic with an integrated, conversational AI tutor.
-   **PDF Export**: Download your generated digital book as a beautifully formatted, text-searchable PDF document.
-   **Fully Responsive**: A seamless experience on desktop, tablet, and mobile devices.
-   **Bilingual Support**: Full UI and content generation in both English and Thai.
-   **Dark & Light Modes**: Eye-pleasing themes that respect your system preference.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/) (with hooks) & [TypeScript](https://www.typescriptlang.org/)
-   **AI**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash-preview-04-17`)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
-   **No Build Step**: Uses modern browser features (`importmap`) for a zero-configuration setup.

---

## 🚀 Deployment Guide

This project is designed to run directly in a browser with no build step. Here is a comprehensive checklist for deploying a web project like this to GitHub.

### ✅ 1. Project Setup & Local Development
-   **Structure**: The project uses a simple structure with `index.html`, `App.tsx` (the main component), and components/services in subdirectories. This project does not require a `dist` or `build` folder.
-   **API Credentials**: The application requires a Google Gemini API key. It is configured to be read from `process.env.API_KEY`. For local development, ensure this environment variable is available to your development server. **Never commit your API key directly into the code.**
-   **No Dependencies to Install**: Since this project uses `importmap` and loads libraries from a CDN (esm.sh), there is no `npm install` step needed.

### 🚨 **CRITICAL SECURITY NOTE** 🚨

The current version of this application makes calls to the Google Gemini API directly from the user's browser. To deploy this publicly (e.g., on GitHub Pages), you would need to place your API key in the frontend code.

**DO NOT DO THIS IN A PUBLIC REPOSITORY.** Exposing your API key in client-side code will allow anyone to find and use it, which could result in unexpected charges on your account.

**The correct and secure method for a production application is to use a backend proxy:**
1.  The frontend (this app) calls your own simple backend server/function (e.g., a serverless function).
2.  Your backend server securely stores the API key as an environment variable and forwards the request to the Google Gemini API.
3.  The response is passed back to the frontend.

This ensures your API key is never exposed to the public. Services like Vercel, Netlify, or Google Cloud Functions are excellent for hosting such a proxy.

---

### ✅ 2. API Integration
-   **Error Handling**: The `geminiService.ts` includes `try...catch` blocks to gracefully handle API errors and display messages to the user.
-   **CORS**: Since API calls are made from the client-side, CORS is handled by the Google Gemini API servers. No special client-side configuration is needed.

### ✅ 3. Testing
-   **Manual Testing**: Before deploying, test all core features:
    -   Generate a study guide from a topic.
    -   Generate a study guide from a file (PDF, TXT).
    -   Generate a quiz (all difficulties).
    -   Generate a full book.
    -   Use the chat feature.
    -   Export a book to PDF.
-   **Responsiveness**: Test on different screen sizes (desktop, tablet, mobile).
-   **Browser Compatibility**: Test on major modern browsers (Chrome, Firefox, Safari, Edge).

### ✅ 4. Pushing to GitHub
1.  Initialize a Git repository: `git init`
2.  Add all files: `git add .`
3.  Commit your changes: `git commit -m "Initial commit"`
4.  Create a new repository on GitHub.
5.  Add the remote and push:
    ```bash
    git remote add origin <YOUR_REPO_URL>
    git push -u origin main
    ```

### ✅ 5. Deployment with GitHub Pages (For Demonstration Only)

**WARNING:** The following steps will expose your API key if your repository is public. This method is **only suitable for private repositories or for temporary, educational demonstrations.** See the security note above for the correct production approach.

1.  **Configure API Key**: In `services/geminiService.ts`, you must manually replace `process.env.API_KEY` with your actual string API key. Again, **this is insecure for public deployment.**
2.  **Repository Settings**: In your GitHub repo, go to **Settings > Pages**.
3.  **Source**: Select "Deploy from a branch".
4.  **Branch**: Choose the `main` branch and the `/(root)` folder. Click **Save**.
5.  **404.html for SPAs**: This project includes a `404.html` file, which is a copy of `index.html`. This is a workaround for single-page applications on GitHub Pages to handle client-side routing and page reloads correctly.

### ✅ 6. Documentation
-   **README**: Keep this `README.md` updated with any changes to the project.
-   **LICENSE**: A `LICENSE` file is included. Ensure it fits your needs.

### ✅ 7. Security
-   **NEVER COMMIT SECRETS**: Double-check that you have not committed your `.env` file or hard-coded any API keys or other secrets. Use a tool like `git-secrets` to scan your repository if you are unsure.
-   **Dependencies**: Periodically check for updated versions of the libraries loaded via `importmap` (React, jspdf, etc.) for security patches and new features.

---

## ⚖️ License

This project is for educational and demonstration purposes. Feel free to fork, modify, and learn from it.