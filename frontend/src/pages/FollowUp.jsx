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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Follow-up Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Add new job applications with detailed follow-up tracking
          </p>
        </div>

        {/* Follow-up Form */}
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -top-4 -right-12 w-40 h-40 bg-gradient-to-bl from-emerald-400/15 to-teal-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Add New Application with Follow-up
              </h2>
            </div>

            <form onSubmit={addFollowUp} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Basic Application Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name *</label>
                    <input 
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 bg-white text-gray-900" 
                      placeholder="Enter company name" 
                      value={company} 
                      onChange={e=>setCompany(e.target.value)}
                      required
                      minLength={2}
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Role *</label>
                    <input 
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 bg-white text-gray-900" 
                      placeholder="Enter job role" 
                      value={role} 
                      onChange={e=>setRole(e.target.value)}
                      required
                      minLength={2}
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location *</label>
                    <input 
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 bg-white text-gray-900" 
                      placeholder="Enter location" 
                      value={location} 
                      onChange={e=>setLocation(e.target.value)}
                      required
                      minLength={2}
                      maxLength={255}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Application Source</label>
                  <input 
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 bg-white text-gray-900" 
                    placeholder="e.g. LinkedIn, Company Website, Indeed, Referral" 
                    value={source} 
                    onChange={e=>setSource(e.target.value)}
                    maxLength={255}
                  />
                </div>
              </div>

              {/* Follow-up and Date Tracking */}
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-6">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Follow-up & Date Tracking
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Applied Date</label>
                    <input 
                      type="date"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900" 
                      value={appliedDate} 
                      onChange={e=>setAppliedDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Contact Date</label>
                    <input 
                      type="date"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900" 
                      value={lastContactDate} 
                      onChange={e=>setLastContactDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Follow-up Date</label>
                    <input 
                      type="date"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900" 
                      value={followUpDate} 
                      onChange={e=>setFollowUpDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Next Action Date</label>
                    <input 
                      type="date"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900" 
                      value={nextActionDate} 
                      onChange={e=>setNextActionDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Follow-ups Sent</label>
                    <input 
                      type="number"
                      min="0"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900" 
                      value={followUpSent} 
                      onChange={e=>setFollowUpSent(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={reminderEnabled}
                        onChange={e => setReminderEnabled(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Enable Smart Reminders</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Get notified about follow-ups</span>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</label>
                    <textarea 
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 resize-none bg-white text-gray-900" 
                      placeholder="Add any notes or comments..." 
                      rows={3}
                      value={notes} 
                      onChange={e=>setNotes(e.target.value)}
                      maxLength={5000}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button 
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  disabled={!company.trim() || !role.trim() || !location.trim()}
                >
                  Add Application with Follow-up
                </button>
              </div>
            </form>

            {err && <p className="mt-6 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{err}</p>}
          </div>
        </div>

        {/* Recent Applications Summary */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Applications
          </h3>
          <div className="text-center text-slate-600 dark:text-slate-400">
            Total Applications: <span className="font-semibold text-blue-600 dark:text-blue-400">{apps.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}