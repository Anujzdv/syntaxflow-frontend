# 💻 Syntax Flow - Frontend

**Real-time Code Execution & Collaboration Platform - UI**

A modern, responsive React-based frontend for the Syntax Flow platform, featuring real-time code editing, instant execution feedback, and seamless collaboration capabilities.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Browser Support](#browser-support)

---

## ✨ Features

- ✅ **Live Code Editor** - Real-time code editing with syntax highlighting
- ✅ **Instant Output Display** - See code results immediately
- ✅ **Multi-Language Support** - JavaScript, Python, C++, Java
- ✅ **User Authentication** - Secure Firebase login/signup
- ✅ **Project Management** - Create, save, and organize projects
- ✅ **Real-time Collaboration** - Collaborate with other developers
- ✅ **Code Sharing** - Share projects via links
- ✅ **Execution History** - Track all code executions
- ✅ **Responsive Design** - Works on desktop, tablet, mobile
- ✅ **Dark Mode** - Eye-friendly dark theme support

---

## 🛠 Tech Stack

### **Frontend Framework**
- **React** - UI library
- **JavaScript/ES6+** - Programming language
- **Vite** - Build tool and dev server

### **Styling**
- **Tailwind CSS** - Utility-first CSS framework
- **CSS3** - Additional styling

### **Code Editor**
- **Monaco Editor** / **CodeMirror** - Advanced code editor
- **Syntax Highlighting** - Language-specific highlighting

### **State Management**
- **Context API** - State management
- **Custom Hooks** - Reusable logic

### **Authentication & API**
- **Firebase Client SDK** - Authentication
- **REST API** - Backend communication
- **Axios** - HTTP client

### **Real-time Communication**
- **Socket.io** - Real-time updates
- **WebSocket** - Two-way communication

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v16.x or higher)
- **npm** (v7.x or higher)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Anujzdv/syntaxflow-frontend.git
cd syntaxflow-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

---

## ⚙️ Configuration

### Step 1: Create Environment File

```bash
cp .env.example .env.local
```

### Step 2: Configure Environment Variables

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:5000
VITE_API_URL_PROD=https://api.syntaxflow.com

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

VITE_APP_NAME=Syntax Flow
VITE_ENABLE_DARK_MODE=true
```

### Step 3: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **General**
4. Scroll to "Your apps" and copy Web app configuration
5. Paste values in `.env.local`

---

## 🔧 Development

### Start Development Server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run test      # Run tests
npm run lint      # Run linter
npm run format    # Format code
```

---

## 🏗️ Build & Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

---

### Deploy to Vercel

**Option 1: Vercel Dashboard**

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Select "React" framework
6. Add environment variables
7. Click "Deploy"

**Option 2: Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

---

## 📖 Usage Guide

### 1. Getting Started

- Sign up with email and password
- Or login with existing account

### 2. Creating a New Project

1. Click "New Project" button
2. Enter project title
3. Select programming language
4. Start coding!

### 3. Writing & Executing Code

1. Type code in the editor
2. Select language (top right)
3. Click "Run" button
4. View output in the output panel

### 4. Saving Project

- Click "Save" to save changes
- Changes auto-save every 30 seconds

### 5. Sharing Projects

1. Click "Share" button
2. Select sharing permissions
3. Copy share link
4. Send to collaborators

---

## 🔐 Authentication Flow

1. User enters credentials
2. Firebase authenticates
3. Token stored in local storage
4. Token sent with each API request
5. Backend verifies token
6. On logout, token cleared

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## ⚡ Performance Optimization

- Code splitting with dynamic imports
- Lazy loading routes
- Image optimization
- Minification and compression
- Caching strategies

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
lsof -i :5173
kill -9 <PID>
```

### CORS Errors

- Verify backend URL in `.env.local`
- Check backend CORS configuration
- Verify Firebase project settings

### Firebase Not Initializing

- Verify all Firebase config values
- Check Firebase project enabled
- Ensure Firestore database created

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Web Docs](https://firebase.google.com/docs/web)

---

## 📄 License

MIT License

---

## 👥 Contact

- 📧 **Email**: anujzdv@gmail.com
- 💼 **LinkedIn**: [Anuj Kumar](https://linkedin.com/in/anujzdv)
- 🐙 **GitHub**: [@Anujzdv](https://github.com/Anujzdv)

---

<div align="center">

**Made with ❤️ by Anuj Kumar**

</div>
