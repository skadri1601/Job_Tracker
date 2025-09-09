import React, { useState } from 'react'

const US_LOCATIONS = [
  'Remote', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX',
  'San Jose, CA', 'Austin, TX', 'Jacksonville, FL', 'San Francisco, CA', 'Columbus, OH',
  'Fort Worth, TX', 'Indianapolis, IN', 'Charlotte, NC', 'Seattle, WA', 'Denver, CO',
  'Boston, MA', 'El Paso, TX', 'Detroit, MI', 'Nashville, TN', 'Portland, OR',
  'Memphis, TN', 'Oklahoma City, OK', 'Las Vegas, NV', 'Louisville, KY', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
  'Kansas City, MO', 'Mesa, AZ', 'Atlanta, GA', 'Colorado Springs, CO', 'Raleigh, NC',
  'Omaha, NE', 'Miami, FL', 'Oakland, CA', 'Minneapolis, MN', 'Tulsa, OK',
  'Cleveland, OH', 'Wichita, KS', 'Arlington, TX', 'Tampa, FL', 'New Orleans, LA',
  'Honolulu, HI', 'Anaheim, CA', 'Aurora, CO', 'Santa Ana, CA', 'St. Louis, MO',
  'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY', 'Pittsburgh, PA', 'Anchorage, AK',
  'Stockton, CA', 'Cincinnati, OH', 'St. Paul, MN', 'Toledo, OH', 'Newark, NJ',
  'Greensboro, NC', 'Plano, TX', 'Henderson, NV', 'Lincoln, NE', 'Buffalo, NY',
  'Jersey City, NJ', 'Chula Vista, CA', 'Fort Wayne, IN', 'Orlando, FL', 'St. Petersburg, FL',
  'Chandler, AZ', 'Laredo, TX', 'Norfolk, VA', 'Durham, NC', 'Madison, WI',
  'Lubbock, TX', 'Irvine, CA', 'Winston-Salem, NC', 'Glendale, AZ', 'Garland, TX',
  'Hialeah, FL', 'Reno, NV', 'Chesapeake, VA', 'Gilbert, AZ', 'Baton Rouge, LA',
  'Irving, TX', 'Scottsdale, AZ', 'North Las Vegas, NV', 'Fremont, CA', 'Boise, ID',
  'Richmond, VA', 'San Bernardino, CA', 'Birmingham, AL', 'Spokane, WA', 'Rochester, NY'
]

const TECH_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Web Developer', 'Mobile Developer', 'iOS Developer', 'Android Developer', 'React Developer',
  'Angular Developer', 'Vue.js Developer', 'Node.js Developer', 'Python Developer',
  'Java Developer', 'C# Developer', '.NET Developer', 'PHP Developer', 'Ruby Developer',
  'Go Developer', 'Rust Developer', 'C++ Developer', 'JavaScript Developer', 'TypeScript Developer',
  'Senior Software Engineer', 'Lead Developer', 'Principal Engineer', 'Staff Engineer',
  'Engineering Manager', 'Technical Lead', 'Architect', 'Solution Architect', 'System Architect',
  'Data Engineer', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer', 'ML Engineer',
  'Data Analyst', 'Business Intelligence Developer', 'ETL Developer', 'Big Data Engineer',
  'DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'Infrastructure Engineer',
  'Platform Engineer', 'Automation Engineer', 'Build Engineer', 'Release Engineer',
  'QA Engineer', 'Test Engineer', 'QA Automation Engineer', 'SDET', 'Performance Engineer',
  'Security Engineer', 'Cybersecurity Engineer', 'Information Security Analyst',
  'Penetration Tester', 'Security Architect', 'Compliance Engineer',
  'Database Administrator', 'Database Developer', 'SQL Developer', 'Oracle Developer',
  'MongoDB Developer', 'PostgreSQL Developer', 'MySQL Developer',
  'UI/UX Developer', 'Frontend Engineer', 'UI Engineer', 'UX Engineer',
  'Game Developer', 'Unity Developer', 'Unreal Engine Developer', 'Graphics Developer',
  'Embedded Software Engineer', 'Firmware Engineer', 'Hardware Engineer', 'FPGA Engineer',
  'Blockchain Developer', 'Smart Contract Developer', 'Web3 Developer', 'DeFi Developer',
  'API Developer', 'Microservices Developer', 'Integration Developer', 'Middleware Developer',
  'Technical Writer', 'Developer Advocate', 'Solutions Engineer', 'Sales Engineer',
  'Product Manager', 'Technical Product Manager', 'Program Manager', 'Project Manager',
  'Scrum Master', 'Agile Coach', 'Business Analyst', 'System Administrator',
  'Network Engineer', 'Cloud Architect', 'Enterprise Architect', 'Data Architect',
  'Software Architect', 'Research Scientist', 'Computer Vision Engineer', 'NLP Engineer',
  'Robotics Engineer', 'IoT Engineer', 'AR/VR Developer', 'Blockchain Engineer',
  'Cryptocurrency Developer', 'FinTech Developer', 'EdTech Developer', 'HealthTech Developer'
]

