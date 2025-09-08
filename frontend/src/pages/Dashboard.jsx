import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import KanbanBoard from '../components/KanbanBoard'
import CoverLetterGen from '../components/CoverLetterGen'
import EmailIngest from '../components/EmailIngest'

const TECH_ROLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Software Engineer',
  'Principal Software Engineer',
  'Software Engineering Manager',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'iOS Developer',
  'Android Developer',
  'React Developer',
  'Angular Developer',
  'Vue.js Developer',
  'Node.js Developer',
  'Python Developer',
  'Java Developer',
  'C# Developer',
  'Go Developer',
  'Rust Developer',
  'JavaScript Developer',
  'TypeScript Developer',
  'PHP Developer',
  'Ruby Developer',
  'Swift Developer',
  'Kotlin Developer',
  'Flutter Developer',
  'React Native Developer',
  'Web Developer',
  'UI Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer (SRE)',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Cloud Engineer',
  'AWS Engineer',
  'Azure Engineer',
  'GCP Engineer',
  'Kubernetes Engineer',
  'Docker Engineer',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'Deep Learning Engineer',
  'MLOps Engineer',
  'Research Scientist',
  'Applied Scientist',
  'Computer Vision Engineer',
  'NLP Engineer',
  'Robotics Engineer',
  'Embedded Software Engineer',
  'Firmware Engineer',
  'Systems Engineer',
  'Network Engineer',
  'Security Engineer',
  'Cybersecurity Engineer',
  'Information Security Engineer',
  'Penetration Tester',
  'Security Analyst',
  'Database Engineer',
  'Database Administrator',
  'Database Developer',
  'Quality Assurance Engineer',
  'Test Engineer',
  'Automation Engineer',
  'SDET (Software Development Engineer in Test)',
  'Performance Engineer',
  'Game Developer',
  'Unity Developer',
  'Unreal Engine Developer',
  'Graphics Programmer',
  'Gameplay Programmer',
  'Technical Artist',
  'Blockchain Developer',
  'Smart Contract Developer',
  'Web3 Developer',
  'DeFi Developer',
  'Solutions Architect',
  'Software Architect',
  'System Architect',
  'Cloud Architect',
  'Enterprise Architect',
  'Technical Lead',
  'Lead Software Engineer',
  'Engineering Manager',
  'Senior Engineering Manager',
  'Director of Engineering',
  'VP of Engineering',
  'CTO',
  'Technical Program Manager',
  'Product Manager (Technical)',
  'Scrum Master',
  'Agile Coach',
  'Release Engineer',
  'Build Engineer',
  'Tools Engineer',
  'Developer Advocate',
  'Technical Writer',
  'Developer Relations Engineer',
  'Sales Engineer',
  'Solutions Engineer',
  'Support Engineer',
  'Field Engineer',
  'Consultant - Software Development',
  'Technical Consultant',
  'Software Development Intern',
  'SDE Intern',
  'Research Intern',
  'Graduate Software Engineer',
  'Junior Software Engineer',
  'Associate Software Engineer',
  'Software Engineer I',
  'Software Engineer II',
  'Software Engineer III',
  'Senior Software Engineer I',
  'Senior Software Engineer II'
]

const COMMON_LOCATIONS = [
  'Remote (USA)',
  'New York, NY',
  'San Francisco, CA',
  'Los Angeles, CA',
  'Chicago, IL',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Denver, CO',
  'Atlanta, GA',
  'Miami, FL',
  'Dallas, TX',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Diego, CA',
  'San Jose, CA',
  'Jacksonville, FL',
  'Columbus, OH',
  'Charlotte, NC',
  'Indianapolis, IN',
  'Fort Worth, TX',
  'San Antonio, TX',
  'Detroit, MI',
  'Nashville, TN',
  'Portland, OR',
  'Las Vegas, NV',
  'Louisville, KY',
  'Baltimore, MD',
  'Milwaukee, WI',
  'Albuquerque, NM',
  'Tucson, AZ',
  'Fresno, CA',
  'Sacramento, CA',
  'Kansas City, MO',
  'Mesa, AZ',
  'Virginia Beach, VA',
  'Omaha, NE',
  'Colorado Springs, CO',
  'Raleigh, NC',
  'Long Beach, CA',
  'Virginia Beach, VA',
  'Tampa, FL',
  'New Orleans, LA',
  'Minneapolis, MN',
  'Bakersfield, CA',
  'Wichita, KS',
  'Arlington, TX',
  'Hybrid - Remote/Office (USA)',
  'On-site (USA)'
]

