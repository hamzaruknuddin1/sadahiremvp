import React, { useState, useEffect } from 'react'
import { generateMCQs } from '../services/openai'

interface MCQQuestionsProps {
  cvContent: string
  jobDescription: string
}

const MCQQuestions: React.FC<MCQQuestionsProps> = ({ cvContent, jobDescription }) => {
  const [questions, setQuestions] = useState<Array<{question: string, options: string[], correctAnswer: number}>>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const generatedQuestions = await generateMCQs(cvContent, jobDescription)
        setQuestions(generatedQuestions)
      } catch (error) {
        console.error('Error generating questions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [cvContent, jobDescription])

  const handleAnswerClick = (selectedAnswer: number) => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }
  }

  if (isLoading) {
    return <div className="text-center">Generating questions...</div>
  }

  return (
    <div className="max-w-lg mx-auto">
      {showScore ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Score: {score} out of {questions.length}</h2>
          <p>{score >= 8 ? "Great job! You passed the test." : "You didn't pass. Please try again later."}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Question {currentQuestion + 1}/{questions.length}</h2>
          <p className="mb-4">{questions[currentQuestion].question}</p>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className="w-full text-left p-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MCQQuestions