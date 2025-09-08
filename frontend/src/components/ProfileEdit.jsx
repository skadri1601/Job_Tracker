import React, { useState } from 'react'

export default function ProfileEdit({ user, onClose, onSave }) {
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    try {
      await onSave({ 
        firstName,
        lastName,
        email, 
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined 
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Edit Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Lock/Unlock Toggle */}
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isUnlocked ? "M8 11V7a4 4 0 118 0v4m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" : "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"} />
              </svg>
              <span className="text-sm font-medium text-amber-800">
                {isUnlocked ? 'Fields unlocked for editing' : 'Profile information is locked'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsUnlocked(!isUnlocked)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                isUnlocked 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isUnlocked ? '🔒 Lock' : '🔓 Unlock'}
            </button>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
                  isUnlocked 
                    ? 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
                disabled={!isUnlocked}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
                  isUnlocked 
                    ? 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
                disabled={!isUnlocked}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
                isUnlocked 
                  ? 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
              disabled={!isUnlocked}
              required
            />
          </div>

          {/* Change Password Section */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Change Password (Optional)</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 font-medium shadow-lg shadow-emerald-500/25"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}