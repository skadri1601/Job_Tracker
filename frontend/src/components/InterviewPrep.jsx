/**
 * INTERVIEW PREPARATION COMPONENT  
 * ===============================
 * AI-powered interview question prediction and preparation
 * Features: Question generation, practice mode, company research
 */

import React, { useState, useEffect } from 'react'

export default function InterviewPrep({ application, userProfile }) {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [companyResearch, setCompanyResearch] = useState(null)

  // ======================
  // INTERVIEW QUESTIONS LOGIC
  // ======================
  
  // Generate likely interview questions based on job description and company
  const generateInterviewQuestions = (app, profile) => {
    const roleType = categorizeRole(app.role)
    const companyType = categorizeCompany(app.company)
    const experienceLevel = profile?.experience_years || 3

    const questionCategories = {
      behavioral: generateBehavioralQuestions(roleType, experienceLevel),
      technical: generateTechnicalQuestions(roleType, profile?.skills || []),
      companySpecific: generateCompanyQuestions(app.company, companyType),
      situational: generateSituationalQuestions(roleType),
      cultural: generateCulturalQuestions(companyType)
    }

    const allQuestions = []
    
    // Add questions from each category with different weights
    Object.entries(questionCategories).forEach(([category, categoryQuestions]) => {
      categoryQuestions.forEach(q => {
        allQuestions.push({
          ...q,
          category,
          likelihood: calculateQuestionLikelihood(q, app, profile)
        })
      })
    })

    // Sort by likelihood and return top questions
    return allQuestions
      .sort((a, b) => b.likelihood - a.likelihood)
      .slice(0, 15)
  }

  // Categorize role type for targeted questions
  const categorizeRole = (role) => {
    const roleLower = role.toLowerCase()
    if (roleLower.includes('senior') || roleLower.includes('lead')) return 'senior'
    if (roleLower.includes('manager') || roleLower.includes('director')) return 'management'
    if (roleLower.includes('frontend') || roleLower.includes('ui')) return 'frontend'
    if (roleLower.includes('backend') || roleLower.includes('api')) return 'backend'
    if (roleLower.includes('fullstack') || roleLower.includes('full stack')) return 'fullstack'
    if (roleLower.includes('devops') || roleLower.includes('sre')) return 'devops'
    return 'general'
  }

  // Categorize company type
  const categorizeCompany = (company) => {
    const companyLower = company.toLowerCase()
    const bigTech = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix']
    const startups = ['startup', 'inc.', 'labs']
    
    if (bigTech.some(tech => companyLower.includes(tech))) return 'bigtech'
    if (startups.some(startup => companyLower.includes(startup))) return 'startup'
    return 'enterprise'
  }

  // Generate behavioral questions
  const generateBehavioralQuestions = (roleType, experience) => {
    const baseQuestions = [
      {
        question: "Tell me about a time when you had to work with a difficult team member.",
        category: "teamwork",
        tips: "Use the STAR method (Situation, Task, Action, Result). Focus on how you maintained professionalism and found a solution.",
        followUps: ["How would you handle a similar situation in the future?", "What did you learn from this experience?"]
      },
      {
        question: "Describe a challenging project you worked on and how you overcame obstacles.",
        category: "problem-solving",
        tips: "Highlight your analytical thinking and persistence. Show how you broke down complex problems.",
        followUps: ["What would you do differently?", "How did this experience change your approach to similar challenges?"]
      },
      {
        question: "Give me an example of when you had to learn a new technology quickly.",
        category: "adaptability",
        tips: "Demonstrate your learning process and how you apply new knowledge effectively.",
        followUps: ["How do you typically approach learning new technologies?", "What resources do you find most helpful?"]
      }
    ]

    if (experience >= 5) {
      baseQuestions.push({
        question: "Tell me about a time you mentored or helped develop a junior team member.",
        category: "leadership",
        tips: "Show your coaching abilities and how you support others' growth.",
        followUps: ["What qualities make a good mentor?", "How do you balance mentoring with your own responsibilities?"]
      })
    }

    if (roleType === 'management' || roleType === 'senior') {
      baseQuestions.push({
        question: "Describe a time when you had to make a difficult technical decision with limited information.",
        category: "decision-making",
        tips: "Explain your decision-making process and how you mitigated risks.",
        followUps: ["How do you handle uncertainty in decision making?", "What would you do if new information contradicted your decision?"]
      })
    }

    return baseQuestions
  }

  // Generate technical questions based on role and skills
  const generateTechnicalQuestions = (roleType, skills) => {
    const questions = []

    if (skills.includes('React') || roleType === 'frontend') {
      questions.push({
        question: "Explain the difference between controlled and uncontrolled components in React.",
        category: "react",
        tips: "Focus on state management and when to use each approach. Give concrete examples.",
        followUps: ["How would you handle form validation?", "What are the performance implications?"]
      })
    }

    if (skills.includes('JavaScript') || skills.includes('TypeScript')) {
      questions.push({
        question: "What is event bubbling and how would you prevent it?",
        category: "javascript",
        tips: "Explain the concept clearly and mention event.stopPropagation() and preventDefault().",
        followUps: ["When would you want to prevent event bubbling?", "What's the difference between bubbling and capturing?"]
      })
    }

    if (skills.includes('Python')) {
      questions.push({
        question: "Explain the difference between a list and a tuple in Python.",
        category: "python",
        tips: "Cover mutability, performance, and use cases for each data structure.",
        followUps: ["When would you choose a tuple over a list?", "How do you handle large datasets efficiently?"]
      })
    }

    if (roleType === 'backend' || skills.includes('API')) {
      questions.push({
        question: "How would you design a RESTful API for a social media platform?",
        category: "system-design",
        tips: "Think about resources, HTTP methods, authentication, and scalability.",
        followUps: ["How would you handle rate limiting?", "What about data consistency across services?"]
      })
    }

    return questions
  }

  // Generate company-specific questions
  const generateCompanyQuestions = (company, companyType) => {
    const questions = [{
      question: `Why do you want to work at ${company}?`,
      category: "company-fit",
      tips: `Research ${company}'s mission, recent news, and values. Connect them to your career goals.`,
      followUps: ["What excites you most about our product/service?", "How do you see yourself contributing to our mission?"]
    }]

    if (companyType === 'bigtech') {
      questions.push({
        question: "How do you handle working at scale with millions of users?",
        category: "scale",
        tips: "Discuss performance optimization, monitoring, and distributed systems concepts.",
        followUps: ["What metrics would you track?", "How would you debug performance issues?"]
      })
    } else if (companyType === 'startup') {
      questions.push({
        question: "How do you thrive in a fast-paced, ambiguous environment?",
        category: "startup-culture",
        tips: "Emphasize adaptability, ownership, and comfort with changing priorities.",
        followUps: ["How do you prioritize when everything seems urgent?", "What excites you about the startup environment?"]
      })
    }

    return questions
  }

  // Generate situational questions
  const generateSituationalQuestions = (roleType) => {
    return [{
      question: "If you discovered a critical bug in production right before a major release, what would you do?",
      category: "crisis-management",
      tips: "Show your ability to assess impact, communicate clearly, and make tough decisions under pressure.",
      followUps: ["How would you prevent similar issues in the future?", "How would you communicate this to stakeholders?"]
    }]
  }

  // Generate cultural fit questions
  const generateCulturalQuestions = (companyType) => {
    return [{
      question: "How do you handle feedback and criticism?",
      category: "growth-mindset",
      tips: "Show that you view feedback as opportunities for growth and can handle constructive criticism professionally.",
      followUps: ["Can you give an example of how feedback helped you improve?", "How do you give feedback to others?"]
    }]
  }

  // Calculate question likelihood based on role and company
  const calculateQuestionLikelihood = (question, app, profile) => {
    let likelihood = 50 // Base likelihood

    // Adjust based on question category and role match
    if (question.category === 'technical' && (profile?.skills || []).length > 3) {
      likelihood += 30
    }
    
    if (question.category === 'behavioral') {
      likelihood += 25 // Behavioral questions are very common
    }

    if (question.category === 'company-fit') {
      likelihood += 35 // Almost always asked
    }

    // Adjust for experience level
    const experience = profile?.experience_years || 3
    if (question.category === 'leadership' && experience < 3) {
      likelihood -= 20
    }

    return Math.min(Math.max(likelihood, 10), 95) // Keep between 10-95%
  }

  // ======================
  // COMPANY RESEARCH
  // ======================
  
  const generateCompanyResearch = (company) => {
    // In a real app, this would fetch actual data from APIs
    return {
      overview: {
        founded: "2010",
        employees: "1,000-5,000",
        funding: "$50M Series B",
        headquarters: "San Francisco, CA"
      },
      recentNews: [
        { title: "Company launches new product feature", date: "2 weeks ago" },
        { title: "Secures major partnership", date: "1 month ago" },
        { title: "Expands to European markets", date: "2 months ago" }
      ],
      culture: {
        values: ["Innovation", "Collaboration", "Customer-first", "Growth mindset"],
        perks: ["Remote work", "Unlimited PTO", "Learning budget", "Equity options"]
      },
      interviewProcess: {
        stages: ["Phone screening", "Technical interview", "System design", "Cultural fit", "Final round"],
        duration: "2-3 weeks",
        tips: "Focus on problem-solving approach and cultural alignment"
      }
    }
  }

  // ======================
  // EFFECTS
  // ======================
  
  useEffect(() => {
    if (application && userProfile) {
      setLoading(true)
      
      setTimeout(() => {
        const generatedQuestions = generateInterviewQuestions(application, userProfile)
        setQuestions(generatedQuestions)
        
        const research = generateCompanyResearch(application.company)
        setCompanyResearch(research)
        
        setLoading(false)
      }, 1500)
    }
  }, [application, userProfile])

  // ======================
  // PRACTICE MODE HANDLERS
  // ======================
  
  const startPractice = () => {
    setPracticeMode(true)
    setCurrentQuestion(0)
    setAnswers({})
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setPracticeMode(false)
      // Show results summary
    }
  }

  const saveAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  // ======================
  // RENDER HELPERS
  // ======================
  
  const getLikelihoodColor = (likelihood) => {
    if (likelihood >= 80) return 'bg-red-100 text-red-700'
    if (likelihood >= 60) return 'bg-yellow-100 text-yellow-700'
    return 'bg-blue-100 text-blue-700'
  }

  const getLikelihoodLabel = (likelihood) => {
    if (likelihood >= 80) return 'Very Likely'
    if (likelihood >= 60) return 'Likely'
    return 'Possible'
  }

  // ======================
  // RENDER COMPONENT
  // ======================
  
  if (!application) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interview Preparation</h3>
            <p className="text-sm text-gray-600">AI-powered questions for {application.role} at {application.company}</p>
          </div>
        </div>

        {!practiceMode && (
          <div className="flex gap-4">
            <button
              onClick={startPractice}
              disabled={loading || questions.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Start Practice Session
            </button>
            <div className="text-sm text-gray-600 flex items-center">
              {loading ? 'Generating questions...' : `${questions.length} questions prepared`}
            </div>
          </div>
        )}
      </div>

      {/* Practice Mode */}
      {practiceMode && questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLikelihoodColor(questions[currentQuestion].likelihood)}`}>
                {getLikelihoodLabel(questions[currentQuestion].likelihood)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{questions[currentQuestion].question}</h4>
              <div className="text-sm text-gray-600">
                <strong>💡 Tip:</strong> {questions[currentQuestion].tips}
              </div>
            </div>

            <textarea
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg resize-none"
              placeholder="Practice your answer here..."
              value={answers[currentQuestion] || ''}
              onChange={(e) => saveAnswer(currentQuestion, e.target.value)}
            />

            {questions[currentQuestion].followUps && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">Potential Follow-up Questions:</div>
                <ul className="text-sm text-blue-800 space-y-1">
                  {questions[currentQuestion].followUps.map((followUp, index) => (
                    <li key={index}>• {followUp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Practice' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {!practiceMode && !loading && questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Predicted Interview Questions</h4>
          
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-gray-900 flex-1">{q.question}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getLikelihoodColor(q.likelihood)}`}>
                    {q.likelihood}% likely
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Category:</strong> {q.category} | <strong>Tip:</strong> {q.tips}
                </div>
                {q.followUps && (
                  <div className="text-xs text-gray-500">
                    <strong>Follow-ups:</strong> {q.followUps.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Research */}
      {companyResearch && !practiceMode && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Company Research: {application.company}</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Company Overview</h5>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Founded:</strong> {companyResearch.overview.founded}</div>
                <div><strong>Employees:</strong> {companyResearch.overview.employees}</div>
                <div><strong>Funding:</strong> {companyResearch.overview.funding}</div>
                <div><strong>HQ:</strong> {companyResearch.overview.headquarters}</div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Recent News</h5>
              <div className="space-y-2">
                {companyResearch.recentNews.map((news, index) => (
                  <div key={index} className="text-sm">
                    <div className="text-gray-900">{news.title}</div>
                    <div className="text-gray-500">{news.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Culture & Values</h5>
              <div className="text-sm text-gray-600">
                <div className="mb-2">
                  <strong>Values:</strong> {companyResearch.culture.values.join(', ')}
                </div>
                <div>
                  <strong>Perks:</strong> {companyResearch.culture.perks.join(', ')}
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Interview Process</h5>
              <div className="text-sm text-gray-600">
                <div className="mb-2">
                  <strong>Duration:</strong> {companyResearch.interviewProcess.duration}
                </div>
                <div className="mb-2">
                  <strong>Stages:</strong> {companyResearch.interviewProcess.stages.join(' → ')}
                </div>
                <div>
                  <strong>Key Tip:</strong> {companyResearch.interviewProcess.tips}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}