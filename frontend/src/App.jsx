import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { getToken, api } from './api/client'

export default function App() {
  const [auth, setAuth] = useState(!!getToken())
  
  // Verify token validity on app start
  useEffect(() => {
    const verifyAuth = async () => {
      const token = getToken()
      if (token) {
        try {
          await api('/applications/') // Test API call to verify token
        } catch (error) {
          // Token is invalid, clear auth state
          setAuth(false)
        }
      }
    }
    verifyAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Job Tracker
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!auth ? <Login onLoggedIn={() => setAuth(true)} /> : <Dashboard />}
      </main>
    </div>
  )
}
