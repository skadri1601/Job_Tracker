import React from 'react'
import ApplicationCard from './ApplicationCard'

const LABELS = {
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  ON_HOLD: 'On Hold'
}
const COLORS = {
  APPLIED: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 animate-pulse',
  INTERVIEWING: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 text-white shadow-xl shadow-amber-500/30',
  OFFER: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white shadow-xl shadow-emerald-500/30',
  ACCEPTED: 'bg-gradient-to-br from-green-500 via-lime-500 to-emerald-600 text-white shadow-xl shadow-green-500/30 animate-bounce',
  REJECTED: 'bg-gradient-to-br from-rose-500 via-pink-500 to-red-600 text-white shadow-xl shadow-rose-500/30',
  ON_HOLD: 'bg-gradient-to-br from-slate-500 via-gray-500 to-slate-600 text-white shadow-xl shadow-slate-500/30'
}

const ICONS = {
  APPLIED: '📝',
  INTERVIEWING: '🗣️',
  OFFER: '💰',
  ACCEPTED: '🎉',
  REJECTED: '❌',
  ON_HOLD: '⏸️'
}

const ANIMATIONS = {
  APPLIED: 'animate-pulse',
  INTERVIEWING: 'animate-bounce',
  OFFER: 'animate-pulse',
  ACCEPTED: 'animate-bounce',
  REJECTED: 'animate-pulse',
  ON_HOLD: 'animate-pulse'
}

export default function KanbanBoard({ apps, onMove }) {
  const cols = ['APPLIED','INTERVIEWING','OFFER','ACCEPTED','REJECTED','ON_HOLD']
  const grouped = Object.fromEntries(cols.map(c=>[c, []]))
  apps.forEach(a => grouped[a.status]?.push(a))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cols.map((col, index) => (
        <div 
          key={col} 
          className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-4 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-1 transition-all duration-300"
          style={{
            animationDelay: `${index * 0.1}s`
          }}
        >
          {/* Enhanced Column Header */}
          <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-bold relative overflow-hidden ${COLORS[col]} transform hover:scale-105 transition-all duration-300 group-hover:animate-pulse`}>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-lg animate-bounce" style={{animationDuration: '2s'}}>
                  {ICONS[col]}
                </span>
                <span className="tracking-wide">{LABELS[col]}</span>
              </div>
              <span className="bg-white/20 rounded-full px-2 py-1 text-xs font-bold backdrop-blur-sm">
                {grouped[col].length}
              </span>
            </div>
            
            {/* Rotating Background Gradient */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>
          </div>

          {/* Enhanced Cards Container */}
          <div className="space-y-3 min-h-[200px]">
            {grouped[col].map((app, appIndex) => (
              <div 
                key={app.id}
                className="animate-fadeInUp"
                style={{
                  animationDelay: `${(index * 0.1) + (appIndex * 0.05)}s`
                }}
              >
                <ApplicationCard app={app} onMove={onMove} />
              </div>
            ))}
            
            {/* Enhanced Empty State */}
            {grouped[col].length === 0 && (
              <div className="text-center py-12 text-gray-400 animate-fadeIn">
                <div className="relative">
                  {/* Floating Icon */}
                  <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center">
                    <span className="text-4xl opacity-30 animate-bounce" style={{animationDuration: '3s'}}>
                      {ICONS[col]}
                    </span>
                  </div>
                  
                  {/* Pulsing Dots */}
                  <div className="flex justify-center space-x-1 mb-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  
                  <p className="text-sm font-medium">No applications yet</p>
                  <p className="text-xs mt-1 opacity-60">Drag cards here</p>
                </div>
              </div>
            )}
          </div>

          {/* Column Bottom Accent */}
          <div className={`mt-4 h-1 rounded-full ${COLORS[col]} opacity-50 transform scale-0 group-hover:scale-100 transition-transform duration-300`}></div>
        </div>
      ))}
    </div>
  )
}
