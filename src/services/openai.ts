import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey || apiKey === 'your_openai_api_key_here') {
  throw new Error('OpenAI API key is not set or is using the default value. Please check your .env file.');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In a production app, API calls should be made from a backend
});

const MAX_TOKENS = 8000; // Increased token limit for GPT-4

function truncateText(text: string, maxTokens: number): string {
  return text.slice(0, maxTokens * 4); // Assuming an average of 4 characters per token
}

export async function matchJobWithCV(cv: string, jobDescription: string): Promise<boolean> {
  try {
    console.log('Matching job with CV...');
    const truncatedCV = truncateText(cv, MAX_TOKENS / 2);
    const truncatedJobDescription = truncateText(jobDescription, MAX_TOKENS / 2);

    const prompt = `Given the following CV and job description, determine if there's a good match. Respond with only "true" for a match or "false" for no match.\n\nCV: ${truncatedCV}\n\nJob Description: ${truncatedJobDescription}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 10,
    });

    const content = response.choices[0].message.content;
    if (typeof content !== 'string') {
      throw new Error('Unexpected response from OpenAI API');
    }

    const isMatch = content.trim().toLowerCase() === 'true';
    console.log('Match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error in matchJobWithCV:', error);
    throw error;
  }
}

export async function generateMCQs(cv: string, jobDescription: string): Promise<Array<{question: string, options: string[], correctAnswer: number}>> {
  try {
    console.log('Generating MCQs...');
    const truncatedCV = truncateText(cv, MAX_TOKENS / 2);
    const truncatedJobDescription = truncateText(jobDescription, MAX_TOKENS / 2);

    const prompt = `Based on the following CV and job description, generate 10 multiple-choice questions (MCQs) that would be asked to the candidate during an interview. The questions should be relevant to the job requirements and the candidate's potential role, not directly about their CV content. Each question should have 4 options, with one best answer. 

Important guidelines:
1. All options should be plausible and competitive. Avoid obviously incorrect options.
2. The correct answer should not always be the most detailed or longest option.
3. Distribute the correct answers evenly among the options (A, B, C, D).
4. Questions should test both knowledge and problem-solving skills relevant to the job.

Format the output as a JSON array of objects, where each object has the structure: { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": 0 }. The correctAnswer should be the index (0-3) of the best option.

CV: ${truncatedCV}

Job Description: ${truncatedJobDescription}

Remember, the questions should be directed at the candidate as if they were being interviewed, not about the content of their CV.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    if (typeof content !== 'string') {
      throw new Error('Unexpected response from OpenAI API');
    }

    const mcqs = JSON.parse(content);
    console.log('Generated MCQs:', mcqs);
    return mcqs;
  } catch (error) {
    console.error('Error in generateMCQs:', error);
    throw error;
  }
}