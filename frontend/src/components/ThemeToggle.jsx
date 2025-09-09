import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-yellow-500/20 dark:to-orange-500/20 backdrop-blur-sm border border-white/30 dark:border-yellow-300/30 hover:scale-110 transform transition-all duration-300 group"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
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

      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-md ${
        isDark 
          ? 'bg-gradient-to-r from-yellow-400/30 to-orange-400/30' 
          : 'bg-gradient-to-r from-blue-400/30 to-purple-400/30'
      }`}></div>

      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-xl bg-white/10 dark:bg-yellow-300/10 opacity-0 group-active:opacity-100 group-active:animate-ping"></div>
    </button>
  )
}