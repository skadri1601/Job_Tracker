/**
 * STANDARDIZED LAYOUT COMPONENT
 * =============================
 * Provides consistent layout structure and styling across all pages
 * Dark theme with glass morphism and professional design standards
 */

import React from 'react'

export function PageContainer({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 ${className}`}>
      {children}
    </div>
  )
}

export function ContentCard({ children, className = "", title, subtitle, icon }) {
  return (
    <div className={`card-3d p-6 ${className}`}>
      {/* Content */}
      <div className="relative z-10">
        {(title || icon) && (
          <div className="flex items-center gap-3 mb-6">
            {icon && (
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                {icon}
              </div>
            )}
            {title && (
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{title}</h2>
                {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export function FormField({ label, children, required = false, error }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-700 bg-red-100/80 rounded-lg px-3 py-2 border border-red-300/50 backdrop-blur-sm">
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({ className = "", ...props }) {
  return (
    <input 
      className={`w-full rounded-xl border-2 border-white/30 bg-white/90 text-gray-800 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 placeholder-gray-500 shadow-sm ${className}`}
      {...props}
    />
  )
}

export function Select({ className = "", children, ...props }) {
  return (
    <select 
      className={`w-full rounded-xl border-2 border-white/30 bg-white/90 text-gray-800 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  className = "", 
  ...props 
}) {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 interactive"
  
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/25",
    ghost: "text-gray-600 hover:text-gray-800 hover:bg-white/30"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  }
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed transform-none hover:scale-100" : ""
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export function StatusBadge({ status, children }) {
  const statusColors = {
    APPLIED: "bg-blue-100 text-blue-800",
    INTERVIEWING: "bg-yellow-100 text-yellow-800",
    OFFER: "bg-green-100 text-green-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
    ON_HOLD: "bg-gray-100 text-gray-800"
  }
  
  return (
    <span className={`status-badge ${statusColors[status] || statusColors.APPLIED}`}>
      {children || status}
    </span>
  )
}

export function LoadingSpinner({ size = "md" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }
  
  return (
    <div className={`${sizes[size]} border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin`}></div>
  )
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="card-3d p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-2 hover:bg-white/50 rounded-lg transition-colors interactive"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}