import React from 'react'

export default function ApplicationCard({ app, onMove }) {
  const statusColors = {
    APPLIED: 'text-blue-600 bg-blue-50 border-blue-200',
    INTERVIEWING: 'text-amber-600 bg-amber-50 border-amber-200',
    OFFER: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    ACCEPTED: 'text-green-600 bg-green-50 border-green-200',
    REJECTED: 'text-rose-600 bg-rose-50 border-rose-200',
    ON_HOLD: 'text-slate-600 bg-slate-50 border-slate-200'
  }

  const statusLabels = {
    APPLIED: 'Applied',
    INTERVIEWING: 'Interviewing',
    OFFER: 'Offer',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    ON_HOLD: 'On Hold'
  }

  return (
    <div className="bg-white/90 border border-white/40 rounded-2xl p-4 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-emerald-500/20 transform hover:scale-105 hover:-rotate-1 transition-all duration-500 group relative overflow-hidden">
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex-1">
          <div className="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors">
            {app.company}
          </div>
          <div className="text-slate-600 font-medium">{app.role}</div>
          {app.location && (
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {app.location}
            </div>
          )}
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusColors[app.status] || statusColors.ON_HOLD}`}>
          {statusLabels[app.status] || 'On Hold'}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 relative z-10">
        {['APPLIED','INTERVIEWING','OFFER','ACCEPTED','REJECTED','ON_HOLD'].map(s=>(
          <button key={s}
            onClick={()=>onMove(app, s)}
            className={`text-xs rounded-lg px-2.5 py-1.5 font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 ${
              app.status === s 
                ? `${statusColors[s]} cursor-default animate-pulse` 
                : 'text-slate-600 bg-slate-100 border border-slate-200 hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300 hover:border-slate-400 hover:text-slate-700 hover:shadow-md'
            }`}
            disabled={app.status === s}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>
    </div>
  )
}
