import React, { useState } from 'react'
import { api } from '../api/client'

export default function EmailIngest({ onAdded }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr(null)
    try {
      await api('/emails/ingest', { method:'POST', body: JSON.stringify(text) })
      setText('')
      onAdded?.()
    } catch (e) { setErr(e.message) } 
    finally { setBusy(false) }
  }

  return (
    <div className="bg-white border rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-3">Ingest from Email</h3>
      <form onSubmit={submit} className="space-y-2">
        <textarea rows={6} className="w-full rounded-lg border px-3 py-2"
                  placeholder="Paste a job-related email here…" value={text} onChange={e=>setText(e.target.value)} />
        <div className="flex items-center gap-3">
          <button disabled={busy || !text.trim()} className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50">
            {busy ? 'Creating…' : 'Create Application'}
          </button>
          {err && <span className="text-sm text-red-600">{String(err)}</span>}
        </div>
      </form>
    </div>
  )
}
