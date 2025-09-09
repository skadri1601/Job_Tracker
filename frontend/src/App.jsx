import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FollowUp from './pages/FollowUp'
import FollowUpTracking from './pages/FollowUpTracking'
import ProfileEdit from './components/ProfileEdit'
import { getToken, api, clearToken } from './api/client'

export default function App() {
  const [auth, setAuth] = useState(!!getToken())
  const [user, setUser] = useState(null)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('jobTracker-theme')
    return saved === 'dark'
  })
  
  // Verify token validity on app start
  useEffect(() => {
    const verifyAuth = async () => {
      const token = getToken()
      if (token) {
        try {
          // First, get user details from the API to get actual name
          const userResponse = await api('/auth/me')
          setUser({
            email: userResponse.email,
            firstName: userResponse.first_name,
            lastName: userResponse.last_name
          })
        } catch (error) {
          console.error('Error fetching user details:', error)
          try {
            // Fallback: Test API call to verify token and extract basic info
            await api('/applications/')
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser({ 
              email: payload.sub,
              firstName: 'User', // Placeholder
              lastName: 'Name'   // Placeholder
            })
          } catch (tokenError) {
            // Token is invalid, clear auth state
            clearToken()
            setAuth(false)
            setUser(null)
          }
        }
      }
    }
    verifyAuth()
  }, [])

  // Theme toggle effect
  useEffect(() => {
    localStorage.setItem('jobTracker-theme', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  const handleLogin = async () => {
    setAuth(true)
    // Set user info from API after login
    const token = getToken()
    if (token) {
      try {
        // Get actual user details from the API
        const userResponse = await api('/auth/me')
        setUser({
          email: userResponse.email,
          firstName: userResponse.first_name,
          lastName: userResponse.last_name
        })
      } catch (error) {
        console.error('Error fetching user details:', error)
        // Fallback: Extract basic info from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          setUser({ 
            email: payload.sub,
            firstName: 'User', // Placeholder
            lastName: 'Name'   // Placeholder
          })
        } catch (tokenError) {
          console.error('Error decoding token:', tokenError)
        }
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
    try {
      // Prepare the update payload
      const updatePayload = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      }
      
      // Add password fields if provided
      if (profileData.newPassword) {
        updatePayload.current_password = profileData.currentPassword
        updatePayload.new_password = profileData.newPassword
      }
      
      // Call the backend API to update profile
      const updatedUser = await api('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(updatePayload)
      })
      
      // Update the frontend state with the response from backend
      setUser({
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name
      })
      
      console.log('Profile updated successfully:', updatedUser)
    } catch (error) {
      console.error('Profile update failed:', error)
      // Re-throw the error so the ProfileEdit component can handle it
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 relative overflow-hidden transition-all duration-500 flex flex-col">
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
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/50 shadow-sm z-[10000] transition-all duration-300">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Job Tracker
                </h1>
              </div>
              
              {/* Navigation - Only show when authenticated */}
              {auth && (
                <nav className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === 'dashboard'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage('followup')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === 'followup'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    Follow-up
                  </button>
                  <button
                    onClick={() => setCurrentPage('tracking')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === 'tracking'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    Tracking
                  </button>
                </nav>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Enhanced Theme Toggle Widget */}
              <div className="relative group z-50">
                <button
                  onClick={toggleTheme}
                  className="relative px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-yellow-500/20 transform hover:scale-105 transition-all duration-300 group shadow-md"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon Container */}
                    <div className="relative w-6 h-6 overflow-hidden">
                      {/* Sun Icon */}
                      <div className={`absolute inset-0 transform transition-all duration-500 ${
                        isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                      }`}>
                        <svg className="w-6 h-6 text-yellow-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                      </div>
                      {/* Moon Icon */}
                      <div className={`absolute inset-0 transform transition-all duration-500 ${
                        isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                      }`}>
                        <svg className="w-6 h-6 text-blue-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Text Label */}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
                      {isDark ? 'Light' : 'Dark'}
                    </span>
                  </div>
                  
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Switch to {isDark ? 'light' : 'dark'} mode
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                  </div>
                </button>
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
      </div>
      </header>

      <main className="mx-auto px-4 py-8 flex-grow">
        {!auth ? (
          <Login onLoggedIn={handleLogin} />
        ) : (
          <>
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'followup' && <FollowUp />}
            {currentPage === 'tracking' && <FollowUpTracking />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/50 mt-auto">
        <div className="mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
              </svg>
              <span className="text-sm">
                Made with love by <span className="font-semibold text-blue-600 dark:text-blue-400">Saad</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-500">
              <span>© {new Date().getFullYear()} Job Tracker. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <span>Privacy</span>
                <span>Terms</span>
                <span>Support</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              Built with React, FastAPI, and modern web technologies to help you track your job applications efficiently.
            </p>
          </div>
        </div>
      </footer>

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
