# 🎓 EduPal AI - Intelligent Educational Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red.svg)](https://nestjs.com/)

> **EduPal AI** is a cutting-edge educational platform that revolutionizes learning through AI-powered homework assistance, automated grading, and personalized learning paths. Built with modern technologies and designed for the future of education.

![EduPal AI Dashboard](https://via.placeholder.com/800x400/2563eb/ffffff?text=EduPal+AI+Dashboard)

## 🚀 Features

### 🤖 AI-Powered Solutions
- **GPT-4 & Kimi K2 Integration**: Advanced AI models for problem solving
- **Multi-Subject Support**: Mathematics, Physics, Chemistry, and more
- **Step-by-Step Solutions**: Detailed explanations with LaTeX rendering
- **Concept Detection**: Automatic identification of mathematical concepts
- **Error Analysis**: AI-driven mistake detection and suggestions

### 📄 Smart File Processing
- **OCR Technology**: Extract text from PDFs, images, and handwritten assignments
- **Drag & Drop Upload**: Intuitive file upload with real-time preview
- **Image Preprocessing**: Enhanced OCR accuracy with image optimization
- **Multiple Formats**: Support for PDF, PNG, JPG files

### 🎯 Adaptive Learning
- **Personalized Quizzes**: AI-generated questions based on weak areas
- **Progress Tracking**: Real-time mastery level monitoring
- **Recommendation Engine**: Tailored study material suggestions
- **Learning Analytics**: Comprehensive performance insights

### 👩‍🏫 Teacher Dashboard
- **Automated Grading**: AI-powered rubric-based assessment
- **Classroom Management**: Student progress and performance analytics
- **Rubric Generation**: AI-assisted rubric creation
- **Export Reports**: Detailed analytics and progress reports

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: System preference detection and toggle
- **Micro-Interactions**: Smooth animations and "AI Verified" badges
- **Confetti Effects**: Celebration animations for achievements

### 🔄 Real-Time Features
- **WebSocket Integration**: Live progress updates and notifications
- **Collaborative Tools**: Group assignment features
- **Real-Time Dashboard**: Live analytics for teachers

## 🏗️ Architecture

```
EduPal AI/
├── apps/
│   ├── frontend/          # Next.js 14 React Application
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utilities and configurations
│   └── backend/           # NestJS API Server
│       ├── src/           # Source code
│       │   ├── ai/        # AI service integration
│       │   ├── auth/      # Authentication module
│       │   ├── users/     # User management
│       │   └── prisma/    # Database service
│       └── prisma/        # Database schema and migrations
├── packages/              # Shared libraries
└── scripts/               # Setup and utility scripts
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **File Upload**: React Dropzone + Supabase Storage
- **OCR**: Tesseract.js
- **PDF Viewer**: React-PDF
- **Charts**: Recharts
- **Math Rendering**: KaTeX

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport
- **File Storage**: Supabase
- **WebSockets**: Socket.io
- **API Documentation**: Swagger/OpenAPI
- **Rate Limiting**: Built-in throttling

### AI & APIs
- **OpenAI**: GPT-4 for analysis and grading
- **Kimi K2**: Advanced problem solving
- **OCR**: Tesseract.js for text extraction
- **Image Processing**: Sharp

### Infrastructure
- **Database**: PostgreSQL
- **Cache**: Redis
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+
- **Docker** (optional, for database)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/aryarifki/edupal-ai.git
cd edupal-ai
```

### 2. Automated Setup
```bash
# Make scripts executable
chmod +x setup.sh start.sh

# Run the setup script
./setup.sh
```

The setup script will:
- ✅ Install all dependencies
- ✅ Set up environment files
- ✅ Start database services (Docker)
- ✅ Run database migrations
- ✅ Seed demo data

### 3. Configure Environment Variables

Edit `.env` file with your API keys:

```env
# AI APIs
OPENAI_API_KEY="your-openai-api-key"
KIMI_API_KEY="your-kimi-api-key"

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/edupal_ai"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Supabase (File Storage)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Start Development Servers

```bash
# Start all services
./start.sh

# Or start individually
npm run dev:backend    # Backend API (port 3001)
npm run dev:frontend   # Frontend app (port 3000)

# Or with Docker
./start.sh docker
```

### 5. Access the Application

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:3001
- 📚 **API Docs**: http://localhost:3001/api/docs
- 🗄️ **Database**: localhost:5432

## 🧪 Demo Data

The application comes with pre-seeded demo data:

### Demo Accounts
- **Teacher**: `teacher@edupal.ai`
- **Students**: `firstname.lastname@student.edupal.ai` (30 students)

### Sample Data
- 📚 1 Classroom with 30 students
- 📝 Sample assignments with problems
- 📊 Student submissions and grades
- 🧩 Interactive quizzes
- 📈 Progress tracking data
- 🔔 Sample notifications

## 📖 API Documentation

### Authentication
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### AI Services
```typescript
POST /api/ai/solve          # Solve problems with AI
POST /api/ai/quiz/generate  # Generate adaptive quizzes
POST /api/ai/grade          # Grade submissions
POST /api/ai/rubric/generate # Create rubrics
```

### File Upload & OCR
```typescript
POST /api/upload/file       # Upload assignment files
POST /api/ocr/extract       # Extract text from images
GET  /api/files/:id         # Download files
```

### Assignments & Submissions
```typescript
GET    /api/assignments     # List assignments
POST   /api/assignments     # Create assignment
GET    /api/submissions     # List submissions
POST   /api/submissions     # Submit assignment
```

Full API documentation available at `/api/docs` when running the backend.

## 🎯 Usage Examples

### 1. Solving Math Problems

```typescript
// Upload an image with a math problem
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/upload/file', {
  method: 'POST',
  body: formData
});

// Extract text with OCR
const ocrResult = await fetch('/api/ocr/extract', {
  method: 'POST',
  body: JSON.stringify({ imageUrl: response.fileUrl })
});

// Solve with AI
const solution = await fetch('/api/ai/solve', {
  method: 'POST',
  body: JSON.stringify({
    problemText: ocrResult.text,
    subject: 'Mathematics'
  })
});
```

### 2. Creating Adaptive Quizzes

```typescript
// Generate quiz based on weak areas
const quiz = await fetch('/api/ai/quiz/generate', {
  method: 'POST',
  body: JSON.stringify({
    concepts: ['Quadratic Functions', 'Graphing'],
    difficulty: 'medium',
    count: 5
  })
});
```

### 3. Automated Grading

```typescript
// Grade student submission
const grade = await fetch('/api/ai/grade', {
  method: 'POST',
  body: JSON.stringify({
    studentAnswer: 'x = 4',
    correctSolution: 'x = 4 (solved using quadratic formula)',
    rubric: rubricData
  })
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Check test coverage
npm run test:coverage
```

## 📦 Deployment

### Frontend (Vercel)
```bash
# Connect to Vercel
vercel

# Deploy
vercel --prod
```

### Backend (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway deploy
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Jest** for testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Moonshot AI** for Kimi K2 Model
- **Vercel** for Next.js framework
- **NestJS** for backend architecture
- **Prisma** for database ORM
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components

## 📞 Support & Contact

- **Email**: rifki@edupal.ai
- **GitHub Issues**: [Create Issue](https://github.com/aryarifki/edupal-ai/issues)
- **Documentation**: [Wiki](https://github.com/aryarifki/edupal-ai/wiki)

---

<div align="center">

**Built with ❤️ by [Ahmad Rifki Aryanto](https://github.com/aryarifki)**

⭐ **Star this repository if you find it helpful!**

</div>