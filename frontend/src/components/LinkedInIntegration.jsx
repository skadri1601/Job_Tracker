/**
 * LINKEDIN INTEGRATION COMPONENT
 * =============================
 * LinkedIn connectivity and job sync functionality
 * Features: Profile sync, job import, networking tools
 */

import React, { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function LinkedInIntegration({ onJobImport }) {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  const [isConnected, setIsConnected] = useState(false)
  const [linkedInProfile, setLinkedInProfile] = useState(null)
  const [jobSuggestions, setJobSuggestions] = useState([])
  const [networkInsights, setNetworkInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [syncSettings, setSyncSettings] = useState({
    autoImportJobs: true,
    syncProfile: true,
    trackNetworking: true,
    jobAlerts: true
  })

  // ======================
  // LINKEDIN CONNECTION
  // ======================
  
  // Simulate LinkedIn OAuth connection
  const connectLinkedIn = async () => {
    setLoading(true)
    
    // In a real implementation, this would:
    // 1. Redirect to LinkedIn OAuth
    // 2. Get authorization
    // 3. Store access tokens
    
    try {
      // Simulate OAuth flow
      setTimeout(() => {
        const mockProfile = {
          id: 'linkedin_123',
          name: 'Professional User',
          headline: 'Software Engineer at Tech Corp',
          location: 'San Francisco, CA',
          industry: 'Technology',
          connections: 847,
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
          experience: [
            {
              title: 'Senior Software Engineer',
              company: 'Tech Corp',
              duration: '2021 - Present',
              location: 'San Francisco, CA'
            },
            {
              title: 'Software Engineer',
              company: 'Startup Inc',
              duration: '2019 - 2021',
              location: 'Remote'
            }
          ],
          education: [
            {
              school: 'University of California',
              degree: 'Bachelor of Computer Science',
              year: '2019'
            }
          ]
        }
        
        setLinkedInProfile(mockProfile)
        setIsConnected(true)
        setLoading(false)
        
        // Generate job suggestions based on profile
        generateJobSuggestions(mockProfile)
        
        // Generate network insights
        generateNetworkInsights(mockProfile)
      }, 2000)
    } catch (error) {
      console.error('LinkedIn connection failed:', error)
      setLoading(false)
    }
  }

  // Disconnect LinkedIn
  const disconnectLinkedIn = () => {
    setIsConnected(false)
    setLinkedInProfile(null)
    setJobSuggestions([])
    setNetworkInsights(null)
  }

  // ======================
  // JOB SUGGESTIONS
  // ======================
  
  // Generate personalized job suggestions based on LinkedIn profile
  const generateJobSuggestions = (profile) => {
    const suggestions = [
      {
        id: 'job_1',
        title: 'Senior Frontend Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA',
        matchScore: 95,
        matchReasons: [
          'Strong React experience',
          'Previous fintech exposure',
          'Location match'
        ],
        applyUrl: 'https://stripe.com/jobs',
        posted: '2 days ago',
        applicants: 47,
        networkConnections: 3,
        salaryRange: '$150k - $200k',
        remote: false
      },
      {
        id: 'job_2',
        title: 'Full Stack Developer',
        company: 'Airbnb',
        location: 'Remote',
        matchScore: 88,
        matchReasons: [
          'Full stack experience',
          'JavaScript expertise',
          'Remote work preference'
        ],
        applyUrl: 'https://airbnb.com/careers',
        posted: '1 week ago',
        applicants: 124,
        networkConnections: 1,
        salaryRange: '$130k - $180k',
        remote: true
      },
      {
        id: 'job_3',
        title: 'Senior Software Engineer',
        company: 'Shopify',
        location: 'Toronto, Canada',
        matchScore: 82,
        matchReasons: [
          'Backend experience',
          'E-commerce domain knowledge',
          'Growth-stage company'
        ],
        applyUrl: 'https://shopify.com/careers',
        posted: '3 days ago',
        applicants: 89,
        networkConnections: 0,
        salaryRange: 'CAD $120k - $160k',
        remote: true
      }
    ]
    
    setJobSuggestions(suggestions)
  }

  // ======================
  // NETWORKING INSIGHTS
  // ======================
  
  // Generate networking insights and connection opportunities
  const generateNetworkInsights = (profile) => {
    const insights = {
      networkGrowth: {
        lastMonth: 12,
        trend: 'up',
        recommendation: 'Great networking activity! Keep connecting with industry professionals.'
      },
      industryConnections: {
        technology: 234,
        finance: 45,
        healthcare: 23,
        education: 18
      },
      mutualConnections: [
        {
          name: 'Sarah Johnson',
          title: 'Engineering Manager at Google',
          mutuals: 15,
          company: 'Google',
          canIntroduce: true
        },
        {
          name: 'Mike Chen',
          title: 'Senior Developer at Microsoft',
          mutuals: 8,
          company: 'Microsoft',
          canIntroduce: true
        }
      ],
      companiesInNetwork: [
        { name: 'Google', connections: 23, hiring: true },
        { name: 'Microsoft', connections: 18, hiring: true },
        { name: 'Amazon', connections: 15, hiring: false },
        { name: 'Apple', connections: 12, hiring: true },
        { name: 'Meta', connections: 9, hiring: false }
      ],
      recommendedConnections: [
        {
          name: 'Alex Rodriguez',
          title: 'Tech Recruiter at Facebook',
          reason: 'Recruiter at companies you\'re interested in',
          mutuals: 5
        },
        {
          name: 'Jennifer Kim',
          title: 'Software Architect at Netflix',
          reason: 'Similar background and interests',
          mutuals: 3
        }
      ]
    }
    
    setNetworkInsights(insights)
  }

  // ======================
  // JOB IMPORT FUNCTIONS
  // ======================
  
  // Import job from LinkedIn to job tracker
  const importJob = async (job) => {
    const applicationData = {
      company: job.company,
      role: job.title,
      location: job.location,
      source: 'LinkedIn',
      job_url: job.applyUrl,
      salary_range: job.salaryRange,
      remote_work: job.remote,
      notes: `Match Score: ${job.matchScore}%\nMatch Reasons: ${job.matchReasons.join(', ')}\nNetwork Connections: ${job.networkConnections}`,
      linkedin_job_id: job.id
    }

    if (onJobImport) {
      onJobImport(applicationData)
    }
  }

  // Sync LinkedIn profile data with user profile
  const syncProfile = async () => {
    if (!linkedInProfile) return
    
    try {
      // Update user profile with LinkedIn data
      const profileUpdate = {
        skills: linkedInProfile.skills,
        experience: linkedInProfile.experience,
        education: linkedInProfile.education,
        location: linkedInProfile.location,
        industry: linkedInProfile.industry,
        linkedin_profile: linkedInProfile.id
      }
      
      // In real app, this would call API to update user profile
      console.log('Profile sync:', profileUpdate)
    } catch (error) {
      console.error('Profile sync failed:', error)
    }
  }

  // ======================
  // EFFECTS
  // ======================
  
  useEffect(() => {
    // Check if user is already connected to LinkedIn
    const checkConnection = () => {
      const savedProfile = localStorage.getItem('linkedin_profile')
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        setLinkedInProfile(profile)
        setIsConnected(true)
        generateJobSuggestions(profile)
        generateNetworkInsights(profile)
      }
    }
    
    checkConnection()
  }, [])

  useEffect(() => {
    // Save LinkedIn profile to localStorage
    if (linkedInProfile) {
      localStorage.setItem('linkedin_profile', JSON.stringify(linkedInProfile))
    } else {
      localStorage.removeItem('linkedin_profile')
    }
  }, [linkedInProfile])

  // ======================
  // RENDER HELPERS
  // ======================
  
  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  // ======================
  // RENDER COMPONENT
  // ======================
  
  return (
    <div className="space-y-6">
      {/* LinkedIn Connection Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">LinkedIn Integration</h3>
              <p className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Connect to unlock powerful features'}
              </p>
            </div>
          </div>
          
          {!isConnected ? (
            <button
              onClick={connectLinkedIn}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect LinkedIn'}
            </button>
          ) : (
            <button
              onClick={disconnectLinkedIn}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Connection Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Connecting to LinkedIn...</span>
            </div>
          </div>
        )}

        {/* Profile Summary */}
        {isConnected && linkedInProfile && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {linkedInProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{linkedInProfile.name}</h4>
                <p className="text-sm text-gray-600">{linkedInProfile.headline}</p>
                <p className="text-sm text-gray-500">{linkedInProfile.location} • {linkedInProfile.connections} connections</p>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {linkedInProfile.skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  {skill}
                </span>
              ))}
              {linkedInProfile.skills.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                  +{linkedInProfile.skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Job Suggestions */}
      {isConnected && jobSuggestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Personalized Job Matches</h4>
          
          <div className="space-y-4">
            {jobSuggestions.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-gray-900">{job.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.matchScore)}`}>
                        {job.matchScore}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                    <p className="text-sm text-gray-500">{job.salaryRange} • {job.posted}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Why it's a great match:</div>
                  <div className="flex flex-wrap gap-1">
                    {job.matchReasons.map((reason, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        ✓ {reason}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>👥 {job.applicants} applicants</span>
                    {job.networkConnections > 0 && (
                      <span className="text-blue-600">🤝 {job.networkConnections} network connections</span>
                    )}
                    {job.remote && <span className="text-green-600">🏠 Remote</span>}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => importJob(job)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Import to Tracker
                    </button>
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      View on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Network Insights */}
      {isConnected && networkInsights && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">🌐 Network Insights</h4>
          
          {/* Network Growth */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-blue-600">+{networkInsights.networkGrowth.lastMonth}</span>
              <span className="text-sm text-blue-700">new connections last month</span>
              <span className="text-green-600">📈</span>
            </div>
            <p className="text-sm text-blue-700">{networkInsights.networkGrowth.recommendation}</p>
          </div>
          
          {/* Companies in Network */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-3">Companies in Your Network</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {networkInsights.companiesInNetwork.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <div className="text-sm text-gray-600">{company.connections} connections</div>
                  </div>
                  {company.hiring && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Hiring
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended Connections */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Recommended Connections</h5>
            <div className="space-y-3">
              {networkInsights.recommendedConnections.map((person, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-600">{person.title}</div>
                    <div className="text-sm text-gray-500">{person.reason} • {person.mutuals} mutual connections</div>
                  </div>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {isConnected && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Sync Settings</h4>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={syncSettings.autoImportJobs}
                onChange={(e) => setSyncSettings(prev => ({ ...prev, autoImportJobs: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Auto-import job suggestions</div>
                <div className="text-sm text-gray-600">Automatically add high-match jobs to your tracker</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={syncSettings.syncProfile}
                onChange={(e) => setSyncSettings(prev => ({ ...prev, syncProfile: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Sync profile data</div>
                <div className="text-sm text-gray-600">Keep your skills and experience updated from LinkedIn</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={syncSettings.trackNetworking}
                onChange={(e) => setSyncSettings(prev => ({ ...prev, trackNetworking: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Track networking activity</div>
                <div className="text-sm text-gray-600">Monitor connections and referral opportunities</div>
              </div>
            </label>
            
            <div className="pt-4 border-t">
              <button
                onClick={syncProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sync Profile Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}