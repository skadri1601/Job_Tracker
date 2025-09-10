import React, { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function FollowUp() {
  const [apps, setApps] = useState([])
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [source, setSource] = useState('')
  const [appliedDate, setAppliedDate] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [nextActionDate, setNextActionDate] = useState('')
  const [lastContactDate, setLastContactDate] = useState('')
  const [followUpSent, setFollowUpSent] = useState(0)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [notes, setNotes] = useState('')
  const [err, setErr] = useState(null)

  async function load() {
    try { setApps(await api('/applications/')) } catch (e) { setErr(e.message) }
  }
  useEffect(()=>{ load() }, [])

  async function addFollowUp(e) {
    e.preventDefault()
    setErr(null)
    
    // Frontend validation
    const trimmedCompany = company.trim()
    const trimmedRole = role.trim()
    const trimmedLocation = location.trim()
    
    if (!trimmedCompany) {
      setErr('Company name is required')
      return
    }
    
    if (!trimmedRole) {
      setErr('Role is required')
      return
    }
    
    if (!trimmedLocation) {
      setErr('Location is required')
      return
    }
    
    if (trimmedCompany.length < 2) {
      setErr('Company name must be at least 2 characters long')
      return
    }
    
    if (trimmedRole.length < 2) {
      setErr('Role must be at least 2 characters long')
      return
    }
    
    if (trimmedLocation.length < 2) {
      setErr('Location must be at least 2 characters long')
      return
    }
    
    try {
      await api('/applications/', { 
        method:'POST', 
        body: JSON.stringify({ 
          company: trimmedCompany, 
          role: trimmedRole, 
          location: trimmedLocation,
          source: source.trim() || null,
          applied_date: appliedDate || null,
          follow_up_date: followUpDate || null,
          next_action_date: nextActionDate || null,
          last_contact_date: lastContactDate || null,
          follow_up_sent: followUpSent || 0,
          reminder_enabled: reminderEnabled ? 1 : 0,
          notes: notes.trim() || null
        }) 
      })
      // Reset form
      setCompany(''); setRole(''); setLocation(''); setSource(''); 
      setAppliedDate(''); setFollowUpDate(''); setNextActionDate(''); setLastContactDate('');
      setFollowUpSent(0); setReminderEnabled(true); setNotes(''); 
      load()
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            📬 Follow-up Management
          </h1>
          <p className="text-slate-300 text-xl mb-2">
            Professional application tracking with intelligent follow-up system
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Smart Reminders
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Automated Tracking
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              Progress Analytics
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Add New Application
                  </h2>
                  <p className="text-slate-400">Complete application details with follow-up scheduling</p>
                </div>
              </div>

              <form onSubmit={addFollowUp} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-xl font-bold text-white">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Company Name *</label>
                      <input 
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300" 
                        placeholder="e.g., Google, Microsoft, Netflix" 
                        value={company} 
                        onChange={e=>setCompany(e.target.value)}
                        required
                        minLength={2}
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Job Role *</label>
                      <input 
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300" 
                        placeholder="e.g., Senior Software Engineer" 
                        value={role} 
                        onChange={e=>setRole(e.target.value)}
                        required
                        minLength={2}
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Location *</label>
                      <input 
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300" 
                        placeholder="e.g., San Francisco, CA or Remote" 
                        value={location} 
                        onChange={e=>setLocation(e.target.value)}
                        required
                        minLength={2}
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Application Source</label>
                      <select 
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                        value={source}
                        onChange={e=>setSource(e.target.value)}
                      >
                        <option value="">Select source</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Indeed">Indeed</option>
                        <option value="Company Website">Company Website</option>
                        <option value="AngelList">AngelList</option>
                        <option value="Glassdoor">Glassdoor</option>
                        <option value="Referral">Referral</option>
                        <option value="Recruiter">Recruiter</option>
                        <option value="Job Fair">Job Fair</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white">Timeline & Follow-up</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Applied Date</label>
                      <input 
                        type="date"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                        value={appliedDate} 
                        onChange={e=>setAppliedDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Follow-up Date</label>
                      <input 
                        type="date"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                        value={followUpDate} 
                        onChange={e=>setFollowUpDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Last Contact Date</label>
                      <input 
                        type="date"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                        value={lastContactDate} 
                        onChange={e=>setLastContactDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Next Action Date</label>
                      <input 
                        type="date"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                        value={nextActionDate} 
                        onChange={e=>setNextActionDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Follow-up Settings */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white">Settings & Notes</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Follow-ups Sent</label>
                      <input 
                        type="number"
                        min="0"
                        max="10"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                        value={followUpSent}
                        onChange={e=>setFollowUpSent(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reminderEnabled}
                          onChange={e=>setReminderEnabled(e.target.checked)}
                          className="w-5 h-5 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-400 focus:ring-2"
                        />
                        <span className="text-slate-300 font-medium">Enable Reminders</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Application Notes</label>
                    <textarea 
                      className="w-full rounded-xl border-2 border-slate-600 bg-slate-700/50 px-4 py-4 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none h-32"
                      placeholder="Add any relevant notes, interview details, or follow-up reminders..."
                      value={notes}
                      onChange={e=>setNotes(e.target.value)}
                      maxLength={1000}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25" 
                    type="submit"
                  >
                    🚀 Add Application & Setup Follow-up
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {err && (
                <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <p className="text-red-300 font-medium">{err}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recent Applications & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-4 rounded-xl border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400">{apps.length}</div>
                  <div className="text-slate-400 text-sm">Total Applications</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 rounded-xl border border-emerald-500/30">
                  <div className="text-2xl font-bold text-emerald-400">{apps.filter(app => app.follow_up_date).length}</div>
                  <div className="text-slate-400 text-sm">Follow-ups Set</div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Applications
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {apps.slice(0, 5).map((app, index) => (
                  <div key={app.id || index} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white truncate">{app.role}</h4>
                      <span className="text-xs text-slate-400">{new Date(app.applied_date || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{app.company}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        {app.location}
                      </span>
                      {app.follow_up_date && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs">
                          📅 Follow-up Set
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {apps.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-slate-400 text-sm">No applications yet</div>
                    <div className="text-slate-500 text-xs mt-1">Add your first application above</div>
                  </div>
                )}
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Follow up 1-2 weeks after applying</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Track every interaction with detailed notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Set reminders for important dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Personalize each follow-up message</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}