'use client'

import { useState } from 'react'

interface AISolverProps {
  problemText: string
  onSolutionGenerated: (solution: any) => void
}

export default function AISolver({ problemText, onSolutionGenerated }: AISolverProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [solution, setSolution] = useState<any>(null)
  const [error, setError] = useState('')

  const generateSolution = async () => {
    if (!problemText.trim()) return

    setIsProcessing(true)
    setError('')

    try {
      // Make real API call to backend
      const response = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemText,
          subject: 'mathematics', // Default subject, can be made dynamic
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to get AI solution')
      }

      const aiSolution = await response.json()
      setSolution(aiSolution)
      onSolutionGenerated(aiSolution)
    } catch (err) {
      console.error('AI Solver Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate solution. Please try again.'
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearSolution = () => {
    setSolution(null)
    setError('')
  }

  if (!problemText.trim()) {
    return (
      <div className="ai-solver mt-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">🤖 AI Problem Solver</h3>
        <p className="text-gray-600">Upload and extract text from your assignment to get AI-powered solutions</p>
      </div>
    )
  }

  return (
    <div className="ai-solver mt-6 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-800">🤖 AI Problem Solver</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Powered by GPT-4 & Kimi K2</span>
      </div>
      
      <div className="problem-preview bg-white p-3 rounded border mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Problem to solve:</h4>
        <p className="text-sm text-gray-600 italic">"{problemText}"</p>
      </div>

      {!solution && !isProcessing && (
        <div className="text-center">
          <button
            onClick={generateSolution}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
          >
            🧠 Generate AI Solution
          </button>
          <p className="text-xs text-gray-500 mt-2">AI will provide step-by-step solutions with explanations</p>
        </div>
      )}

      {isProcessing && (
        <div className="text-center py-8">
          <div className="loading-animation mb-4">
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          <p className="text-blue-600 font-medium">AI is analyzing your problem...</p>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      )}

      {solution && (
        <div className="solution-content">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-green-800">✨ Solution Generated</h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Confidence: {Math.round(solution.confidence * 100)}%</span>
              <button
                onClick={clearSolution}
                className="text-red-600 hover:text-red-800 text-sm underline"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Final Answer */}
          <div className="answer-box bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
            <h5 className="font-semibold text-green-800 mb-2">📝 Final Answer:</h5>
            <p className="text-green-700 font-medium">{solution.solution}</p>
          </div>

          {/* Step-by-step solution */}
          <div className="steps-section bg-white border rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-gray-800 mb-3">📚 Step-by-Step Solution:</h5>
            <div className="space-y-3">
              {solution.stepByStep.map((step: any, index: number) => (
                <div key={index} className="step-item border-l-4 border-blue-200 pl-4">
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Step {step.step}
                    </span>
                  </div>
                  <p className="text-gray-800 mt-2 font-medium">{step.description}</p>
                  <p className="text-gray-600 text-sm mt-1">{step.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Concepts covered */}
          <div className="concepts-section">
            <h5 className="font-semibold text-gray-800 mb-2">🎯 Key Concepts:</h5>
            <div className="flex flex-wrap gap-2">
              {solution.concepts.map((concept: string, index: number) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <button
            onClick={generateSolution}
            className="mt-2 text-red-800 underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
