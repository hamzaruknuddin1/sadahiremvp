import React, { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import * as pdfjs from 'pdfjs-dist'

interface CVUploadProps {
  onUpload: (content: string) => void
}

const CVUpload: React.FC<CVUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPdfWorker = async () => {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker.default
    }
    loadPdfWorker()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (file) {
      try {
        let content: string
        if (file.type === 'application/pdf') {
          content = await readPdfContent(file)
        } else {
          content = await readTextContent(file)
        }
        console.log("CV Content length:", content.length)
        onUpload(content)
      } catch (err) {
        console.error('Error reading file:', err)
        setError("Failed to read file content")
      }
    }
  }

  const readPdfContent = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument(arrayBuffer).promise
    let content = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      content += textContent.items.map((item: any) => item.str).join(' ') + '\n'
    }
    return content
  }

  const readTextContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (content) {
          resolve(content)
        } else {
          reject(new Error("Failed to read file content"))
        }
      }
      reader.onerror = () => reject(new Error("Error reading file"))
      reader.readAsText(file)
    })
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center disabled:bg-gray-300"
      >
        <Upload className="mr-2" size={18} />
        Load Resume
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default CVUpload