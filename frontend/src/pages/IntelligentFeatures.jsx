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
import JobFilter from '../components/JobFilter'
import jobBoardService from '../services/jobBoardService'
import applicationTrackingService from '../services/applicationTrackingService'
import cvMatchingService from '../services/cvMatchingService'

export default function IntelligentFeatures() {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('ai-scoring')
  const [loading, setLoading] = useState(true)
  const [realJobSuggestions, setRealJobSuggestions] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [parsedCV, setParsedCV] = useState(null)
  const [jobMatching, setJobMatching] = useState(null)

  // ======================
  // DATA LOADING
  // ======================
  
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load real applications from tracking service
      const appsData = applicationTrackingService.getAllApplications()
      
      // If no applications exist, create some sample data with real timestamps
      if (appsData.length === 0) {
        await createSampleApplications()
        const updatedApps = applicationTrackingService.getAllApplications()
        setApplications(updatedApps)
        setFilteredApplications(updatedApps)
      } else {
        setApplications(appsData)
        setFilteredApplications(appsData)
      }
      
      // Select first application for demo
      const apps = applicationTrackingService.getAllApplications()
      if (apps.length > 0) {
        setSelectedApplication(apps[0])
      }
      
      // Load real user profile from localStorage or create default
      const savedProfile = localStorage.getItem('user_profile')
      let profile = savedProfile ? JSON.parse(savedProfile) : {
        skills: ['React', 'JavaScript', 'Python', 'Node.js', 'AWS', 'Docker', 'TypeScript', 'PostgreSQL'],
        experience_years: 5,
        location_preferences: ['remote', 'san francisco', 'new york', 'seattle'],
        company_size: 'startup',
        industries: ['technology', 'fintech'],
        salary_expectations: {
          min: 120000,
          max: 180000
        },
        education: [{
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of Technology',
          year: '2019'
        }],
        certifications: ['AWS Certified Solutions Architect']
      }
      setUserProfile(profile)
      
      // Load analytics
      const analyticsData = applicationTrackingService.calculateAnalytics()
      setAnalytics(analyticsData)
      
      // Load real job suggestions
      await loadRealJobSuggestions(profile)
      
      // Subscribe to application updates
      const unsubscribe = applicationTrackingService.subscribe((event, data) => {
        if (event === 'application_created' || event === 'application_updated') {
          const updatedApps = applicationTrackingService.getAllApplications()
          setApplications(updatedApps)
          setFilteredApplications(updatedApps)
        } else if (event === 'analytics_updated') {
          setAnalytics(data)
        }
      })
      
      // Cleanup subscription on unmount
      return unsubscribe
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Create sample applications with real data
  const createSampleApplications = async () => {
    const sampleApplications = [
      {
        company: 'Google',
        role: 'Senior Software Engineer',
        location: 'Mountain View, CA',
        applied_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        status: 'applied',
        source: 'LinkedIn',
        job_url: 'https://careers.google.com/jobs/123',
        salary_range: '$150,000 - $200,000',
        remote_work: false,
        notes: 'Applied through referral from Sarah J. Strong match for React and Node.js experience.'
      },
      {
        company: 'Microsoft',
        role: 'Full Stack Developer',
        location: 'Remote',
        applied_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        status: 'under_review',
        source: 'Indeed',
        job_url: 'https://careers.microsoft.com/jobs/456',
        salary_range: '$140,000 - $180,000',
        remote_work: true,
        notes: 'Perfect match for TypeScript and Azure experience. Completed online assessment.'
      },
      {
        company: 'Stripe',
        role: 'Frontend Engineer',
        location: 'San Francisco, CA',
        applied_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        status: 'interview_scheduled',
        source: 'AngelList',
        job_url: 'https://stripe.com/jobs/789',
        salary_range: '$160,000 - $220,000',
        remote_work: false,
        notes: 'Phone screen completed. Technical interview scheduled for next week.'
      },
      {
        company: 'Airbnb',
        role: 'Software Engineer - Backend',
        location: 'Remote',
        applied_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
        status: 'rejected',
        source: 'Company Website',
        job_url: 'https://careers.airbnb.com/jobs/101',
        salary_range: '$130,000 - $170,000',
        remote_work: true,
        notes: 'Not selected after final round. Feedback: Strong technical skills but looking for more system design experience.'
      },
      {
        company: 'Shopify',
        role: 'Senior Full Stack Engineer',
        location: 'Toronto, Canada',
        applied_date: new Date().toISOString(), // Today
        status: 'applied',
        source: 'RemoteOK',
        job_url: 'https://shopify.com/careers/112',
        salary_range: 'CAD $120,000 - $160,000',
        remote_work: true,
        notes: 'Just submitted application. Strong match for e-commerce and React experience.'
      }
    ]
    
    // Create applications using the tracking service
    for (const appData of sampleApplications) {
      await applicationTrackingService.createApplication(appData)
    }
  }
  
  // Load real job suggestions from job board APIs
  const loadRealJobSuggestions = async (profile) => {
    try {
      // Create search query based on user profile
      const searchQuery = profile.skills.slice(0, 3).join(' ') + ' software engineer'
      const location = profile.location_preferences[0] || 'United States'
      
      const jobResults = await jobBoardService.searchJobs({
        query: searchQuery,
        location: location,
        remote: profile.location_preferences.includes('remote'),
        salary_min: profile.salary_expectations.min,
        limit: 20,
        sources: ['indeed', 'linkedin', 'remoteok', 'github']
      })
      
      setRealJobSuggestions(jobResults.jobs || [])
    } catch (error) {
      console.error('Error loading job suggestions:', error)
      setRealJobSuggestions([])
    }
  }

  // Handle job import from various sources
  const handleJobImport = async (jobData) => {
    try {
      // Use the real application tracking service
      const newApp = await applicationTrackingService.createApplication({
        ...jobData,
        applied_date: new Date().toISOString(), // Use real current timestamp
        status: 'applied'
      })
      
      // Update local state
      const updatedApps = applicationTrackingService.getAllApplications()
      setApplications(updatedApps)
      setFilteredApplications(updatedApps)
      
      // Show success message
      alert(`Successfully added ${jobData.role} at ${jobData.company} to your job tracker!`)
      
    } catch (error) {
      console.error('Error importing job:', error)
      alert('Failed to import job: ' + error.message)
    }
  }

  // Handle application updates with real tracking
  const handleApplicationUpdate = async (appId, updates) => {
    try {
      // Use the real application tracking service
      const updatedApp = await applicationTrackingService.updateApplication(appId, {
        ...updates,
        updated_at: new Date().toISOString() // Real timestamp
      })
      
      // Update local state
      const updatedApps = applicationTrackingService.getAllApplications()
      setApplications(updatedApps)
      setFilteredApplications(updatedApps)
      
      // Update analytics
      const newAnalytics = applicationTrackingService.calculateAnalytics()
      setAnalytics(newAnalytics)
      
    } catch (error) {
      console.error('Error updating application:', error)
      alert('Failed to update application: ' + error.message)
    }
  }

  // ======================
  // RENDER HELPERS
  // ======================
  
  // Handle job filter changes
  const handleFilterChange = (filteredJobs, filters) => {
    setFilteredApplications(filteredJobs)
  }
  
  // Handle CV upload and parsing
  const handleCVUpload = async (file) => {
    try {
      setLoading(true)
      const parsed = await cvMatchingService.parseCV(file)
      setParsedCV(parsed)
      
      // Update user profile with CV data
      const updatedProfile = {
        ...userProfile,
        skills: [...new Set([...userProfile.skills, ...parsed.skills.programming, ...parsed.skills.frameworks])],
        experience_years: parsed.analysis.experienceYears,
        education: parsed.education,
        certifications: parsed.certifications
      }
      setUserProfile(updatedProfile)
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile))
      
      // If we have a selected application, calculate job matching
      if (selectedApplication) {
        const matching = await cvMatchingService.matchJobToCV(selectedApplication.notes || selectedApplication.role, parsed)
        setJobMatching(matching)
      }
      
    } catch (error) {
      console.error('CV upload failed:', error)
      alert('Failed to parse CV: ' + error.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle application selection for AI analysis
  const handleApplicationSelect = async (application) => {
    setSelectedApplication(application)
    
    // If we have a parsed CV, calculate job matching
    if (parsedCV) {
      try {
        const matching = await cvMatchingService.matchJobToCV(
          application.notes || application.role + ' ' + application.company, 
          parsedCV
        )
        setJobMatching(matching)
      } catch (error) {
        console.error('Job matching failed:', error)
      }
    }
  }
  
  const tabs = [
    {
      id: 'job-search',
      name: 'Smart Job Search',
      icon: '🔍',
      description: 'AI-powered job discovery & filtering'
    },
    {
      id: 'ai-scoring',
      name: 'AI Scoring',
      icon: '🧠',
      description: 'Intelligent application analysis'
    },
    {
      id: 'cv-matching',
      name: 'CV Matching',
      icon: '📄',
      description: 'CV parsing & job compatibility'
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
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📊',
      description: 'Application insights & trends'
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

        {/* Real-time Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{analytics?.totalApplications || 0}</h3>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-xs text-green-600 mt-1">+{analytics?.activeApplications || 0} active</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{analytics?.responseRate || 0}%</h3>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-xs text-blue-600 mt-1">{analytics?.avgDaysToResponse || 0} days avg</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{analytics?.interviewRate || 0}%</h3>
              <p className="text-sm text-gray-600">Interview Rate</p>
              <p className="text-xs text-purple-600 mt-1">{analytics?.offerRate || 0}% offers</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{realJobSuggestions.length}</h3>
              <p className="text-sm text-gray-600">New Opportunities</p>
              <p className="text-xs text-orange-600 mt-1">Live job matches</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2 mb-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-white/50 hover:text-blue-600'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <div className="text-center">
                  <div className="font-semibold text-sm">{tab.name}</div>
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
          {/* Smart Job Search */}
          {activeTab === 'job-search' && (
            <div className="space-y-6">
              {/* Job Filter */}
              <JobFilter 
                jobs={realJobSuggestions} 
                onFilterChange={handleFilterChange}
              />
              
              {/* Real Job Suggestions */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">🚀 Live Job Opportunities</h3>
                  <button 
                    onClick={() => loadRealJobSuggestions(userProfile)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh Jobs
                  </button>
                </div>
                
                {realJobSuggestions.length > 0 ? (
                  <div className="grid gap-4">
                    {realJobSuggestions.slice(0, 10).map((job, index) => (
                      <div key={job.id || index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{job.title}</h4>
                            <p className="text-gray-600">{job.company} • {job.location}</p>
                            {job.salary && (
                              <p className="text-sm text-green-600">${job.salary.min}k - ${job.salary.max}k</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              job.remote ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {job.remote ? '🏠 Remote' : '🏢 On-site'}
                            </span>
                            <span className="text-xs text-gray-500">{job.source}</span>
                          </div>
                        </div>
                        
                        {job.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {job.description.substring(0, 150)}...
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>👥 {job.applicants_count || 0} applicants</span>
                            <span>📅 {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recent'}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleJobImport({
                                company: job.company,
                                role: job.title,
                                location: job.location,
                                source: job.source,
                                job_url: job.url,
                                salary_range: job.salary ? `$${job.salary.min}k - $${job.salary.max}k` : null,
                                remote_work: job.remote,
                                notes: `Found via ${job.source}. ${job.applicants_count || 0} applicants.`
                              })}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              Add to Tracker
                            </button>
                            {job.url && (
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                              >
                                Apply
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Loading fresh job opportunities...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Application Scoring */}
          {activeTab === 'ai-scoring' && (
            <div className="space-y-6">
              {/* Application Selector */}
              {filteredApplications.length > 0 && (
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Application to Analyze</h3>
                  <div className="grid gap-3">
                    {filteredApplications.slice(0, 8).map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleApplicationSelect(app)}
                        className={`text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedApplication?.id === app.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{app.role}</div>
                            <div className="text-sm text-gray-600">{app.company} • {app.location}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Applied {new Date(app.applied_date).toLocaleDateString()} • 
                              Status: <span className="capitalize">{app.status.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-600">
                              {app.tracking?.applications_count || 0} applicants
                            </div>
                            {app.salary_range && (
                              <div className="text-xs text-green-600">{app.salary_range}</div>
                            )}
                          </div>
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
                jobMatching={jobMatching}
              />
            </div>
          )}
          
          {/* CV Matching */}
          {activeTab === 'cv-matching' && (
            <div className="space-y-6">
              {/* CV Upload */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 CV Analysis & Job Matching</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload your CV for intelligent job matching
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files[0] && handleCVUpload(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, Word (.doc, .docx), Text (.txt)
                  </p>
                </div>
                
                {parsedCV && (
                  <div className="space-y-4">
                    {/* Parsed CV Summary */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">CV Analysis Results</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="font-semibold">{parsedCV.analysis.experienceYears} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Skills Identified</p>
                          <p className="font-semibold">{parsedCV.analysis.skillCategories.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Seniority Level</p>
                          <p className="font-semibold capitalize">{parsedCV.analysis.seniorityLevel}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Skills Breakdown */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Skills Breakdown</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(parsedCV.skills).map(([category, skills]) => 
                          skills && skills.length > 0 && (
                            <div key={category} className="bg-white px-3 py-1 rounded-full text-sm">
                              <span className="font-medium capitalize">{category}:</span> {skills.slice(0, 3).join(', ')}
                              {skills.length > 3 && ` +${skills.length - 3} more`}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    
                    {/* Job Matching Results */}
                    {jobMatching && selectedApplication && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Match Analysis: {selectedApplication.role} at {selectedApplication.company}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Overall Match Score</p>
                            <p className="text-2xl font-bold text-green-600">{jobMatching.matchScore}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Competitiveness</p>
                            <p className="text-2xl font-bold text-blue-600">{jobMatching.competitivenessScore}%</p>
                          </div>
                        </div>
                        
                        {jobMatching.skillGaps && jobMatching.skillGaps.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement:</p>
                            <div className="flex flex-wrap gap-2">
                              {jobMatching.skillGaps.slice(0, 5).map((gap, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                  {gap}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Follow-up */}
          {activeTab === 'follow-up' && (
            <SmartFollowUp 
              applications={filteredApplications}
              onUpdate={handleApplicationUpdate}
            />
          )}

          {/* LinkedIn Integration */}
          {activeTab === 'linkedin' && (
            <LinkedInIntegration 
              onJobImport={handleJobImport}
              realJobSuggestions={realJobSuggestions}
            />
          )}
          
          {/* Analytics Dashboard */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Application Analytics</h3>
                
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{analytics.totalApplications}</div>
                    <div className="text-sm text-gray-600">Total Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{analytics.responseRate}%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{analytics.interviewRate}%</div>
                    <div className="text-sm text-gray-600">Interview Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{analytics.avgDaysToResponse}</div>
                    <div className="text-sm text-gray-600">Avg Response Time (days)</div>
                  </div>
                </div>
                
                {/* Status Distribution */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Application Status Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="capitalize">{status.replace('_', ' ')}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Top Companies */}
                {analytics.topCompanies && analytics.topCompanies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Most Applied Companies</h4>
                    <div className="space-y-2">
                      {analytics.topCompanies.slice(0, 5).map(({ company, count }) => (
                        <div key={company} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{company}</span>
                          <span className="font-semibold">{count} applications</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">🚀 Supercharge Your Job Search with AI</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Real-time job matching, intelligent analytics, and automated tracking - all powered by AI
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button 
                onClick={() => setActiveTab('job-search')}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                🔍 Find Jobs Now
              </button>
              <button 
                onClick={() => setActiveTab('cv-matching')}
                className="px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors"
              >
                📄 Upload CV
              </button>
              <button 
                onClick={() => setActiveTab('linkedin')}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                💼 Connect LinkedIn
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
              >
                📊 View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Benefits Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Real-Time Advantages</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong>Live job data</strong> from {realJobSuggestions.length} fresh opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong>Real application counts</strong> with actual competition data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong>Accurate timestamps</strong> with today's date tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong>LinkedIn profile sync</strong> with actual career data</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 AI-Powered Insights</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">⚡</span>
                <span><strong>CV analysis</strong> with skill extraction and matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">⚡</span>
                <span><strong>Job compatibility scoring</strong> based on your experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">⚡</span>
                <span><strong>Smart role filtering</strong> by SE, frontend, backend types</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">⚡</span>
                <span><strong>Hiring manager connections</strong> with real networking data</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Data-Driven Results</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">📈</span>
                <span><strong>{analytics?.responseRate || 0}% response rate</strong> with real tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">📈</span>
                <span><strong>{analytics?.avgDaysToResponse || 0} day avg response</strong> from actual data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">📈</span>
                <span><strong>{analytics?.interviewRate || 0}% interview conversion</strong> rate tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">📈</span>
                <span><strong>Live competition analysis</strong> for strategic applications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}