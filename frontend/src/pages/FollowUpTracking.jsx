import React, { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function FollowUpTracking() {
  const [applications, setApplications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const data = await api('/applications/')
      setApplications(data)
      setError('')
    } catch (err) {
      setError(err.message)
      console.error('Error loading applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      await api(`/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      })
      
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteApplication = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    
    try {
      await api(`/applications/${id}`, { method: 'DELETE' })
      setApplications(prev => prev.filter(app => app.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      under_review: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      interview_scheduled: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      interview_completed: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      offer_received: 'bg-green-500/20 text-green-300 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
      accepted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      withdrawn: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const getStatusIcon = (status) => {
    const icons = {
      applied: '📝',
      under_review: '👀',
      interview_scheduled: '📅',
      interview_completed: '✅',
      offer_received: '🎉',
      rejected: '❌',
      accepted: '🎊',
      withdrawn: '⏸️'
    }
    return icons[status] || '📄'
  }

  const filteredAndSortedApplications = applications
    .filter(app => {
      const matchesSearch = !searchTerm || 
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'company':
          return a.company.localeCompare(b.company)
        case 'role':
          return a.role.localeCompare(b.role)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'recent':
        default:
          return new Date(b.applied_date || b.created_at) - new Date(a.applied_date || a.created_at)
      }
    })

  const getApplicationStats = () => {
    const total = applications.length
    const byStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {})
    
    return {
      total,
      applied: byStatus.applied || 0,
      under_review: byStatus.under_review || 0,
      interview_scheduled: byStatus.interview_scheduled || 0,
      offer_received: byStatus.offer_received || 0,
      rejected: byStatus.rejected || 0,
      accepted: byStatus.accepted || 0
    }
  }

  const stats = getApplicationStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Applications...</h2>
          <p className="text-slate-400">Retrieving your job application data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            📊 Application Tracking Center
          </h1>
          <p className="text-slate-300 text-xl mb-2">
            Comprehensive overview of all your job applications with advanced analytics
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Real-time Updates
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Status Management
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              Progress Analytics
            </span>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-slate-400 text-sm">Total</div>
          </div>
          <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.applied}</div>
            <div className="text-slate-400 text-sm">Applied</div>
          </div>
          <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.under_review}</div>
            <div className="text-slate-400 text-sm">Under Review</div>
          </div>
          <div className="bg-purple-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.interview_scheduled}</div>
            <div className="text-slate-400 text-sm">Interviews</div>
          </div>
          <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.offer_received}</div>
            <div className="text-slate-400 text-sm">Offers</div>
          </div>
          <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.accepted}</div>
            <div className="text-slate-400 text-sm">Accepted</div>
          </div>
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-slate-400 text-sm">Rejected</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card-3d p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Search Applications</label>
              <div className="relative">
                <svg className="absolute left-3 top-4 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by company, role, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white/90 border-2 border-white/30 rounded-xl text-gray-800 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-4 bg-white/90 border-2 border-white/30 rounded-xl text-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer Received</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-4 bg-white/90 border-2 border-white/30 rounded-xl text-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 shadow-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="company">Company A-Z</option>
                <option value="role">Role A-Z</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadApplications}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100/80 border border-red-300/50 rounded-2xl p-4 mb-6 backdrop-blur-sm">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Applications Grid */}
        {filteredAndSortedApplications.length === 0 ? (
          <div className="card-3d p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">
              {applications.length === 0 
                ? "You haven't added any applications yet. Start by adding your first application!" 
                : "No applications match your current filters. Try adjusting your search criteria."}
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedApplications.map((app) => (
              <div key={app.id} className="card-3d p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Application Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{getStatusIcon(app.status)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{app.role}</h3>
                        <p className="text-gray-600">{app.company} • {app.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Applied Date</div>
                        <div className="text-gray-800 font-medium">
                          {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'Not set'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Source</div>
                        <div className="text-gray-800 font-medium">{app.source || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Last Contact</div>
                        <div className="text-gray-800 font-medium">
                          {app.last_contact_date ? new Date(app.last_contact_date).toLocaleDateString() : 'None'}
                        </div>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="bg-white/60 rounded-lg p-3 mb-4 backdrop-blur-sm border border-white/30">
                        <div className="text-sm text-gray-500 mb-1">Notes</div>
                        <p className="text-gray-700 text-sm">{app.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col lg:items-end gap-4">
                    {/* Status Badge */}
                    <div className={`px-4 py-2 rounded-xl border text-sm font-semibold ${getStatusColor(app.status)}`}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </div>

                    {/* Status Update Dropdown */}
                    <div className="flex gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        className="px-3 py-2 bg-white/90 border-2 border-white/30 rounded-lg text-gray-800 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 shadow-sm"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEWING">Interviewing</option>
                        <option value="OFFER">Offer Received</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="ON_HOLD">On Hold</option>
                      </select>

                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="px-3 py-2 bg-red-100/80 border border-red-300/50 text-red-600 rounded-lg hover:bg-red-200/80 transition-all duration-200 backdrop-blur-sm"
                        title="Delete application"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Follow-up Info */}
                    {app.follow_up_date && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Follow-up Date</div>
                        <div className="text-green-600 text-sm font-medium">
                          {new Date(app.follow_up_date).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success Rate Analytics */}
        {applications.length > 0 && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="card-3d p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Application Funnel
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="text-blue-600 font-bold">
                    {stats.total > 0 ? Math.round(((stats.INTERVIEWING + stats.OFFER + stats.ACCEPTED) / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Interview Rate</span>
                  <span className="text-purple-600 font-bold">
                    {stats.total > 0 ? Math.round(((stats.INTERVIEWING + stats.OFFER + stats.ACCEPTED) / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Offer Rate</span>
                  <span className="text-green-600 font-bold">
                    {stats.total > 0 ? Math.round(((stats.OFFER + stats.ACCEPTED) / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="card-3d p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
              <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Progress Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Applications</span>
                  <span className="text-emerald-600 font-bold">
                    {stats.APPLIED + stats.INTERVIEWING + stats.ON_HOLD}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="text-teal-600 font-bold">
                    {stats.ACCEPTED + stats.REJECTED}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Success Rate</span>
                  <span className="text-green-400 font-bold">
                    {(stats.accepted + stats.rejected) > 0 ? Math.round((stats.accepted / (stats.accepted + stats.rejected)) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Insights
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div>• Track every application status change</div>
                <div>• Set follow-up reminders for better results</div>
                <div>• Monitor response rates by company</div>
                <div>• Analyze successful application patterns</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}