import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProfileEdit from './components/ProfileEdit'
import { getToken, api, clearToken } from './api/client'

export default function App() {
  const [auth, setAuth] = useState(!!getToken())
  const [user, setUser] = useState(null)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  
  // Verify token validity on app start
  useEffect(() => {
    const verifyAuth = async () => {
      const token = getToken()
      if (token) {
        try {
          const apps = await api('/applications/') // Test API call to verify token
          // Extract user info from token payload (JWT decode)  
          const payload = JSON.parse(atob(token.split('.')[1]))
          // For now, we'll get user details from the API since token only has email
          // In a real app, you might include more user info in the JWT payload
          setUser({ 
            email: payload.sub,
            firstName: 'User', // Placeholder until we can get from API
            lastName: 'Name'   // Placeholder until we can get from API
          })
        } catch (error) {
          // Token is invalid, clear auth state
          setAuth(false)
          setUser(null)
        }
      }
    }
    verifyAuth()
  }, [])

  const handleLogin = async () => {
    setAuth(true)
    // Set user info from token after login
    const token = getToken()
    if (token) {
      try {
        // Extract user info from token payload (JWT decode)
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ 
          email: payload.sub,
          firstName: 'User', // Placeholder until we can get from API
          lastName: 'Name'   // Placeholder until we can get from API
        })
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }

  const handleLogout = () => {
    clearToken()
    setAuth(false)
    setUser(null)
    setShowProfileEdit(false)
  }

  const handleProfileSave = async (profileData) => {
    // For now, just simulate success since we don't have user update endpoint
    // In a real app, you would call an API endpoint to update user profile
    setUser({ 
      ...user, 
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email 
    })
    // TODO: Implement actual profile update API call
    console.log('Profile update:', profileData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl animate-float-slow"></div>
        
        {/* 3D Cube Elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 opacity-10">
          <div className="cube">
            <div className="cube-face cube-front bg-gradient-to-br from-blue-500 to-indigo-600"></div>
            <div className="cube-face cube-back bg-gradient-to-br from-indigo-500 to-purple-600"></div>
            <div className="cube-face cube-right bg-gradient-to-br from-purple-500 to-pink-600"></div>
            <div className="cube-face cube-left bg-gradient-to-br from-pink-500 to-rose-600"></div>
            <div className="cube-face cube-top bg-gradient-to-br from-rose-500 to-orange-600"></div>
            <div className="cube-face cube-bottom bg-gradient-to-br from-orange-500 to-yellow-600"></div>
          </div>
        </div>
        
        <div className="absolute top-3/4 right-1/4 w-12 h-12 opacity-10">
          <div className="cube cube-small">
            <div className="cube-face cube-front bg-gradient-to-br from-emerald-500 to-teal-600"></div>
            <div className="cube-face cube-back bg-gradient-to-br from-teal-500 to-cyan-600"></div>
            <div className="cube-face cube-right bg-gradient-to-br from-cyan-500 to-blue-600"></div>
            <div className="cube-face cube-left bg-gradient-to-br from-blue-500 to-indigo-600"></div>
            <div className="cube-face cube-top bg-gradient-to-br from-indigo-500 to-purple-600"></div>
            <div className="cube-face cube-bottom bg-gradient-to-br from-purple-500 to-pink-600"></div>
          </div>
        </div>
        
        {/* Particle Network */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <defs>
              <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2"/>
              </radialGradient>
            </defs>
            <g className="animate-spin-slow">
              <circle cx="200" cy="200" r="3" fill="url(#nodeGradient)">
                <animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite"/>
              </circle>
              <circle cx="800" cy="300" r="2" fill="url(#nodeGradient)">
                <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="300" cy="700" r="2" fill="url(#nodeGradient)">
                <animate attributeName="r" values="1;3;1" dur="5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="700" cy="800" r="3" fill="url(#nodeGradient)">
                <animate attributeName="r" values="2;4;2" dur="6s" repeatCount="indefinite"/>
              </circle>
              <line x1="200" y1="200" x2="800" y2="300" stroke="url(#nodeGradient)" strokeWidth="1" opacity="0.3">
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4s" repeatCount="indefinite"/>
              </line>
              <line x1="300" y1="700" x2="700" y2="800" stroke="url(#nodeGradient)" strokeWidth="1" opacity="0.3">
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur="5s" repeatCount="indefinite"/>
              </line>
            </g>
          </svg>
        </div>
        
        {/* Gradient Mesh Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 transform rotate-12 scale-110"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-indigo-500/10 via-transparent to-purple-500/10 transform -rotate-12"></div>
        </div>
      </div>
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm z-[10000]">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            
            {/* Profile Section - Only show when authenticated */}
            {auth && user && (
              <div className="relative group z-[9999]">
                <button className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-white/70 via-white/60 to-white/70 border border-white/40 hover:from-white/90 hover:via-white/80 hover:to-white/90 hover:shadow-xl hover:shadow-emerald-500/20 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-emerald-600 font-medium">
                      Online
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:rotate-180 transition-all duration-300 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Enhanced Dropdown Menu */}
                <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl shadow-black/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] overflow-hidden">
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold text-slate-800 text-base leading-tight">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Active now
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-white/50 rounded-lg">
                      <p className="text-xs text-slate-600 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button 
                      onClick={() => setShowProfileEdit(true)}
                      className="w-full text-left px-3 py-3 rounded-xl text-sm text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all duration-200 flex items-center gap-3 font-medium"
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span>Edit Profile</span>
                        <span className="text-xs text-slate-500">Update your information</span>
                      </div>
                    </button>
                    
                    <div className="my-2 h-px bg-slate-200"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-3 rounded-xl text-sm text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-700 transition-all duration-200 flex items-center gap-3 font-medium"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span>Sign Out</span>
                        <span className="text-xs text-slate-500">End your session</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-8">
        {!auth ? <Login onLoggedIn={handleLogin} /> : <Dashboard />}
      </main>

      {/* Profile Edit Modal */}
      {showProfileEdit && user && (
        <ProfileEdit 
          user={user}
          onClose={() => setShowProfileEdit(false)}
          onSave={handleProfileSave}
        />
      )}
    </div>
  )
}
