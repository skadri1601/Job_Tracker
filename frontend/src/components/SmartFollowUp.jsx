/**
 * SMART FOLLOW-UP AUTOMATION COMPONENT
 * ===================================
 * Intelligent follow-up scheduling and automation
 * Features: Optimal timing, email templates, auto-scheduling
 */

import React, { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function SmartFollowUp({ applications, onUpdate }) {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  const [followUps, setFollowUps] = useState([])
  const [automationSettings, setAutomationSettings] = useState({
    enabled: false,
    defaultDelay: 7, // days
    maxFollowUps: 3,
    emailTemplates: true
  })
  const [pendingFollowUps, setPendingFollowUps] = useState([])
  const [templates, setTemplates] = useState([])

  // ======================
  // FOLLOW-UP LOGIC
  // ======================
  
  // Calculate optimal follow-up timing based on application status and industry
  const calculateOptimalTiming = (application) => {
    const now = new Date()
    const appliedDate = new Date(application.applied_date)
    const daysSinceApplied = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24))
    
    let recommendedDelay = 7 // Default 1 week
    let urgency = 'medium'
    let reasoning = ''

    // Adjust timing based on application status
    switch (application.status) {
      case 'APPLIED':
        if (daysSinceApplied >= 14) {
          recommendedDelay = 1 // Follow up immediately
          urgency = 'high'
          reasoning = 'Application is getting old - follow up immediately'
        } else if (daysSinceApplied >= 7) {
          recommendedDelay = 3
          urgency = 'medium'
          reasoning = 'Good time for first follow-up'
        } else {
          recommendedDelay = 7 - daysSinceApplied
          urgency = 'low'
          reasoning = 'Wait a bit more before following up'
        }
        break
        
      case 'INTERVIEWING':
        recommendedDelay = 2 // Quick follow-up after interviews
        urgency = 'high'
        reasoning = 'Follow up quickly after interview interest'
        break
        
      case 'OFFER':
        recommendedDelay = 1 // Immediate response needed
        urgency = 'high'
        reasoning = 'Offer received - respond promptly'
        break
        
      default:
        recommendedDelay = 14 // Less urgent for other statuses
        urgency = 'low'
        reasoning = 'Standard follow-up timing'
    }

    // Adjust for company size (larger companies typically take longer)
    const companySize = getCompanySize(application.company)
    if (companySize === 'large') {
      recommendedDelay += 3
      reasoning += ' (adjusted for large company response time)'
    } else if (companySize === 'startup') {
      recommendedDelay = Math.max(recommendedDelay - 2, 1)
      reasoning += ' (adjusted for startup agility)'
    }

    // Calculate optimal day of week (Tuesday-Thursday are best)
    const followUpDate = new Date()
    followUpDate.setDate(followUpDate.getDate() + recommendedDelay)
    
    // Adjust to optimal day of week
    const dayOfWeek = followUpDate.getDay()
    if (dayOfWeek === 0) { // Sunday
      followUpDate.setDate(followUpDate.getDate() + 2) // Move to Tuesday
    } else if (dayOfWeek === 6) { // Saturday
      followUpDate.setDate(followUpDate.getDate() + 3) // Move to Tuesday
    } else if (dayOfWeek === 1) { // Monday
      followUpDate.setDate(followUpDate.getDate() + 1) // Move to Tuesday
    } else if (dayOfWeek === 5) { // Friday
      followUpDate.setDate(followUpDate.getDate() + 4) // Move to Tuesday
    }

    return {
      recommendedDate: followUpDate,
      urgency,
      reasoning,
      delayDays: recommendedDelay
    }
  }

  // Get company size category
  const getCompanySize = (company) => {
    const companyLower = company.toLowerCase()
    const bigTech = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix', 'uber', 'airbnb']
    const enterprise = ['ibm', 'oracle', 'salesforce', 'adobe', 'intuit', 'workday', 'servicenow']
    
    if (bigTech.some(tech => companyLower.includes(tech))) return 'large'
    if (enterprise.some(ent => companyLower.includes(ent))) return 'large'
    if (companyLower.includes('startup') || companyLower.includes('inc.')) return 'startup'
    return 'medium'
  }

  // Generate follow-up email templates
  const generateEmailTemplate = (application, followUpNumber = 1) => {
    const templates = {
      1: { // First follow-up
        subject: `Following up on ${application.role} Application`,
        body: `Dear Hiring Manager,

I hope this email finds you well. I wanted to follow up on my application for the ${application.role} position at ${application.company} that I submitted on ${new Date(application.applied_date).toLocaleDateString()}.

I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience can contribute to your team. I'm particularly excited about ${application.company}'s mission and would love to learn more about the role.

Would you be available for a brief conversation in the coming days? I'm happy to work around your schedule.

Thank you for your time and consideration.

Best regards,
[Your Name]`
      },
      2: { // Second follow-up
        subject: `Checking in: ${application.role} Position`,
        body: `Hello,

I wanted to check in regarding my application for the ${application.role} position. I understand you're likely reviewing many applications, and I wanted to reiterate my strong interest in joining the ${application.company} team.

Since my last email, I've been [mention any relevant updates, projects, or achievements]. I believe these experiences further demonstrate my fit for this role.

I'd appreciate any updates you might have on the hiring timeline, and I'm available for an interview at your convenience.

Thank you for your consideration.

Best,
[Your Name]`
      },
      3: { // Final follow-up
        subject: `Final check-in: ${application.role} Opportunity`,
        body: `Hello,

I hope you're doing well. This is my final follow-up regarding the ${application.role} position at ${application.company}.

I want to express my continued interest in the role and respect that hiring processes take time. If the position is still open and you need any additional information from me, please don't hesitate to reach out.

If you've moved forward with other candidates, I completely understand and would appreciate being considered for future opportunities that align with my background.

Thank you again for your time and consideration.

Best wishes,
[Your Name]`
      }
    }
    
    return templates[followUpNumber] || templates[1]
  }

  // Schedule automatic follow-up
  const scheduleFollowUp = async (application, timing) => {
    const followUpData = {
      application_id: application.id,
      scheduled_date: timing.recommendedDate.toISOString(),
      urgency: timing.urgency,
      reasoning: timing.reasoning,
      status: 'scheduled',
      follow_up_number: getFollowUpCount(application.id) + 1
    }

    try {
      // In a real app, this would save to backend
      const newFollowUp = {
        ...followUpData,
        id: Date.now(),
        created_at: new Date().toISOString()
      }
      
      setFollowUps(prev => [...prev, newFollowUp])
      
      // Update application with follow-up date
      if (onUpdate) {
        onUpdate(application.id, {
          follow_up_date: timing.recommendedDate.toISOString(),
          reminder_enabled: true
        })
      }
    } catch (error) {
      console.error('Error scheduling follow-up:', error)
    }
  }

  // Get current follow-up count for an application
  const getFollowUpCount = (applicationId) => {
    return followUps.filter(f => f.application_id === applicationId).length
  }

  // Process pending follow-ups
  const processPendingFollowUps = () => {
    const now = new Date()
    const pending = followUps.filter(followUp => {
      const scheduledDate = new Date(followUp.scheduled_date)
      return scheduledDate <= now && followUp.status === 'scheduled'
    })
    setPendingFollowUps(pending)
  }

  // Mark follow-up as completed
  const completeFollowUp = async (followUpId, result = 'sent') => {
    setFollowUps(prev => prev.map(f => 
      f.id === followUpId 
        ? { ...f, status: 'completed', completed_at: new Date().toISOString(), result }
        : f
    ))
  }

  // Generate follow-up insights
  const getFollowUpInsights = () => {
    const totalFollowUps = followUps.length
    const completedFollowUps = followUps.filter(f => f.status === 'completed').length
    const responseRate = completedFollowUps > 0 ? 
      followUps.filter(f => f.result === 'response').length / completedFollowUps : 0

    return {
      totalScheduled: totalFollowUps,
      completed: completedFollowUps,
      pending: pendingFollowUps.length,
      responseRate: Math.round(responseRate * 100)
    }
  }

  // ======================
  // EFFECTS
  // ======================
  
  useEffect(() => {
    processPendingFollowUps()
  }, [followUps])

  useEffect(() => {
    // Process applications for follow-up opportunities
    if (applications.length > 0) {
      const opportunities = applications
        .filter(app => app.status === 'APPLIED' && !app.follow_up_date)
        .map(app => ({
          ...app,
          timing: calculateOptimalTiming(app)
        }))
        .sort((a, b) => {
          const urgencyOrder = { high: 3, medium: 2, low: 1 }
          return urgencyOrder[b.timing.urgency] - urgencyOrder[a.timing.urgency]
        })
        .slice(0, 5) // Show top 5 opportunities

      // Auto-schedule if automation is enabled
      if (automationSettings.enabled) {
        opportunities.forEach(app => {
          const existingFollowUp = followUps.find(f => f.application_id === app.id)
          if (!existingFollowUp && getFollowUpCount(app.id) < automationSettings.maxFollowUps) {
            scheduleFollowUp(app, app.timing)
          }
        })
      }
    }
  }, [applications, automationSettings])

  // ======================
  // RENDER HELPERS
  // ======================
  
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const insights = getFollowUpInsights()

  // ======================
  // RENDER COMPONENT
  // ======================
  
  return (
    <div className="space-y-6">
      {/* Header with Automation Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Follow-up Automation</h3>
              <p className="text-sm text-gray-600">Intelligent timing and templates</p>
            </div>
          </div>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={automationSettings.enabled}
              onChange={(e) => setAutomationSettings(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Auto-schedule</span>
          </label>
        </div>

        {/* Follow-up Insights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{insights.totalScheduled}</div>
            <div className="text-sm text-blue-700">Scheduled</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{insights.completed}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{insights.pending}</div>
            <div className="text-sm text-orange-700">Due Now</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{insights.responseRate}%</div>
            <div className="text-sm text-purple-700">Response Rate</div>
          </div>
        </div>
      </div>

      {/* Pending Follow-ups */}
      {pendingFollowUps.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">⏰ Due Now</h4>
          <div className="space-y-4">
            {pendingFollowUps.map((followUp) => {
              const app = applications.find(a => a.id === followUp.application_id)
              if (!app) return null

              const template = generateEmailTemplate(app, followUp.follow_up_number)
              
              return (
                <div key={followUp.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900">{app.role} at {app.company}</h5>
                      <p className="text-sm text-gray-600">Follow-up #{followUp.follow_up_number}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(followUp.urgency)}`}>
                      {followUp.urgency} priority
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">{followUp.reasoning}</p>
                  
                  <div className="bg-white rounded-lg p-3 mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">📧 Suggested Email:</div>
                    <div className="text-xs text-gray-600 mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                      {template.body.substring(0, 200)}...
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => completeFollowUp(followUp.id, 'sent')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      ✓ Mark Sent
                    </button>
                    <button
                      onClick={() => completeFollowUp(followUp.id, 'skipped')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => {
                        const newDate = new Date()
                        newDate.setDate(newDate.getDate() + 3)
                        setFollowUps(prev => prev.map(f => 
                          f.id === followUp.id 
                            ? { ...f, scheduled_date: newDate.toISOString() }
                            : f
                        ))
                      }}
                      className="px-4 py-2 bg-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-300 transition-colors"
                    >
                      Snooze 3 days
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Follow-up Opportunities */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">💡 Follow-up Opportunities</h4>
        
        {applications
          .filter(app => app.status === 'APPLIED' && !followUps.find(f => f.application_id === app.id))
          .map(app => {
            const timing = calculateOptimalTiming(app)
            return (
              <div key={app.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">{app.role} at {app.company}</h5>
                    <p className="text-sm text-gray-600">Applied {new Date(app.applied_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(timing.urgency)}`}>
                    {timing.urgency} priority
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{timing.reasoning}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Recommended: {timing.recommendedDate.toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => scheduleFollowUp(app, timing)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Schedule Follow-up
                  </button>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}