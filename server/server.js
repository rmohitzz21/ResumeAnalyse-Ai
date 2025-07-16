const express = require('express');

const cors = require('cors');
const {GoogleGenerativeAI} = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); 
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if(!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

const genAi = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAi.getGenerativeModel({model : "gemini-2.0-flash" });

app.post('/analyze-resume', async(req,res) => {

    const { resumeText, jobDescription } = req.body;
    if(!resumeText || !jobDescription){
        return res.status(400).json({error: 'Resume text and job description are required.'});
    }

    try {
        
        const prompt = `
            You are an expert resume analyzer. Your task is to evaluate a given resume against a job description and provide a compatibility score.
      The score should be out of 100, where 100 means a perfect match.
      Focus on key job-relevant attributes such as skills, experience, education, keywords, and overall relevance.

      Provide a brief justification for the score, highlighting strengths and areas for improvement

      Resume : 
      -----
      ${resumeText}

      Job Description :
      -----
      ${jobDescription}

      Please Provide the output in JSON format with the following structure:

    {
        "score": <integer, score out of 100>,
        "justification": "<string, brief explanation >" 
    }
    `;
        const result = await model.generateContent({
            contents: [{role: 'user', parts: [{text: prompt}]}],
            generationConfig: {
                responseMimeType: 'application/json', //
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        "score": {type: 'INTEGER'},
                        "justification": {type: 'STRING'}
                    },
                    "propertyOrdering": ["score", "justification"]
                }
            }
        });
        const response = result.response;
        const jsonString = response.text(); //
        const jsonResponse = JSON.parse(jsonString);

        res.json(jsonResponse);


    } catch (error) {
        console.error('Error Calling Gemini API:', error);
        res.status(500).json({error: 'Failed to analyze resume. Please try again later.'});
    }
});

app.listen(PORT, () => {
  console.log(`Node.js backend listening at http://localhost:${PORT}`);
});