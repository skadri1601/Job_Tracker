import React, { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { getToken } from './api/client'

export default function App() {
  const [auth, setAuth] = useState(!!getToken())

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <h1 className="text-xl font-semibold">Job Tracker</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {!auth ? <Login onLoggedIn={() => setAuth(true)} /> : <Dashboard />}
      </main>
    </div>
  )
}
