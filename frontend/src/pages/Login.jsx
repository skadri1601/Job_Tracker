import React, { useState } from 'react'
import { api, setToken } from '../api/client'

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [err, setErr] = useState(null)
  const [passwordErrors, setPasswordErrors] = useState([])
  const title = mode === 'login' ? 'Sign in to your account' : 'Create your account'

  function validatePassword(pwd) {
    const errors = []
    if (pwd.length < 8) errors.push('At least 8 characters long')
    if (!/[A-Z]/.test(pwd)) errors.push('At least one uppercase letter')
    if (!/[a-z]/.test(pwd)) errors.push('At least one lowercase letter')
    if (!/\d/.test(pwd)) errors.push('At least one number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('At least one special character')
    return errors
  }

  function handlePasswordChange(pwd) {
    setPassword(pwd)
    if (mode === 'register') {
      setPasswordErrors(validatePassword(pwd))
    }
  }

  async function submit(e) {
    e.preventDefault()
    setErr(null)
    setPasswordErrors([])
    
    // Frontend validation for registration
    if (mode === 'register') {
      if (!firstName.trim()) {
        setErr('First name is required')
        return
      }
      if (!lastName.trim()) {
        setErr('Last name is required')
        return
      }
      if (firstName.trim().length < 2) {
        setErr('First name must be at least 2 characters')
        return
      }
      if (lastName.trim().length < 2) {
        setErr('Last name must be at least 2 characters')
        return
      }
      
      const pwdErrors = validatePassword(password)
      if (pwdErrors.length > 0) {
        setPasswordErrors(pwdErrors)
        setErr('Please fix the password requirements below')
        return
      }
      
      if (password !== confirmPassword) {
        setErr('Passwords do not match')
        return
      }
    }
    
    try {
      if (mode === 'register') {
        await api('/auth/register', { 
          method: 'POST', 
          body: JSON.stringify({ 
            email: email.trim(), 
            password,
            first_name: firstName.trim(),
            last_name: lastName.trim()
          }) 
        })
      }
      const { access_token } = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: email.trim(), password }) })
      setToken(access_token)
      onLoggedIn()
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className={`mx-auto ${mode === 'register' ? 'max-w-lg' : 'max-w-md'}`}>
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
          {/* Name Fields - Only show during registration */}
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
                  placeholder="e.g., John"
                  value={firstName} 
                  onChange={e=>setFirstName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
                  placeholder="e.g., Doe"
                  value={lastName} 
                  onChange={e=>setLastName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input 
              type="email"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
              placeholder="e.g., john.doe@example.com"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input 
              type="password" 
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
              placeholder={mode === 'register' ? "Create a strong password" : "Enter your password"}
              value={password} 
              onChange={e=>handlePasswordChange(e.target.value)} 
              required
              minLength={mode === 'register' ? 8 : 1}
            />
            
            {/* Password Requirements - Only show during registration */}
            {mode === 'register' && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-800 mb-2">Password Requirements:</p>
                <ul className="text-xs space-y-1">
                  {[
                    { text: 'At least 8 characters long', test: (pwd) => pwd.length >= 8 },
                    { text: 'At least one uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
                    { text: 'At least one lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
                    { text: 'At least one number (0-9)', test: (pwd) => /\d/.test(pwd) },
                    { text: 'At least one special character (!@#$%^&*)', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
                  ].map((req, index) => {
                    const isValid = password && req.test(password);
                    const hasPassword = password.length > 0;
                    
                    return (
                      <li key={index} className={`flex items-center gap-2 ${
                        !hasPassword ? 'text-gray-500' : isValid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {!hasPassword ? '⚪' : isValid ? '✅' : '❌'} {req.text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password - Only show during registration */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                className={`w-full rounded-xl border-2 px-4 py-3 focus:ring-2 transition-all duration-200 placeholder-gray-400 ${
                  confirmPassword && password !== confirmPassword 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="Re-enter your password"
                value={confirmPassword} 
                onChange={e=>setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  ❌ Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && password && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  ✅ Passwords match
                </p>
              )}
            </div>
          )}
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
