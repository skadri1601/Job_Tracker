import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import ReminderNotifications from '../components/ReminderNotifications'

export default function FollowUpTracking() {
  const [apps, setApps] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [err, setErr] = useState(null)
  const [sortBy, setSortBy] = useState('follow_up_date')
  const [filterBy, setFilterBy] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  async function load() {
    try { 
      const data = await api('/applications/')
      setApps(data)
    } catch (e) { 
      setErr(e.message) 
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let filtered = [...apps]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'needs_followup':
          filtered = filtered.filter(app => {
            const followUpDate = app.follow_up_date ? new Date(app.follow_up_date) : null
            const today = new Date()
            return followUpDate && followUpDate <= today && app.reminder_enabled
          })
          break
        case 'upcoming_followup':
          filtered = filtered.filter(app => {
            const followUpDate = app.follow_up_date ? new Date(app.follow_up_date) : null
            const today = new Date()
            const nextWeek = new Date(today)
            nextWeek.setDate(nextWeek.getDate() + 7)
            return followUpDate && followUpDate > today && followUpDate <= nextWeek && app.reminder_enabled
          })
          break
        case 'overdue_actions':
          filtered = filtered.filter(app => {
            const actionDate = app.next_action_date ? new Date(app.next_action_date) : null
            const today = new Date()
            return actionDate && actionDate < today && app.reminder_enabled
          })
          break
        case 'stale_applications':
          filtered = filtered.filter(app => {
            const lastContact = app.last_contact_date ? new Date(app.last_contact_date) : null
            const applied = app.applied_date ? new Date(app.applied_date) : null
            const mostRecent = lastContact || applied
            const today = new Date()
            if (mostRecent && app.status === 'APPLIED') {
              const daysSince = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24))
              return daysSince >= 14
            }
            return false
          })
          break
        case 'with_reminders':
          filtered = filtered.filter(app => app.reminder_enabled)
          break
        default:
          break
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'follow_up_date':
          const aDate = a.follow_up_date ? new Date(a.follow_up_date) : new Date('9999-12-31')
          const bDate = b.follow_up_date ? new Date(b.follow_up_date) : new Date('9999-12-31')
          return aDate - bDate
        case 'next_action_date':
          const aAction = a.next_action_date ? new Date(a.next_action_date) : new Date('9999-12-31')
          const bAction = b.next_action_date ? new Date(b.next_action_date) : new Date('9999-12-31')
          return aAction - bAction
        case 'last_contact_date':
          const aContact = a.last_contact_date ? new Date(a.last_contact_date) : new Date('1900-01-01')
          const bContact = b.last_contact_date ? new Date(b.last_contact_date) : new Date('1900-01-01')
          return bContact - aContact
        case 'applied_date':
          const aApplied = a.applied_date ? new Date(a.applied_date) : new Date('1900-01-01')
          const bApplied = b.applied_date ? new Date(b.applied_date) : new Date('1900-01-01')
          return bApplied - aApplied
        case 'company':
          return a.company.localeCompare(b.company)
        default:
          return 0
      }
    })

    setFilteredApps(filtered)
  }, [apps, searchTerm, filterBy, sortBy])

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'INTERVIEWING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'OFFER': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'ON_HOLD': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getUrgencyIndicator = (app) => {
    const today = new Date()
    const followUpDate = app.follow_up_date ? new Date(app.follow_up_date) : null
    const actionDate = app.next_action_date ? new Date(app.next_action_date) : null

    if (followUpDate && followUpDate < today) {
      return { color: 'text-red-500', icon: '🔴', label: 'Overdue Follow-up' }
    }
    if (actionDate && actionDate < today) {
      return { color: 'text-red-500', icon: '⚠️', label: 'Overdue Action' }
    }
    if (followUpDate && followUpDate.toDateString() === today.toDateString()) {
      return { color: 'text-orange-500', icon: '📅', label: 'Due Today' }
    }
    if (actionDate && actionDate.toDateString() === today.toDateString()) {
      return { color: 'text-orange-500', icon: '📋', label: 'Action Due Today' }
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Follow-up & Tracking Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your job application follow-ups and track important dates
          </p>
        </div>

        {/* Smart Reminders */}
        <ReminderNotifications apps={apps} />

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search Applications</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Search by company, role, or location..."
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Filter By</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="all">All Applications</option>
                <option value="needs_followup">Needs Follow-up</option>
                <option value="upcoming_followup">Upcoming Follow-ups</option>
                <option value="overdue_actions">Overdue Actions</option>
                <option value="stale_applications">Stale Applications</option>
                <option value="with_reminders">With Reminders Enabled</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="follow_up_date">Follow-up Date</option>
                <option value="next_action_date">Next Action Date</option>
                <option value="last_contact_date">Last Contact</option>
                <option value="applied_date">Applied Date</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {apps.filter(app => {
                  const followUpDate = app.follow_up_date ? new Date(app.follow_up_date) : null
                  return followUpDate && followUpDate <= new Date() && app.reminder_enabled
                }).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Need Follow-up</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {apps.filter(app => {
                  const actionDate = app.next_action_date ? new Date(app.next_action_date) : null
                  return actionDate && actionDate < new Date() && app.reminder_enabled
                }).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Overdue Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {apps.filter(app => app.reminder_enabled).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">With Reminders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {filteredApps.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Showing</div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg">No applications found matching your criteria</div>
            </div>
          ) : (
            filteredApps.map((app) => {
              const urgency = getUrgencyIndicator(app)
              return (
                <div key={app.id} className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Application Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            {app.role}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium">{app.company}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-500">{app.location}</p>
                        </div>
                        {urgency && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-lg">{urgency.icon}</span>
                            <span className={urgency.color}>{urgency.label}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        {app.reminder_enabled && (
                          <span className="text-blue-500 text-sm">🔔 Reminders On</span>
                        )}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="lg:col-span-1 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">Applied</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300">{formatDate(app.applied_date)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">Last Contact</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300">{formatDate(app.last_contact_date)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">Follow-up</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300">{formatDate(app.follow_up_date)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">Next Action</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300">{formatDate(app.next_action_date)}</div>
                      </div>
                    </div>

                    {/* Notes and Actions */}
                    <div className="lg:col-span-1">
                      {app.notes && (
                        <div className="mb-4">
                          <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">Notes</div>
                          <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            {app.notes}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          Follow-ups sent: {app.follow_up_sent || 0}
                        </div>
                        {app.source && (
                          <div className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {app.source}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {err && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400">{err}</p>
          </div>
        )}
      </div>
    </div>
  )
}