import React from 'react'

export default function ApplicationCard({ app, onMove }) {
  return (
    <div className="bg-white border rounded-xl p-3 shadow-sm">
      <div className="font-medium">{app.company}</div>
      <div className="text-sm text-gray-600">{app.role}</div>
      {app.location && <div className="text-xs text-gray-500 mt-1">{app.location}</div>}
      <div className="mt-3 flex flex-wrap gap-2">
        {['APPLIED','INTERVIEWING','OFFER','REJECTED','ON_HOLD'].map(s=>(
          <button key={s}
            onClick={()=>onMove(app, s)}
            className="text-xs rounded-lg border px-2 py-1 hover:bg-gray-50">
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
