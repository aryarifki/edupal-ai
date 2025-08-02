'use client'

import { useState } from 'react'
import OCRProcessor from '@/components/ocr/ocr-processor'
import AISolver from '@/components/ai/ai-solver'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, Camera, Zap, RefreshCw } from 'lucide-react'

export default function DemoPage() {
  const [extractedText, setExtractedText] = useState('')
  const [solution, setSolution] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTextExtracted = (text: string) => {
    setExtractedText(text)
    setSolution(null) // Clear previous solution
  }

  const handleSolutionGenerated = (aiSolution: any) => {
    setSolution(aiSolution)
  }

  const resetDemo = () => {
    setExtractedText('')
    setSolution(null)
    setIsProcessing(false)
  }

  const sampleProblems = [
    "Solve the quadratic equation: 2x² + 5x - 3 = 0",
    "A ball is thrown upward with an initial velocity of 20 m/s. Calculate the maximum height reached.",
    "Find the derivative of f(x) = 3x³ - 2x² + 5x - 1",
    "Calculate the area of a circle with radius 7 cm"
  ]

  const handleSampleProblem = (problem: string) => {
    setExtractedText(problem)
    setSolution(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Live Demo
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            EduPal AI Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience real AI-powered problem solving and OCR text extraction. Upload an image or try sample problems.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={resetDemo} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Demo
            </Button>
          </div>
        </div>

        {/* Demo Steps */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className={`border-2 ${!extractedText ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-200'} transition-all`}>
            <CardHeader className="text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-lg">Step 1: Extract Text</CardTitle>
              <CardDescription>Upload an image or use sample problems</CardDescription>
            </CardHeader>
          </Card>

          <Card className={`border-2 ${extractedText && !solution ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' : 'border-gray-200'} transition-all`}>
            <CardHeader className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <CardTitle className="text-lg">Step 2: AI Analysis</CardTitle>
              <CardDescription>Get AI-powered step-by-step solutions</CardDescription>
            </CardHeader>
          </Card>

          <Card className={`border-2 ${solution ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-gray-200'} transition-all`}>
            <CardHeader className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-green-600 font-bold text-xl">✓</div>
              <CardTitle className="text-lg">Step 3: Learn</CardTitle>
              <CardDescription>Review solutions and understand concepts</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - OCR and Text Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  OCR Text Extraction
                </CardTitle>
                <CardDescription>
                  Upload an image to extract text automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OCRProcessor onTextExtracted={handleTextExtracted} />
              </CardContent>
            </Card>

            {/* Sample Problems */}
            <Card>
              <CardHeader>
                <CardTitle>Or Try Sample Problems</CardTitle>
                <CardDescription>
                  Click any problem below to test AI solving
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleProblems.map((problem, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-3"
                      onClick={() => handleSampleProblem(problem)}
                    >
                      <span className="text-sm">{problem}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Solver */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Problem Solver
                </CardTitle>
                <CardDescription>
                  Get step-by-step solutions with detailed explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AISolver 
                  problemText={extractedText} 
                  onSolutionGenerated={handleSolutionGenerated} 
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mt-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Real AI Integration Showcase</CardTitle>
              <CardDescription>
                This demo uses actual API integrations with Kimi K2 and OpenAI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="font-semibold mb-2">Real OCR</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tesseract.js powered text extraction from images
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🧠</div>
                  <h3 className="font-semibold mb-2">AI APIs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Kimi K2 and OpenAI GPT-4 for problem solving
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold mb-2">Real-time</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Instant processing and feedback
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}