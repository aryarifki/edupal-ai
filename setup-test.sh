#!/bin/bash

# EduPal AI Development Setup and Test Script

echo "🚀 Starting EduPal AI Development Environment"
echo "============================================"

# Check if environment file exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please update the .env file with your actual API keys and database URL"
else
    echo "✅ .env file already exists"
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install --silent

# Build the project
echo "🔨 Building backend and frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🧪 Testing AI Service Configuration..."
    echo "================================="
    
    # Test if API keys are configured
    if grep -q "your-openai-api-key" .env || grep -q "your-kimi-api-key" .env; then
        echo "⚠️  API keys are not configured. Please update .env with real API keys."
    else
        echo "✅ API keys appear to be configured"
    fi
    
    echo ""
    echo "🌟 Setup Complete!"
    echo "=================="
    echo ""
    echo "To start the development servers:"
    echo "  Backend:  npm run dev:backend"
    echo "  Frontend: npm run dev:frontend"
    echo "  Both:     npm run dev"
    echo ""
    echo "API Documentation will be available at:"
    echo "  http://localhost:3001/api/docs"
    echo ""
    echo "Frontend will be available at:"
    echo "  http://localhost:3000"
    echo ""
    echo "🔍 Key Features Implemented:"
    echo "  ✅ Real AI integration (Kimi K2 + OpenAI)"
    echo "  ✅ OCR text extraction (Tesseract.js)"
    echo "  ✅ Comprehensive error handling"
    echo "  ✅ Input validation"
    echo "  ✅ Environment validation"
    echo ""
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi