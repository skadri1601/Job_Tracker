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
    <div className="mx-auto max-w-md">
      <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl shadow-blue-500/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input 
              type="email"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
              placeholder="Enter your email"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
              placeholder="Enter your password"
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required
            />
          </div>
          <button 
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25" 
            type="submit"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200" 
            onClick={()=>setMode(mode==='login'?'register':'login')}
          >
            {mode==='login' ? 'Need an account? Register here' : 'Already have an account? Sign in'}
          </button>
        </div>
        
        {err && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{err}</p>
          </div>
        )}
      </div>
    </div>
  )
}
