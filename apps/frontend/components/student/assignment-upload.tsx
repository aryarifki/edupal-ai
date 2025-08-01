'use client'

import { useState, useCallback } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  className?: string
}

export default function FileUpload({ onFileSelect, className = '' }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && (file.type.includes('image') || file.type === 'application/pdf')) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  return (
    <div className={`file-upload-container ${className}`}>
      <div
        className={`upload-area border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragOver ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-gray-400'}
          ${selectedFile ? 'border-green-500 bg-green-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {selectedFile ? (
          <div className="success-state">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">File Selected</h3>
            <p className="text-green-600">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mt-2">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="text-gray-400 text-4xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isDragOver ? 'Drop your file here' : 'Upload Assignment'}
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your PDF, PNG, or JPG file here, or click to browse
            </p>
            <div className="upload-button bg-blue-600 text-white px-6 py-2 rounded-lg inline-block hover:bg-blue-700 transition-colors">
              Choose File
            </div>
          </div>
        )}
      </div>
      
      <input
        id="file-input"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileInput}
        className="hidden"
      />

      {selectedFile && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setSelectedFile(null)}
            className="text-red-600 hover:text-red-800 text-sm underline"
          >
            Remove file
          </button>
        </div>
      )}
    </div>
  )
}
