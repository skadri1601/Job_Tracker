import React, { useState } from 'react'
import { api, setToken } from '../api/client'

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password')
  const [mode, setMode] = useState('login')
  const [err, setErr] = useState(null)
  const title = mode === 'login' ? 'Sign in to your account' : 'Create your account'

  async function submit(e) {
    e.preventDefault()
    setErr(null)
    try {
      if (mode === 'register') {
        await api('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) })
      }
      const { access_token } = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      setToken(access_token)
      onLoggedIn()
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="mx-auto max-w-md bg-white border rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <input type="password" className="mt-1 w-full rounded-lg border px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="w-full rounded-lg bg-black text-white py-2 hover:opacity-90" type="submit">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-sm">
        <button className="text-blue-600 hover:underline" onClick={()=>setMode(mode==='login'?'register':'login')}>
          {mode==='login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
    </div>
  )
}
