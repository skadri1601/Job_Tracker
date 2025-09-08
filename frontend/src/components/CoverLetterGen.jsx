import React, { useState } from 'react'

export default function CoverLetterGen() {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [busy, setBusy] = useState(false)

  async function generateLetter() {
    const trimmedCompany = company.trim()
    const trimmedRole = role.trim()
    
    if (!trimmedCompany) {
      alert('Please enter a company name')
      return
    }
    
    if (!trimmedRole) {
      alert('Please enter a job role')
      return
    }
    
    if (trimmedCompany.length < 2) {
      alert('Company name must be at least 2 characters long')
      return
    }
    
    if (trimmedRole.length < 2) {
      alert('Job role must be at least 2 characters long')
      return
    }
    
    setBusy(true)
    setCoverLetter('')
    
    // Simulate API call - replace with actual cover letter generation
    setTimeout(() => {
      setCoverLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With my background in software development and passion for creating innovative solutions, I believe I would be a valuable addition to your team.

My experience includes:
• Full-stack web development with modern frameworks
• Problem-solving and analytical thinking
• Collaborative work in agile environments
• Continuous learning and adaptation to new technologies

I am excited about the opportunity to contribute to ${company}'s mission and would welcome the chance to discuss how my skills align with your team's needs.

Thank you for your consideration.

Best regards,
[Your Name]`)
      setBusy(false)
    }, 2000)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(coverLetter)
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-xl shadow-indigo-500/10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Cover Letter Generator
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 placeholder-gray-400"
            placeholder="Company Name"
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
          <input
            className="rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 placeholder-gray-400"
            placeholder="Job Role"
            value={role}
            onChange={e => setRole(e.target.value)}
          />
        </div>
        
        <button
          onClick={generateLetter}
          disabled={busy || !company.trim() || !role.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg shadow-indigo-500/25"
        >
          {busy ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Generating Cover Letter…
            </div>
          ) : 'Generate Cover Letter'}
        </button>
        
        {coverLetter && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-700">Generated Cover Letter</h4>
              <button
                onClick={copyToClipboard}
                className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
            <textarea
              className="w-full h-64 rounded-xl border-2 border-gray-200 px-4 py-3 resize-none bg-gray-50 text-sm"
              value={coverLetter}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  )
}