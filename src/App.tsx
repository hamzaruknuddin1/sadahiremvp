import React, { useState } from 'react'
import CVUpload from './components/CVUpload'
import JobMatcher from './components/JobMatcher'
import MCQQuestions from './components/MCQQuestions'
import { FileText, Briefcase, CheckCircle, AlertTriangle, Loader } from 'lucide-react'

function App() {
  const [cvContent, setCVContent] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState<string | null>(null)
  const [isMatched, setIsMatched] = useState<boolean>(false)
  const [showMCQ, setShowMCQ] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCVUpload = (content: string) => {
    console.log("CV uploaded, content length:", content.length)
    setCVContent(content)
    setIsMatched(false)
    setShowMCQ(false)
    setError(null)
  }

  const handleJobMatch = async (matched: boolean, description: string) => {
    try {
      setIsLoading(true)
      setJobDescription(description)
      setIsMatched(matched)
      setShowMCQ(matched)
      setError(null)
      if (!matched) {
        setError('The CV does not match the job description. Please try with a different CV or job description.')
      }
    } catch (err) {
      setError('An error occurred while matching the job. Please check your API key and try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">CV Extractor</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <div className="flex">
              <AlertTriangle className="flex-shrink-0 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        <div className="flex items-center mb-6">
          <FileText className="text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">Upload CV</h2>
        </div>
        <CVUpload onUpload={handleCVUpload} />
        
        {cvContent && (
          <>
            <div className="flex items-center mt-8 mb-6">
              <Briefcase className="text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Job Matching</h2>
            </div>
            <JobMatcher cvContent={cvContent} onMatch={handleJobMatch} />
          </>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <Loader className="animate-spin mr-2" />
            <span>Processing...</span>
          </div>
        )}
        
        {isMatched && showMCQ && cvContent && jobDescription && (
          <>
            <div className="flex items-center mt-8 mb-6">
              <CheckCircle className="text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">MCQ Questions</h2>
            </div>
            <MCQQuestions cvContent={cvContent} jobDescription={jobDescription} />
          </>
        )}
      </div>
    </div>
  )
}

export default App