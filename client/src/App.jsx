import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle resume analysis
  const analyzeResume = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please provide both resume content and a job description.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
     
      const backendUrl = 'http://localhost:3001/analyze-resume'; // Replace with your backend URL in production

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Backend analysis failed.');
      }

      const result = await response.json(); // This will be the score and justification from your backend

      setAnalysisResult(result);

    } catch (apiError) {
      console.error('Error analyzing resume:', apiError);
      setError('An error occurred while analyzing the resume: ' + apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Resume Analyzer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="resume" className="block text-lg font-semibold text-gray-700 mb-2">
              Your Resume (Paste Text)
            </label>
            <textarea
              id="resume"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-64 resize-y"
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="jobDescription" className="block text-lg font-semibold text-gray-700 mb-2">
              Job Description (Paste Text)
            </label>
            <textarea
              id="jobDescription"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-64 resize-y"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button
          onClick={analyzeResume}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </div>
          ) : (
            'Analyze Resume'
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {analysisResult && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Analysis Result</h2>
            <div className="flex items-center mb-4">
              <span className="text-5xl font-extrabold text-green-600 mr-4">{analysisResult.score}</span>
              <span className="text-2xl font-semibold text-gray-700">/ 100</span>
            </div>
            <p className="text-lg text-gray-800 leading-relaxed">
              <span className="font-semibold">Justification:</span> {analysisResult.justification}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
