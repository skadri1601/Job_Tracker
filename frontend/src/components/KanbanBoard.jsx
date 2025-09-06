import React from 'react'
import ApplicationCard from './ApplicationCard'

const LABELS = {
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  ON_HOLD: 'On Hold'
}
const COLORS = {
  APPLIED: 'bg-blue-50 text-blue-700 border-blue-200',
  INTERVIEWING: 'bg-amber-50 text-amber-700 border-amber-200',
  OFFER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  ON_HOLD: 'bg-slate-50 text-slate-700 border-slate-200'
}

export default function KanbanBoard({ apps, onMove }) {
  const cols = ['APPLIED','INTERVIEWING','OFFER','REJECTED','ON_HOLD']
  const grouped = Object.fromEntries(cols.map(c=>[c, []]))
  apps.forEach(a => grouped[a.status]?.push(a))

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cols.map(col => (
        <div key={col} className="bg-white border rounded-2xl p-3">
          <div className={`mb-3 border rounded-xl px-3 py-2 text-sm font-medium ${COLORS[col]}`}>
            {LABELS[col]} <span className="opacity-60">({grouped[col].length})</span>
          </div>
          <div className="space-y-2">
            {grouped[col].map(app => (
              <ApplicationCard key={app.id} app={app} onMove={onMove} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
