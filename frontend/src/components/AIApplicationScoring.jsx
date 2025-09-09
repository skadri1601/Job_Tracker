/**
 * AI APPLICATION SCORING COMPONENT
 * ================================
 * Intelligent application analysis and scoring system
 * Features: Match scoring, success probability, optimization suggestions
 */

import React, { useState, useEffect } from 'react'

export default function AIApplicationScoring({ application, userProfile }) {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  const [score, setScore] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  // ======================
  // AI SCORING LOGIC
  // ======================
  
  // Calculate application match score based on multiple factors
  const calculateApplicationScore = (app, profile) => {
    let totalScore = 0
    let factors = []

    // Role Match Analysis (30% weight)
    const roleMatch = analyzeRoleMatch(app.role, profile?.skills || [])
    totalScore += roleMatch.score * 0.3
    factors.push({
      category: 'Role Match',
      score: roleMatch.score,
      weight: 30,
      details: roleMatch.details
    })

    // Company Culture Fit (20% weight)
    const cultureMatch = analyzeCultureFit(app.company, profile?.preferences || {})
    totalScore += cultureMatch.score * 0.2
    factors.push({
      category: 'Culture Fit',
      score: cultureMatch.score,
      weight: 20,
      details: cultureMatch.details
    })

    // Location Preference (15% weight)
    const locationMatch = analyzeLocationMatch(app.location, profile?.location_preferences || [])
    totalScore += locationMatch.score * 0.15
    factors.push({
      category: 'Location Match',
      score: locationMatch.score,
      weight: 15,
      details: locationMatch.details
    })

    // Application Timing (10% weight)
    const timingScore = analyzeApplicationTiming(app.applied_date)
    totalScore += timingScore.score * 0.1
    factors.push({
      category: 'Application Timing',
      score: timingScore.score,
      weight: 10,
      details: timingScore.details
    })

    // Follow-up Strategy (15% weight)
    const followupScore = analyzeFollowupStrategy(app)
    totalScore += followupScore.score * 0.15
    factors.push({
      category: 'Follow-up Strategy',
      score: followupScore.score,
      weight: 15,
      details: followupScore.details
    })

    // Application Completeness (10% weight)
    const completenessScore = analyzeApplicationCompleteness(app)
    totalScore += completenessScore.score * 0.1
    factors.push({
      category: 'Application Quality',
      score: completenessScore.score,
      weight: 10,
      details: completenessScore.details
    })

    return {
      totalScore: Math.round(totalScore),
      factors,
      recommendations: generateRecommendations(factors)
    }
  }

  // Analyze how well the role matches user's skills
  const analyzeRoleMatch = (role, skills) => {
    const roleKeywords = extractRoleKeywords(role)
    const matchedSkills = skills.filter(skill => 
      roleKeywords.some(keyword => 
        keyword.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    
    const matchPercentage = roleKeywords.length > 0 ? 
      (matchedSkills.length / roleKeywords.length) * 100 : 50

    return {
      score: Math.min(matchPercentage, 100),
      details: {
        matchedSkills,
        roleKeywords,
        matchPercentage: Math.round(matchPercentage)
      }
    }
  }

  // Extract keywords from job role
  const extractRoleKeywords = (role) => {
    const keywords = role.toLowerCase().split(/[\s,\-_]+/)
    const techKeywords = [
      'react', 'javascript', 'python', 'java', 'node', 'angular', 'vue',
      'typescript', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'agile',
      'frontend', 'backend', 'fullstack', 'devops', 'mobile', 'ios', 'android'
    ]
    
    return keywords.filter(keyword => 
      keyword.length > 2 && 
      (techKeywords.includes(keyword) || keyword.includes('engineer') || keyword.includes('developer'))
    )
  }

  // Analyze culture fit based on company and preferences
  const analyzeCultureFit = (company, preferences) => {
    // This would ideally connect to a company database
    // For now, we'll use basic heuristics
    let score = 70 // Default neutral score
    let details = []

    // Company size preferences
    const companySize = getCompanySize(company)
    if (preferences.company_size === companySize) {
      score += 15
      details.push(`✓ Company size matches your preference (${companySize})`)
    }

    // Industry alignment
    const industry = getCompanyIndustry(company)
    if (preferences.industries?.includes(industry)) {
      score += 15
      details.push(`✓ Industry alignment (${industry})`)
    } else {
      details.push(`• Industry: ${industry}`)
    }

    return {
      score: Math.min(score, 100),
      details: { items: details, companySize, industry }
    }
  }

  // Simple company categorization (would be enhanced with real data)
  const getCompanySize = (company) => {
    const bigTech = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix']
    const enterprise = ['ibm', 'oracle', 'salesforce', 'adobe', 'intuit']
    
    const companyLower = company.toLowerCase()
    if (bigTech.some(tech => companyLower.includes(tech))) return 'Large (10000+)'
    if (enterprise.some(ent => companyLower.includes(ent))) return 'Enterprise (1000-10000)'
    return 'Startup/Mid-size (<1000)'
  }

  const getCompanyIndustry = (company) => {
    const companyLower = company.toLowerCase()
    if (['bank', 'financial', 'finance'].some(term => companyLower.includes(term))) return 'Finance'
    if (['health', 'medical', 'bio'].some(term => companyLower.includes(term))) return 'Healthcare'
    if (['game', 'gaming', 'entertainment'].some(term => companyLower.includes(term))) return 'Gaming'
    return 'Technology'
  }

  // Analyze location match
  const analyzeLocationMatch = (jobLocation, preferences) => {
    const isRemote = jobLocation.toLowerCase().includes('remote')
    const prefersRemote = preferences.includes('remote')
    
    let score = 50
    let details = []

    if (isRemote && prefersRemote) {
      score = 100
      details.push('✓ Perfect match: Remote position')
    } else if (isRemote && !prefersRemote) {
      score = 70
      details.push('• Remote work available (flexible option)')
    } else if (!isRemote && prefersRemote) {
      score = 30
      details.push('⚠ On-site position (may not match remote preference)')
    } else {
      score = 80
      details.push(`• Location: ${jobLocation}`)
    }

    return {
      score,
      details: { items: details, isRemote, prefersRemote }
    }
  }

  // Analyze application timing
  const analyzeApplicationTiming = (appliedDate) => {
    if (!appliedDate) return { score: 50, details: { message: 'No application date available' } }

    const applied = new Date(appliedDate)
    const now = new Date()
    const daysAgo = Math.floor((now - applied) / (1000 * 60 * 60 * 24))

    let score = 70
    let message = ''

    if (daysAgo <= 2) {
      score = 100
      message = '✓ Excellent: Applied very recently'
    } else if (daysAgo <= 7) {
      score = 90
      message = '✓ Good: Applied within a week'
    } else if (daysAgo <= 14) {
      score = 80
      message = '✓ Applied within 2 weeks'
    } else if (daysAgo <= 30) {
      score = 60
      message = '• Applied within a month'
    } else {
      score = 40
      message = '⚠ Application is getting older'
    }

    return {
      score,
      details: { message, daysAgo }
    }
  }

  // Analyze follow-up strategy
  const analyzeFollowupStrategy = (app) => {
    let score = 50
    let details = []

    if (app.follow_up_date) {
      score += 20
      details.push('✓ Follow-up date set')
    } else {
      details.push('⚠ No follow-up date planned')
    }

    if (app.last_contact_date) {
      score += 15
      details.push('✓ Contact history tracked')
    } else {
      details.push('• No contact history recorded')
    }

    if (app.notes && app.notes.length > 20) {
      score += 15
      details.push('✓ Detailed notes maintained')
    } else {
      details.push('• Could benefit from more detailed notes')
    }

    return {
      score: Math.min(score, 100),
      details: { items: details }
    }
  }

  // Analyze application completeness
  const analyzeApplicationCompleteness = (app) => {
    let score = 0
    let details = []
    const fields = ['company', 'role', 'location', 'status']
    
    fields.forEach(field => {
      if (app[field]) {
        score += 25
        details.push(`✓ ${field} provided`)
      } else {
        details.push(`⚠ Missing ${field}`)
      }
    })

    return { score, details: { items: details } }
  }

  // Generate improvement recommendations
  const generateRecommendations = (factors) => {
    const recommendations = []
    
    factors.forEach(factor => {
      if (factor.score < 70) {
        switch (factor.category) {
          case 'Role Match':
            recommendations.push({
              type: 'skill',
              priority: 'high',
              title: 'Improve Role Match',
              description: 'Consider highlighting relevant skills or gaining experience in key areas',
              action: 'Update resume to emphasize matching skills'
            })
            break
          case 'Follow-up Strategy':
            recommendations.push({
              type: 'process',
              priority: 'medium',
              title: 'Enhance Follow-up',
              description: 'Set follow-up reminders and maintain detailed application notes',
              action: 'Schedule follow-up actions'
            })
            break
          case 'Application Quality':
            recommendations.push({
              type: 'process',
              priority: 'medium',
              title: 'Complete Application Details',
              description: 'Ensure all application fields are filled with relevant information',
              action: 'Review and complete missing information'
            })
            break
        }
      }
    })

    // Add general recommendations
    recommendations.push({
      type: 'strategy',
      priority: 'low',
      title: 'Optimize Application Strategy',
      description: 'Focus on applications with scores above 75 for better success rates',
      action: 'Prioritize high-scoring applications'
    })

    return recommendations
  }

  // ======================
  // EFFECTS
  // ======================
  
  useEffect(() => {
    if (application && userProfile) {
      setLoading(true)
      
      // Simulate AI processing delay
      setTimeout(() => {
        const scoreData = calculateApplicationScore(application, userProfile)
        setScore(scoreData.totalScore)
        setAnalysis(scoreData.factors)
        setSuggestions(scoreData.recommendations)
        setLoading(false)
      }, 1000)
    }
  }, [application, userProfile])

  // ======================
  // HELPER FUNCTIONS
  // ======================
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    return 'Needs Improvement'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  // ======================
  // RENDER COMPONENT
  // ======================
  
  if (!application) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a9 9 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.548-1.146l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Application Analysis</h3>
          <p className="text-sm text-gray-600">Intelligent scoring and recommendations</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Analyzing application...</span>
          </div>
        </div>
      ) : score !== null ? (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${getScoreColor(score)}`}>
              <div className="text-3xl font-bold">{score}</div>
              <div>
                <div className="font-semibold">{getScoreLabel(score)}</div>
                <div className="text-sm opacity-75">Overall Score</div>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          {analysis && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
              <div className="space-y-3">
                {analysis.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{factor.category}</div>
                      <div className="text-sm text-gray-600">Weight: {factor.weight}%</div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg font-medium ${getScoreColor(factor.score)}`}>
                      {Math.round(factor.score)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {suggestions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${getPriorityColor(suggestion.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                      <span className={`px-2 py-1 text-xs rounded uppercase tracking-wide font-medium
                        ${suggestion.priority === 'high' ? 'bg-red-100 text-red-700' : 
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    <div className="text-sm font-medium text-gray-700">
                      💡 Action: {suggestion.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Probability */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium text-gray-900">Success Probability</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(score * 0.8)}%
            </div>
            <div className="text-sm text-gray-600">
              Based on your profile match and application quality
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Complete your profile to get AI-powered application insights</p>
        </div>
      )}
    </div>
  )
}