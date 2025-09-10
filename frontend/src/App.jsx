/**
 * MAIN APPLICATION COMPONENT
 * =========================
 * Central hub that manages authentication, routing, and global state
 * Controls the entire application flow and user session management
 */

import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FollowUp from './pages/FollowUp'
import FollowUpTracking from './pages/FollowUpTracking'
import IntelligentFeaturesDemo from './pages/IntelligentFeaturesDemo'
import ProfileEdit from './components/ProfileEdit'
import { getToken, api, clearToken } from './api/client'

export default function App() {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  // Authentication state - determines if user is logged in
  const [auth, setAuth] = useState(!!getToken())
  
  // User profile data - stores firstName, lastName, email
  const [user, setUser] = useState(null)
  
  // Controls visibility of profile edit modal
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  
  // Current active page - 'dashboard', 'followup', or 'tracking'
  const [currentPage, setCurrentPage] = useState('dashboard')
  
  // Theme removed for simplified UI

  // ======================
  // SESSION CONFIGURATION
  // ======================
  
  // Maximum session duration (absolute timeout) - 2 hours
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
  
  // Maximum idle time before logout - 30 minutes
  const IDLE_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
  
  // ======================
  // AUTHENTICATION EFFECTS
  // ======================
  
  // Verify token validity and get user data on app initialization
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

  // Theme management removed for simplified UI

  // Monitor session timeout and set up periodic checks
  useEffect(() => {
    if (!auth) return

    // Check session immediately on auth change
    checkSessionTimeout()

    // Set up periodic session checks (every 60 seconds)
    const sessionCheckInterval = setInterval(checkSessionTimeout, 60000)

    return () => clearInterval(sessionCheckInterval)
  }, [auth])

  // Track user activity to reset idle timeout
  useEffect(() => {
    if (!auth) return

    const handleUserActivity = () => {
      updateLastActivity()
    }

    // Listen for various user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true)
      })
    }
  }, [auth])

  // Theme management removed for cleaner UI

  // ======================
  // SESSION MANAGEMENT
  // ======================
  
  // Update timestamp of last user activity
  const updateLastActivity = () => {
    if (auth) {
      localStorage.setItem('jobTracker-lastActivity', Date.now().toString())
    }
  }

  // Check if session should be terminated due to timeout or expiry
  const checkSessionTimeout = () => {
    const token = getToken()
    if (!token || !auth) return

    const lastActivity = localStorage.getItem('jobTracker-lastActivity')
    const loginTime = localStorage.getItem('jobTracker-loginTime')
    const now = Date.now()

    // Check if session has been idle for too long
    if (lastActivity) {
      const timeSinceActivity = now - parseInt(lastActivity)
      if (timeSinceActivity > IDLE_TIMEOUT) {
        console.log('Session expired due to inactivity')
        handleLogout()
        return
      }
    }

    // Check if session has been active for too long (absolute timeout)
    if (loginTime) {
      const timeSinceLogin = now - parseInt(loginTime)
      if (timeSinceLogin > SESSION_TIMEOUT) {
        console.log('Session expired due to maximum session time')
        handleLogout()
        return
      }
    }

    // Check token expiry from JWT payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const tokenExpiry = payload.exp * 1000 // Convert to milliseconds
      if (now >= tokenExpiry) {
        console.log('Session expired due to token expiry')
        handleLogout()
        return
      }
    } catch (error) {
      console.error('Error parsing token:', error)
      handleLogout()
      return
    }
  }

  // ======================
  // AUTHENTICATION HANDLERS
  // ======================
  
  // Handle successful user login - set auth state and session tracking
  const handleLogin = async () => {
    setAuth(true)
    
    // Set session tracking timestamps
    const now = Date.now().toString()
    localStorage.setItem('jobTracker-loginTime', now)
    localStorage.setItem('jobTracker-lastActivity', now)
    
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

  // Handle user logout - clear all session data and reset state
  const handleLogout = () => {
    clearToken()
    setAuth(false)
    setUser(null)
    setShowProfileEdit(false)
    
    // Clear session tracking
    localStorage.removeItem('jobTracker-loginTime')
    localStorage.removeItem('jobTracker-lastActivity')
  }

  // ======================
  // PROFILE MANAGEMENT
  // ======================
  
  // Save updated user profile data to backend
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

  // ======================
  // RENDER COMPONENT
  // ======================
  
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* 3D Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        {/* 3D Geometric Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10 rounded-3xl transform rotate-45 animate-pulse" style={{animationDuration: '4s'}}></div>
        </div>
        <div className="absolute top-60 right-32 w-24 h-24 opacity-15">
          <div className="w-full h-full bg-gradient-to-br from-white/25 to-white/5 rounded-full transform animate-bounce" style={{animationDuration: '6s'}}></div>
        </div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white/35 to-white/10 transform rotate-12 animate-spin" style={{animationDuration: '20s'}}></div>
        </div>
      </div>
      
      {/* Modern Glass Header */}
      <header className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg z-[10000] transition-all duration-300">
        <div className="mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Job Tracker
                </h1>
              </div>
              
              {/* Main Navigation Menu - Dashboard, Follow-up, Tracking */}
              {auth && (
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`nav-link text-xs md:text-sm ${
                      currentPage === 'dashboard' ? 'active' : ''
                    }`}
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">📊</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('followup')}
                    className={`nav-link text-xs md:text-sm ${
                      currentPage === 'followup' ? 'active' : ''
                    }`}
                  >
                    <span className="hidden sm:inline">Follow-up</span>
                    <span className="sm:hidden">📬</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('tracking')}
                    className={`nav-link text-xs md:text-sm ${
                      currentPage === 'tracking' ? 'active' : ''
                    }`}
                  >
                    <span className="hidden sm:inline">Tracking</span>
                    <span className="sm:hidden">📈</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('intelligent')}
                    className={`nav-link text-xs md:text-sm ${
                      currentPage === 'intelligent' ? 'active' : ''
                    }`}
                  >
                    <span className="hidden sm:inline">🚀 AI Features</span>
                    <span className="sm:hidden">🚀</span>
                  </button>
                </nav>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              
              {/* Theme toggle removed for cleaner UI */}
              
              {/* ======================
                  USER PROFILE DROPDOWN
                  ======================
                  User avatar, name, and dropdown menu with profile edit/logout */}
              {auth && user && (
              <div className="relative group z-[9999]">
                <button className="flex items-center gap-2 px-3 py-1 rounded-xl glass-button transition-all duration-300">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-semibold text-gray-800 leading-tight">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600 group-hover:rotate-180 transition-all duration-300 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Enhanced Dropdown Menu */}
                <div className="absolute right-0 top-full mt-3 w-56 card-3d opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] overflow-hidden">
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-br from-white/20 to-white/10 border-b border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-800 text-base leading-tight">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Active now
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <p className="text-xs text-gray-700 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button 
                      onClick={() => setShowProfileEdit(true)}
                      className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-blue-600 transition-all duration-200 flex items-center gap-3 font-medium interactive"
                    >
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span>Edit Profile</span>
                        <span className="text-xs text-gray-500">Update your information</span>
                      </div>
                    </button>
                    
                    <div className="my-2 h-px bg-white/20"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 hover:text-red-600 transition-all duration-200 flex items-center gap-3 font-medium interactive"
                    >
                      <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span>Sign Out</span>
                        <span className="text-xs text-gray-500">End your session</span>
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

      {/* ======================
          MAIN CONTENT AREA
          ======================
          Page routing based on authentication and currentPage state */}
      <main className="mx-auto px-4 py-8 flex-grow">
        {!auth ? (
          <Login onLoggedIn={handleLogin} />
        ) : (
          <>
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'followup' && <FollowUp />}
            {currentPage === 'tracking' && <FollowUpTracking />}
            {currentPage === 'intelligent' && <IntelligentFeaturesDemo />}
          </>
        )}
      </main>

      {/* ======================
          FOOTER SECTION
          ======================
          Copyright info, creator credits, and app description */}
      <footer className="relative z-10 bg-white/10 backdrop-blur-sm border-t border-white/20 mt-auto">
        <div className="mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
              </svg>
              <span className="text-sm">
                Made with love by <span className="font-semibold text-purple-600">Saad</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <span>© {new Date().getFullYear()} Job Tracker. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <span>Privacy</span>
                <span>Terms</span>
                <span>Support</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs text-gray-600 text-center">
              Built with React, FastAPI, and modern web technologies to help you track your job applications efficiently.
            </p>
          </div>
        </div>
      </footer>

      {/* ======================
          PROFILE EDIT MODAL
          ======================
          Modal for editing user profile information */}
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
