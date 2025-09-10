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
import { ContentCard, FormField, Input, Select, Button } from '../components/ui/Layout'

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

      <ContentCard className="mb-8" title="Add New Application" subtitle="Track your job applications with ease" icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }>
        <div className="space-y-6">
          {/* Company Field */}
          <FormField label="Company Name" required>
            <Input 
              placeholder="Enter company name" 
              value={company} 
              onChange={e=>setCompany(e.target.value)}
              required
              minLength={2}
              maxLength={255}
              title="Company name is required (2-255 characters)"
            />
          </FormField>

          {/* Role and Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Field */}
            <FormField label="Job Role" required>
              <Select
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
              </Select>
              {isCustomRole && (
                <Input 
                  placeholder="Enter custom role" 
                  value={customRole}
                  onChange={e=>setCustomRole(e.target.value)}
                  required
                  minLength={2}
                  maxLength={255}
                  title="Custom role is required (2-255 characters)"
                  className="mt-3"
                />
              )}
            </FormField>

            {/* Location Field */}
            <FormField label="Location" required>
              <Select
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
              </Select>
              {isCustomLocation && (
                <Input 
                  placeholder="Enter custom location" 
                  value={customLocation}
                  onChange={e=>setCustomLocation(e.target.value)}
                  required
                  minLength={2}
                  maxLength={255}
                  title="Custom location is required (2-255 characters)"
                  className="mt-3"
                />
              )}
            </FormField>
          </div>


          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={addApp}
              disabled={!company.trim() || (!role.trim() && !customRole.trim()) || (!location.trim() && !customLocation.trim())}
              title={!company.trim() || (!role.trim() && !customRole.trim()) || (!location.trim() && !customLocation.trim()) ? "Please fill in all required fields" : "Add new job application"}
            >
              Add Application
            </Button>
          </div>
        </div>
        {err && <p className="mt-3 text-sm text-red-700 bg-red-100/80 rounded-lg px-3 py-2 border border-red-300/50 backdrop-blur-sm">{err}</p>}
      </ContentCard>

      {/* Kanban Board */}
      <ContentCard className="mb-8">
        <KanbanBoard apps={apps} onMove={onMove} onEdit={onEdit} onDelete={onDelete} />
      </ContentCard>

      {/* Bottom Section */}
      <ContentCard>
        <div className="grid md:grid-cols-2 gap-6">
          <EmailIngest onAdded={load} />
          <CoverLetterGen />
        </div>
      </ContentCard>

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
