import React, { useState } from 'react'
import { api } from '../api/client'

export default function EmailIngest({ onAdded }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setErr(null)
    
    const trimmedText = text.trim()
    
    if (!trimmedText) {
      setErr('Please enter email content')
      return
    }
    
    if (trimmedText.length < 10) {
      setErr('Email content is too short (minimum 10 characters)')
      return
    }
    
    if (trimmedText.length > 10000) {
      setErr('Email content is too long (maximum 10,000 characters)')
      return
    }
    
    setBusy(true)
    
    try {
      await api('/emails/ingest', {
        method: 'POST',
        body: JSON.stringify({ email_text: trimmedText })
      })
      setText('')
      onAdded?.()
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-xl shadow-purple-500/10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Email Ingest
        </h3>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <textarea
          rows={6}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 placeholder-gray-400 resize-none"
          placeholder="Paste a job-related email here to automatically create an application…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button
            disabled={busy || !text.trim()}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg shadow-purple-500/25"
          >
            {busy ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating…
              </div>
            ) : 'Create Application'}
          </button>
          {err && <span className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{String(err)}</span>}
        </div>
      </form>
    </div>
  )
}