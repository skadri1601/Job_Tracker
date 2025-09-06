import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import KanbanBoard from '../components/KanbanBoard'
import CoverLetterGen from '../components/CoverLetterGen'
import EmailIngest from '../components/EmailIngest'

export default function Dashboard() {
  const [apps, setApps] = useState([])
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [err, setErr] = useState(null)

  async function load() {
    try { setApps(await api('/applications/')) } catch (e) { setErr(e.message) }
  }
  useEffect(()=>{ load() }, [])

  async function addApp(e) {
    e.preventDefault()
    await api('/applications/', { method:'POST', body: JSON.stringify({ company, role, location }) })
    setCompany(''); setRole(''); setLocation(''); load()
  }
  async function onMove(app, status) {
    await api(`/applications/${app.id}`, { method:'PATCH', body: JSON.stringify({ status }) })
    load()
  }

  return (
    <>
      <div className="bg-white border rounded-2xl p-4 mb-5">
        <h2 className="text-xl font-semibold mb-3">Job Applications</h2>
        <form onSubmit={addApp} className="grid md:grid-cols-4 gap-3">
          <input className="rounded-lg border px-3 py-2" placeholder="Company" value={company} onChange={e=>setCompany(e.target.value)} />
          <input className="rounded-lg border px-3 py-2" placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} />
          <input className="rounded-lg border px-3 py-2" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
          <button className="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90" type="submit">Add</button>
        </form>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </div>

      <KanbanBoard apps={apps} onMove={onMove} />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <EmailIngest onAdded={load} />
        <CoverLetterGen />
      </div>
    </>
  )
}