export default function Dashboard() {
  const [apps, setApps] = useState([])
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [isCustomRole, setIsCustomRole] = useState(false)
  const [location, setLocation] = useState('')
  const [customLocation, setCustomLocation] = useState('')
  const [isCustomLocation, setIsCustomLocation] = useState(false)
  const [err, setErr] = useState(null)

  async function load() {
    try { setApps(await api('/applications/')) } catch (e) { setErr(e.message) }
  }
  useEffect(()=>{ load() }, [])

  async function addApp(e) {
    e.preventDefault()
    setErr(null)
    
    // Frontend validation
    const trimmedCompany = company.trim()
    const finalRole = isCustomRole ? customRole.trim() : role.trim()
    const finalLocation = isCustomLocation ? customLocation.trim() : location.trim()
    
    if (!trimmedCompany) {
      setErr('Company name is required')
      return
    }
    
    if (!finalRole) {
      setErr('Role is required')
      return
    }
    
    if (!finalLocation) {
      setErr('Location is required')
      return
    }
    
    if (trimmedCompany.length < 2) {
      setErr('Company name must be at least 2 characters long')
      return
    }
    
    if (finalRole.length < 2) {
      setErr('Role must be at least 2 characters long')
      return
    }
    
    if (finalLocation.length < 2) {
      setErr('Location must be at least 2 characters long')
      return
    }
    
    try {
      await api('/applications/', { 
        method:'POST', 
        body: JSON.stringify({ 
          company: trimmedCompany, 
          role: finalRole, 
          location: finalLocation 
        }) 
      })
      setCompany(''); setRole(''); setCustomRole(''); setIsCustomRole(false); setLocation(''); setCustomLocation(''); setIsCustomLocation(false); load()
    } catch (e) {
      setErr(e.message)
    }
  }
  async function onMove(app, status) {
    await api(`/applications/${app.id}`, { method:'PATCH', body: JSON.stringify({ status }) })
    load()
  }

  return (
    <>
      <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-8 shadow-xl shadow-blue-500/10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Add New Application
          </h2>
        </div>
        <div className="space-y-6">
          {/* Company Field */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
              <input 
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
                placeholder="Enter company name *" 
                value={company} 
                onChange={e=>setCompany(e.target.value)}
                required
                minLength={2}
                maxLength={255}
                title="Company name is required (2-255 characters)"
              />
            </div>
          </div>

          {/* Role and Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Field */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Job Role</label>
              <select 
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                value={isCustomRole ? 'custom' : role}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomRole(true)
                    setRole('')
                  } else {
                    setIsCustomRole(false)
                    setRole(e.target.value)
                    setCustomRole('')
                  }
                }}
                required
                title="Select a tech role or choose custom"
              >
                <option value="">Select Role *</option>
                {TECH_ROLES.map(techRole => (
                  <option key={techRole} value={techRole}>{techRole}</option>
                ))}
                <option value="custom">🖊️ Custom Role</option>
              </select>
              {isCustomRole && (
                <input 
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
                  placeholder="Enter custom role *" 
                  value={customRole}
                  onChange={e=>setCustomRole(e.target.value)}
                  required
                  minLength={2}
                  maxLength={255}
                  title="Custom role is required (2-255 characters)"
                />
              )}
            </div>

            {/* Location Field */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <select 
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                value={isCustomLocation ? 'custom' : location}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomLocation(true)
                    setLocation('')
                  } else {
                    setIsCustomLocation(false)
                    setLocation(e.target.value)
                    setCustomLocation('')
                  }
                }}
                required
                title="Select a location or choose custom"
              >
                <option value="">Select Location *</option>
                {COMMON_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
                <option value="custom">🖊️ Custom Location</option>
              </select>
              {isCustomLocation && (
                <input 
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400" 
                  placeholder="Enter custom location *" 
                  value={customLocation}
                  onChange={e=>setCustomLocation(e.target.value)}
                  required
                  minLength={2}
                  maxLength={255}
                  title="Custom location is required (2-255 characters)"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={addApp}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
              type="button"
              disabled={!company.trim() || (!role.trim() && !customRole.trim()) || (!location.trim() && !customLocation.trim())}
              title={!company.trim() || (!role.trim() && !customRole.trim()) || (!location.trim() && !customLocation.trim()) ? "Please fill in all required fields" : "Add new job application"}
            >
              Add Application
            </button>
          </div>
        </div>
        {err && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
      </div>

      <KanbanBoard apps={apps} onMove={onMove} />

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <EmailIngest onAdded={load} />
        <CoverLetterGen />
      </div>
    </>
  )
}
