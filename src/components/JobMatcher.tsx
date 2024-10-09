import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { matchJobWithCV } from '../services/openai'

interface JobMatcherProps {
  cvContent: string
  onMatch: (matched: boolean, description: string) => void
}

const JobMatcher: React.FC<JobMatcherProps> = ({ cvContent, onMatch }) => {
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMatch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const isMatched = await matchJobWithCV(cvContent, jobDescription)
      onMatch(isMatched, jobDescription)
    } catch (error) {
      console.error('Error matching job:', error)
      setError('An error occurred while matching the job. Please check your API key and try again.')
      onMatch(false, jobDescription)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter job description here..."
        className="w-full h-32 p-2 border rounded-md mb-4"
      />
      <button
        onClick={handleMatch}
        disabled={isLoading || !jobDescription.trim()}
        className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center disabled:bg-gray-300"
      >
        {isLoading ? (
          <span className="animate-spin mr-2">&#9696;</span>
        ) : (
          <Search className="mr-2" size={18} />
        )}
        {isLoading ? 'Matching...' : 'Match Job'}
      </button>
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}

export default JobMatcher