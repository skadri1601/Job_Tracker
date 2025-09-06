import React, { useState } from 'react'
import { api } from '../api/client'

export default function CoverLetterGen() {
  const [name, setName] = useState('Saad Kadri')
  const [summary, setSummary] = useState('Python/React developer with ML experience')
  const [jd, setJd] = useState('We need a Python + React engineer for fintech...')
  const [company, setCompany] = useState('FinTech Co')
  const [role, setRole] = useState('Software Engineer')
  const [out, setOut] = useState('')

  async function generate() {
    const res = await api('/ai/cover-letter', {
      method:'POST',
      body:JSON.stringify({ your_name:name, resume_summary:summary, job_description:jd, company, role })
    })
    setOut(res.cover_letter)
  }
  function copy() { navigator.clipboard.writeText(out || '') }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">AI Cover Letter Generator</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Your Name</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Resume Summary</label>
            <textarea rows={3} className="mt-1 w-full rounded-lg border px-3 py-2" value={summary} onChange={e=>setSummary(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Company</label>
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={company} onChange={e=>setCompany(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Role</label>
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={role} onChange={e=>setRole(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Job Description</label>
            <textarea rows={6} className="mt-1 w-full rounded-lg border px-3 py-2" value={jd} onChange={e=>setJd(e.target.value)} />
          </div>
          <button onClick={generate} className="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90">
            Generate
          </button>
        </div>
        <div className="bg-white border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">Output</span>
            <button onClick={copy} className="text-sm rounded-lg border px-3 py-1 hover:bg-gray-50">Copy</button>
          </div>
          <textarea readOnly rows={18} className="w-full rounded-lg border px-3 py-2" value={out} />
        </div>
      </div>
    </div>
  )
}
