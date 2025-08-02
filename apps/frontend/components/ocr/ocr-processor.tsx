'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Tesseract from 'tesseract.js'

interface OCRProcessorProps {
  onTextExtracted: (text: string) => void
}

export default function OCRProcessor({ onTextExtracted }: OCRProcessorProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/webp']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a valid image file (JPEG, PNG, BMP, or WebP)')
        return
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setFile(selectedFile)
      setError('')
      setExtractedText('')
      setProgress(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.webp']
    },
    multiple: false
  })

  const processOCR = async () => {
    if (!file) return

    setIsProcessing(true)
    setError('')
    setProgress(0)

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })
      
      const extractedText = result.data.text.trim()
      
      if (!extractedText) {
        setError('No text could be extracted from the image. Please try a clearer image.')
        return
      }

      setExtractedText(extractedText)
      onTextExtracted(extractedText)
    } catch (err) {
      console.error('OCR Error:', err)
      setError('Failed to extract text from the image. Please try again with a clearer image.')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const clearFile = () => {
    setFile(null)
    setExtractedText('')
    setError('')
    setProgress(0)
  }

  return (
    <div className="ocr-processor">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📸 Upload Assignment Image</h2>
        <p className="text-gray-600">Upload an image of your assignment to extract text automatically</p>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${file ? 'border-green-500 bg-green-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          {!file ? (
            <>
              <div className="text-4xl">📁</div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to select a file (JPEG, PNG, BMP, WebP - max 10MB)
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl">✅</div>
              <div>
                <p className="text-lg font-medium text-green-700">File selected: {file.name}</p>
                <p className="text-sm text-gray-500">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      {file && !isProcessing && (
        <div className="mt-6 flex space-x-4">
          <button
            onClick={processOCR}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔍 Extract Text from Image
          </button>
          <button
            onClick={clearFile}
            className="bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="loading-spinner w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="flex-1">
              <p className="font-medium text-blue-800">Processing image...</p>
              <div className="mt-2 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-600 mt-1">{progress}% complete</p>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Text */}
      {extractedText && !isProcessing && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3">✨ Extracted Text:</h3>
          <div className="bg-white p-3 rounded border text-gray-800 whitespace-pre-wrap max-h-64 overflow-y-auto">
            {extractedText}
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-green-600">
              {extractedText.length} characters extracted
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(extractedText)}
              className="text-green-700 hover:text-green-900 text-sm underline"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Preview:</h3>
          <div className="border rounded-lg p-2 bg-gray-50">
            <img
              src={URL.createObjectURL(file)}
              alt="Upload preview"
              className="max-w-full max-h-64 mx-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}
