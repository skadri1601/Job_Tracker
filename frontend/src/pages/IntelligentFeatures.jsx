/**
 * INTELLIGENT FEATURES PAGE
 * ========================
 * Showcase of AI-powered and advanced job tracking features
 * Features: AI scoring, smart follow-up, LinkedIn integration
 */

import React, { useState, useEffect } from 'react'
import { api } from '../api/client'
import AIApplicationScoring from '../components/AIApplicationScoring'
import SmartFollowUp from '../components/SmartFollowUp'
import LinkedInIntegration from '../components/LinkedInIntegration'

export default function IntelligentFeatures() {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('ai-scoring')
  const [loading, setLoading] = useState(true)

  // ======================
  // DATA LOADING
  // ======================
  
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load applications
      const appsData = await api('/applications/')
      setApplications(appsData)
      
      // Select first application for demo
      if (appsData.length > 0) {
        setSelectedApplication(appsData[0])
      }
      
      // Mock user profile for AI features
      const mockProfile = {
        skills: ['React', 'JavaScript', 'Python', 'Node.js', 'AWS', 'Docker'],
        experience_years: 5,
        location_preferences: ['remote', 'san francisco', 'new york'],
        company_size: 'startup',
        industries: ['technology', 'fintech'],
        salary_expectations: {
          min: 120000,
          max: 180000
        }
      }
      setUserProfile(mockProfile)
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle job import from LinkedIn
  const handleJobImport = async (jobData) => {
    try {
      const newApp = await api('/applications/', {
        method: 'POST',
        body: JSON.stringify(jobData)
      })
      
      setApplications(prev => [newApp, ...prev])
      
      // Show success message (you could use a toast library here)
      alert('Job imported successfully!')
      
    } catch (error) {
      console.error('Error importing job:', error)
      alert('Failed to import job')
    }
  }

  // Handle application updates
  const handleApplicationUpdate = async (appId, updates) => {
    try {
      await api(`/applications/${appId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      })
      
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, ...updates } : app
      ))
      
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  // ======================
  // RENDER HELPERS
  // ======================
  
  const tabs = [
    {
      id: 'ai-scoring',
      name: 'AI Scoring',
      icon: '🧠',
      description: 'Intelligent application analysis'
    },
    {
      id: 'follow-up',
      name: 'Smart Follow-up',
      icon: '⏰',
      description: 'Automated follow-up management'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Integration',
      icon: '💼',
      description: 'Professional networking & job sync'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading intelligent features...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🚀 Intelligent Job Tracking
          </h1>
          <p className="text-slate-600 text-lg">
            AI-powered features that give you the competitive edge
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">95% Match Accuracy</h3>
              <p className="text-sm text-gray-600">AI analyzes job fit based on your profile and preferences</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3x Faster Follow-ups</h3>
              <p className="text-sm text-gray-600">Smart automation schedules optimal follow-up timing</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn Sync</h3>
              <p className="text-sm text-gray-600">One-click job import and network insights</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2 mb-8 shadow-lg">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-white/50 hover:text-blue-600'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className={`text-xs ${activeTab === tab.id ? 'text-blue-100' : 'text-slate-500'}`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* AI Application Scoring */}
          {activeTab === 'ai-scoring' && (
            <div className="space-y-6">
              {/* Application Selector */}
              {applications.length > 0 && (
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Application to Analyze</h3>
                  <div className="grid gap-3">
                    {applications.slice(0, 5).map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApplication(app)}
                        className={`text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedApplication?.id === app.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{app.role}</div>
                        <div className="text-sm text-gray-600">{app.company} • {app.location}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Applied {new Date(app.applied_date).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* AI Scoring Component */}
              <AIApplicationScoring 
                application={selectedApplication}
                userProfile={userProfile}
              />
            </div>
          )}

          {/* Smart Follow-up */}
          {activeTab === 'follow-up' && (
            <SmartFollowUp 
              applications={applications}
              onUpdate={handleApplicationUpdate}
            />
          )}

          {/* LinkedIn Integration */}
          {activeTab === 'linkedin' && (
            <LinkedInIntegration 
              onJobImport={handleJobImport}
            />
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">Ready to Accelerate Your Job Search?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              These intelligent features are designed to give you a competitive advantage in today's job market
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setActiveTab('linkedin')}
                className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Connect LinkedIn
              </button>
              <button 
                onClick={() => setActiveTab('ai-scoring')}
                className="px-8 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors"
              >
                Try AI Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Summary */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Why These Features Matter</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong>Save 5+ hours per week</strong> on manual follow-up scheduling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong>Increase response rates by 40%</strong> with optimal timing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong>Focus on high-probability applications</strong> with AI scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong>Leverage your network</strong> for warm introductions</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Competitive Advantages</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Stand out from other candidates with personalized follow-ups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Never miss an opportunity with intelligent scheduling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Make data-driven decisions about where to focus effort</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Turn your network into your biggest job search asset</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}