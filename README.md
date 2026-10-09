# 💻 Syntax|Flow — Frontend

**Competitive Developer Quiz, Challenge Arena & Adaptive Practice Platform**

A high-performance React application built with Vite, Tailwind CSS, and Framer Motion. Features a cybersecurity-inspired dark mode UI, interactive timed quizzes, a peer challenge arena, developer snippet feed, and an **Adaptive AI Practice Mode** that dynamically calibrates question difficulty to match user mastery.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square)

---

## 📋 Table of Contents

- [Features](#-features)
- [Adaptive Practice Mode UI](#-adaptive-practice-mode-ui)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development & Verification](#-development--verification)
- [Production Deployment](#-production-deployment)

---

## ✨ Features

- **Adaptive Practice Mode** (`/adaptive`) — Interactive practice mode with real-time difficulty indicators (Easy, Medium, Hard), instant pedagogical explanations, and algorithmic performance recommendations.
- **Timed Technical Quizzes** (`/quiz/:quizId`) — Timed question sequences with tab-switch anti-cheat detection, countdown timers, and XP calculation.
- **Challenge Arena** (`/challenges`) — Direct peer challenges with live wager status, accept/decline flows, and results.
- **Developer Social Feed** (`/feed`) — Infinite-scroll code snippet feed with syntax highlighting, like counters, and threaded comments.
- **Ascension Leaderboard** (`/leaderboard`) — Interactive podium highlighting top engineers across timeframes and languages.
- **Developer Profile** (`/profile`) — Detailed radar charts, accuracy statistics, language mastery breakdowns, and attempt history.

---

## 🧠 Adaptive Practice Mode UI

The Adaptive Practice Mode provides an interactive, low-stakes training environment:
1. **Interactive Setup**: Choose language (`JavaScript`, `Python`, `Java`, `C++`, `C`), topic (`arrays`, `functions`, `memory`, `general`), and starting difficulty.
2. **Instant Feedback**: Submissions receive server-graded feedback immediately, revealing the correct option and conceptual explanation.
3. **Dynamic Adaptation Indicator**: Visually alerts the user when difficulty increases, decreases, or maintains based on consecutive performance.
4. **Session Summary**: Displays overall accuracy %, question breakdown, and algorithmic recommendations upon finishing.

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom glowing cyber aesthetic
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios with automatic JWT interceptors and fallback resolution
- **Linting**: ESLint 9

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components (Navbar, ActiveQuiz, ProtectedRoute, etc.)
│   └── snippets/        # Feed snippet items and comment dialogs
├── context/             # Authentication context and provider
├── pages/               # Top-level view routes
│   ├── AdaptivePractice.jsx  # Adaptive AI practice interface & summary
│   ├── Challenges.jsx        # 1v1 Arena challenges
│   ├── Feed.jsx              # Code snippet feed
│   ├── Home.jsx              # Hero landing page
│   ├── Leaderboard.jsx       # Ranked podium and leaderboard
│   ├── Login.jsx             # User authentication
│   ├── Profile.jsx           # User statistics & profile
│   ├── QuizResult.jsx        # Timed quiz completion screen
│   ├── QuizSelection.jsx     # Quiz tracks & Adaptive Mode hero card
│   └── Register.jsx          # User registration
├── services/            # Axios API client with dynamic base URL
├── App.jsx              # Application router
└── main.jsx             # React entry point
```

---

## ⚙️ Configuration

Create `.env` in the frontend directory based on `.env.example`:

```bash
# Point to your local or deployed backend API
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Syntax|Flow
```

---

## 🧪 Development & Verification

```bash
# Install dependencies
npm install

# Run ESLint (0 errors)
npm run lint

# Build for production
npm run build

# Start local development server
npm run dev
```

---

## 🚀 Production Deployment

Deploy to **Netlify** or **Vercel**:
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://syntaxflow-backend.onrender.com` or custom domain)
4. Ensure SPA redirects are configured (`_redirects` file in `public/` containing `/* /index.html 200`).
