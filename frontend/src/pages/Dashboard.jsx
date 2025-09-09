/**
 * DASHBOARD PAGE COMPONENT
 * =======================
 * Main dashboard for job application management
 * Features: Add applications, Kanban board, email ingest, cover letter generation
 */

import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import KanbanBoard from '../components/KanbanBoard'
import CoverLetterGen from '../components/CoverLetterGen'
import EmailIngest from '../components/EmailIngest'
import ApplicationEditModal from '../components/ApplicationEditModal'
import ReminderNotifications from '../components/ReminderNotifications'

// ======================
// PREDEFINED OPTIONS
// ======================

// Comprehensive list of tech roles for dropdown selection
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

// Common job locations including remote and major US cities
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
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  // Job applications data from backend
  const [apps, setApps] = useState([])
  
  // Form fields for adding new applications
  const [company, setCompany] = useState('')           // Company name input
  const [role, setRole] = useState('')                 // Selected predefined role
  const [customRole, setCustomRole] = useState('')     // Custom role input
  const [isCustomRole, setIsCustomRole] = useState(false) // Toggle for custom role
  const [location, setLocation] = useState('')         // Selected predefined location
  const [customLocation, setCustomLocation] = useState('') // Custom location input
  const [isCustomLocation, setIsCustomLocation] = useState(false) // Toggle for custom location
  
  // Error handling and modal state
  const [err, setErr] = useState(null)                 // Form submission errors
  const [editingApp, setEditingApp] = useState(null)   // Application being edited
  const [showEditModal, setShowEditModal] = useState(false) // Edit modal visibility

  // ======================
  // DATA LOADING
  // ======================
  
  // Load all job applications from backend
  async function load() {
    try { setApps(await api('/applications/')) } catch (e) { setErr(e.message) }
  }
  
  // Load applications on component mount
  useEffect(()=>{ load() }, [])

  // ======================
  // APPLICATION MANAGEMENT
  // ======================
  
  // Add new job application with form validation
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

  function onEdit(app) {
    setEditingApp(app)
    setShowEditModal(true)
  }

  async function onDelete(app) {
    const confirmed = window.confirm(`Are you sure you want to delete the application for ${app.role} at ${app.company}?`)
    if (confirmed) {
      try {
        await api(`/applications/${app.id}`, { method: 'DELETE' })
        load()
      } catch (error) {
        alert(`Error deleting application: ${error.message}`)
      }
    }
  }

  async function handleEditSave(updatedData) {
    try {
      await api(`/applications/${editingApp.id}`, { 
        method: 'PATCH', 
        body: JSON.stringify(updatedData) 
      })
      load()
    } catch (error) {
      throw error
    }
  }

  function handleEditClose() {
    setShowEditModal(false)
    setEditingApp(null)
  }

  return (
    <>
      {/* Smart Reminders */}
      <ReminderNotifications apps={apps} />

      <div className="relative bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 mb-8 shadow-2xl shadow-blue-500/20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top-left gradient orb */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-2xl animate-pulse"></div>
          {/* Top-right gradient orb */}
          <div className="absolute -top-4 -right-12 w-40 h-40 bg-gradient-to-bl from-emerald-400/15 to-teal-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          {/* Bottom accent */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent rounded-full blur-xl"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Floating accent dots */}
          <div className="absolute top-4 right-8 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
          <div className="absolute top-12 right-20 w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-8 left-12 w-1 h-1 bg-purple-400/50 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        </div>
        
        {/* Content with higher z-index */}
        <div className="relative z-10">
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
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900"
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
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900"
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
      </div>

      {/* Kanban Board with Enhanced Background */}
      <div className="relative bg-white/50 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-8 shadow-xl shadow-emerald-500/10 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle wave pattern */}
          <div className="absolute inset-0 opacity-[0.05]">
            <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
            </svg>
          </div>
          
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-bl-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <KanbanBoard apps={apps} onMove={onMove} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {/* Bottom Section with Enhanced Background */}
      <div className="relative bg-gradient-to-br from-white/60 via-blue-50/40 to-indigo-50/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 shadow-xl shadow-purple-500/10 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Geometric shapes */}
          <div className="absolute top-4 left-8 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-6 right-12 w-20 h-20 bg-gradient-to-tl from-indigo-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-6">
          <EmailIngest onAdded={load} />
          <CoverLetterGen />
        </div>
      </div>

      {/* Edit Modal */}
      <ApplicationEditModal
        app={editingApp}
        isOpen={showEditModal}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </>
  )
}
