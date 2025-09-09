/**
 * LOADING SPINNER COMPONENT
 * ========================
 * Reusable loading indicator for async operations
 * Provides consistent loading UX across the application
 */

import React from 'react'

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullPage = false,
  color = 'blue'
}) => {
  // Size configurations
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  // Color configurations
  const colors = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600'
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Spinner */}
      <div className={`${sizes[size]} ${colors[color]} border-4 border-t-transparent rounded-full animate-spin`}></div>
      
      {/* Loading Text */}
      {text && (
        <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )

  // Full page loading overlay
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mx-4">
          {spinner}
        </div>
      </div>
    )
  }

  // Inline loading spinner
  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  )
}

export default LoadingSpinner