export default function ApplicationEditModal({ app, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    company: app?.company || '',
    role: app?.role || '',
    location: app?.location || '',
    status: app?.status || 'APPLIED',
    source: app?.source || '',
    applied_date: app?.applied_date || '',
    next_action_date: app?.next_action_date || '',
    last_contact_date: app?.last_contact_date || '',
    follow_up_date: app?.follow_up_date || '',
    follow_up_sent: app?.follow_up_sent || 0,
    reminder_enabled: app?.reminder_enabled !== undefined ? Boolean(app?.reminder_enabled) : true,
    notes: app?.notes || ''
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const statusOptions = [
    { value: 'APPLIED', label: 'Applied' },
    { value: 'INTERVIEWING', label: 'Interviewing' },
    { value: 'OFFER', label: 'Offer' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'ON_HOLD', label: 'On Hold' }
  ]

  function validate() {
    const newErrors = {}
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
    } else if (formData.company.trim().length < 2) {
      newErrors.company = 'Company must be at least 2 characters'
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
    } else if (formData.role.trim().length < 2) {
      newErrors.role = 'Role must be at least 2 characters'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    
    setSaving(true)
    try {
      await onSave({
        ...formData,
        company: formData.company.trim(),
        role: formData.role.trim(),
        location: formData.location.trim(),
        source: formData.source.trim() || null,
        notes: formData.notes.trim() || null,
        reminder_enabled: formData.reminder_enabled ? 1 : 0
      })
      onClose()
    } catch (error) {
      console.error('Error saving application:', error)
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setFormData({
      company: app?.company || '',
      role: app?.role || '',
      location: app?.location || '',
      status: app?.status || 'APPLIED',
      source: app?.source || '',
      applied_date: app?.applied_date || '',
      next_action_date: app?.next_action_date || '',
      last_contact_date: app?.last_contact_date || '',
      follow_up_date: app?.follow_up_date || '',
      follow_up_sent: app?.follow_up_sent || 0,
      reminder_enabled: app?.reminder_enabled !== undefined ? Boolean(app?.reminder_enabled) : true,
      notes: app?.notes || ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="relative bg-white/95 backdrop-blur-sm border border-white/40 rounded-3xl p-6 shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Edit Application
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className={`w-full rounded-xl border-2 px-4 py-3 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                errors.company ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="Enter company name"
            />
            {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className={`w-full rounded-xl border-2 px-4 py-3 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                errors.role ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            >
              <option value="">Select a role</option>
              {TECH_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <select
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={`w-full rounded-xl border-2 px-4 py-3 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                errors.location ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            >
              <option value="">Select a location</option>
              {US_LOCATIONS.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
            <input
              type="text"
              value={formData.source}
              onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="e.g. LinkedIn, Company Website, Referral"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Applied Date</label>
              <input
                type="date"
                value={formData.applied_date}
                onChange={e => setFormData(prev => ({ ...prev, applied_date: e.target.value }))}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Contact</label>
              <input
                type="date"
                value={formData.last_contact_date}
                onChange={e => setFormData(prev => ({ ...prev, last_contact_date: e.target.value }))}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Next Action Date</label>
              <input
                type="date"
                value={formData.next_action_date}
                onChange={e => setFormData(prev => ({ ...prev, next_action_date: e.target.value }))}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Follow-up Date</label>
              <input
                type="date"
                value={formData.follow_up_date}
                onChange={e => setFormData(prev => ({ ...prev, follow_up_date: e.target.value }))}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Follow-ups Sent</label>
              <input
                type="number"
                min="0"
                value={formData.follow_up_sent}
                onChange={e => setFormData(prev => ({ ...prev, follow_up_sent: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reminder_enabled}
                  onChange={e => setFormData(prev => ({ ...prev, reminder_enabled: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Enable Reminders</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
              rows={4}
              placeholder="Add any notes about this application..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 rounded-xl border-2 border-gray-300 text-slate-700 px-6 py-3 hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 disabled:opacity-50 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
          >
            {saving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}