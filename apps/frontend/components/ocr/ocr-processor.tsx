'use client'

import { useState } from 'react'

interface OCRProcessorProps {
  file: File | null
  onTextExtracted: (text: string) => void
}

export default function OCRProcessor({ file, onTextExtracted }: OCRProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [error, setError] = useState('')

  const processOCR = async () => {
    if (!file) return

    setIsProcessing(true)
    setError('')

    try {
      // Mock OCR processing for now - replace with actual Tesseract.js later
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
      
      // Mock extracted text based on file type
      let mockText = ''
      if (file.name.toLowerCase().includes('math')) {
        mockText = 'Solve the quadratic equation: 2x² + 5x - 3 = 0'
      } else if (file.name.toLowerCase().includes('physics')) {
        mockText = 'A ball is thrown upward with initial velocity 20 m/s. Calculate the maximum height.'
      } else {
        mockText = 'Sample mathematical problem extracted from the uploaded image. This is a mock OCR result that will be replaced with actual text extraction.'
      }
      
      setExtractedText(mockText)
      onTextExtracted(mockText)
    } catch (err) {
      setError('Failed to extract text from the image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearText = () => {
    setExtractedText('')
    setError('')
  }

  if (!file) {
    return null
  }

  return (
    <div className="ocr-processor mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Text Extraction</h3>
      
      {!extractedText && !isProcessing && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Extract text from your uploaded file</p>
          <button
            onClick={processOCR}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 Extract Text with OCR
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center py-8">
          <div className="loading-spinner inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-600 font-medium">Processing image...</p>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      )}

      {extractedText && (
        <div className="extracted-content">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-green-800">✓ Text Extracted Successfully</h4>
            <button
              onClick={clearText}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Clear
            </button>
          </div>
          <div className="bg-white p-4 rounded border">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{extractedText}</pre>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>✨ Text ready for AI processing</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <button
            onClick={processOCR}
            className="mt-2 text-red-800 underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
