import React, { useState, useEffect } from 'react'

export default function ReminderNotifications({ apps }) {
  const [reminders, setReminders] = useState([])
  const [dismissedReminders, setDismissedReminders] = useState(new Set())

  useEffect(() => {
    if (!apps || apps.length === 0) return

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const activeReminders = []

    apps.forEach(app => {
      if (!app.reminder_enabled) return

      const followUpDate = app.follow_up_date ? new Date(app.follow_up_date) : null
      const nextActionDate = app.next_action_date ? new Date(app.next_action_date) : null

      // Check for overdue follow-ups
      if (followUpDate && followUpDate < today && !dismissedReminders.has(`follow-up-overdue-${app.id}`)) {
        const daysOverdue = Math.floor((today - followUpDate) / (1000 * 60 * 60 * 24))
        activeReminders.push({
          id: `follow-up-overdue-${app.id}`,
          type: 'overdue',
          priority: 'high',
          app,
          title: 'Overdue Follow-up',
          message: `Follow-up for ${app.role} at ${app.company} was due ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} ago`,
          daysOverdue
        })
      }

      // Check for follow-ups due today
      if (followUpDate && followUpDate.toDateString() === today.toDateString() && !dismissedReminders.has(`follow-up-today-${app.id}`)) {
        activeReminders.push({
          id: `follow-up-today-${app.id}`,
          type: 'due-today',
          priority: 'high',
          app,
          title: 'Follow-up Due Today',
          message: `Time to follow up on your application for ${app.role} at ${app.company}`
        })
      }

      // Check for follow-ups due tomorrow
      if (followUpDate && followUpDate.toDateString() === tomorrow.toDateString() && !dismissedReminders.has(`follow-up-tomorrow-${app.id}`)) {
        activeReminders.push({
          id: `follow-up-tomorrow-${app.id}`,
          type: 'due-tomorrow',
          priority: 'medium',
          app,
          title: 'Follow-up Due Tomorrow',
          message: `Don't forget to follow up on ${app.role} at ${app.company} tomorrow`
        })
      }

      // Check for overdue next actions
      if (nextActionDate && nextActionDate < today && !dismissedReminders.has(`action-overdue-${app.id}`)) {
        const daysOverdue = Math.floor((today - nextActionDate) / (1000 * 60 * 60 * 24))
        activeReminders.push({
          id: `action-overdue-${app.id}`,
          type: 'overdue',
          priority: 'high',
          app,
          title: 'Overdue Action Item',
          message: `Action item for ${app.role} at ${app.company} was due ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} ago`,
          daysOverdue
        })
      }

      // Check for actions due today
      if (nextActionDate && nextActionDate.toDateString() === today.toDateString() && !dismissedReminders.has(`action-today-${app.id}`)) {
        activeReminders.push({
          id: `action-today-${app.id}`,
          type: 'due-today',
          priority: 'high',
          app,
          title: 'Action Item Due Today',
          message: `You have an action item due today for ${app.role} at ${app.company}`
        })
      }

      // Check for no recent activity (stale applications)
      const lastContactDate = app.last_contact_date ? new Date(app.last_contact_date) : null
      const appliedDate = app.applied_date ? new Date(app.applied_date) : null
      const mostRecentActivity = lastContactDate || appliedDate

      if (mostRecentActivity && app.status === 'APPLIED') {
        const daysSinceActivity = Math.floor((today - mostRecentActivity) / (1000 * 60 * 60 * 24))
        if (daysSinceActivity >= 14 && !dismissedReminders.has(`stale-${app.id}`)) {
          activeReminders.push({
            id: `stale-${app.id}`,
            type: 'stale',
            priority: 'low',
            app,
            title: 'Application Needs Attention',
            message: `No activity on ${app.role} at ${app.company} for ${daysSinceActivity} days. Consider following up.`,
            daysSinceActivity
          })
        }
      }
    })

    // Sort by priority and date
    activeReminders.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    setReminders(activeReminders)
  }, [apps, dismissedReminders])

  const dismissReminder = (reminderId) => {
    setDismissedReminders(prev => new Set([...prev, reminderId]))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'low': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-700'
    }
  }

  const getPriorityIcon = (priority, type) => {
    if (type === 'overdue') {
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    if (type === 'due-today') {
      return (
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 14l6-6M8 9l3-3" />
        </svg>
      )
    }
    if (type === 'stale') {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }

  if (reminders.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="relative bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-2xl shadow-orange-500/20 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-8 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-tr from-yellow-400/15 to-orange-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM5 12l5-5v3h8v4H10v3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Smart Reminders
            </h2>
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm font-medium px-3 py-1 rounded-full">
              {reminders.length}
            </span>
          </div>

          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-4 rounded-2xl border-2 ${getPriorityColor(reminder.priority)} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getPriorityIcon(reminder.priority, reminder.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {reminder.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                        {reminder.message}
                      </p>
                      {reminder.type === 'stale' && (
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                          Last activity: {reminder.daysSinceActivity} days ago
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissReminder(reminder.id)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 p-1"
                    title="Dismiss reminder"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
            Reminders are automatically generated based on your follow-up dates and application activity
          </div>
        </div>
      </div>
    </div>
  )
}