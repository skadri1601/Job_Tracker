/**
 * JOB FILTER COMPONENT
 * ===================
 * Advanced filtering for job applications by role type, location, salary, etc.
 * Features: Role filtering, location filter, salary range, experience level
 */

import React, { useState, useEffect } from 'react'

export default function JobFilter({ onFilterChange, jobs = [] }) {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  const [filters, setFilters] = useState({
    roleTypes: [],
    locations: [],
    salaryRange: { min: 0, max: 300000 },
    experienceLevel: [],
    remote: 'all', // 'remote', 'onsite', 'hybrid', 'all'
    companySize: [],
    industries: [],
    searchQuery: ''
  })

  const [isExpanded, setIsExpanded] = useState(false)

  // ======================
  // FILTER OPTIONS
  // ======================

  const roleTypes = [
    { value: 'software-engineer', label: 'Software Engineer', count: 0, keywords: ['software engineer', 'swe', 'software developer'] },
    { value: 'frontend', label: 'Frontend Developer', count: 0, keywords: ['frontend', 'front-end', 'react', 'vue', 'angular', 'ui developer'] },
    { value: 'backend', label: 'Backend Developer', count: 0, keywords: ['backend', 'back-end', 'api', 'server', 'node', 'python', 'java'] },
    { value: 'fullstack', label: 'Full Stack Developer', count: 0, keywords: ['fullstack', 'full stack', 'full-stack'] },
    { value: 'mobile', label: 'Mobile Developer', count: 0, keywords: ['mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin'] },
    { value: 'devops', label: 'DevOps Engineer', count: 0, keywords: ['devops', 'sre', 'infrastructure', 'kubernetes', 'docker', 'aws', 'cloud'] },
    { value: 'data-scientist', label: 'Data Scientist', count: 0, keywords: ['data scientist', 'machine learning', 'ml', 'ai', 'data analyst'] },
    { value: 'product-manager', label: 'Product Manager', count: 0, keywords: ['product manager', 'pm', 'product owner', 'product'] },
    { value: 'ui-ux', label: 'UI/UX Designer', count: 0, keywords: ['ui', 'ux', 'designer', 'user experience', 'user interface'] },
    { value: 'qa', label: 'QA Engineer', count: 0, keywords: ['qa', 'quality assurance', 'test', 'testing', 'automation'] },
    { value: 'security', label: 'Security Engineer', count: 0, keywords: ['security', 'cybersecurity', 'infosec', 'penetration'] },
    { value: 'engineering-manager', label: 'Engineering Manager', count: 0, keywords: ['engineering manager', 'tech lead', 'team lead', 'manager'] }
  ]

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)', count: 0 },
    { value: 'mid', label: 'Mid Level (3-5 years)', count: 0 },
    { value: 'senior', label: 'Senior Level (6-8 years)', count: 0 },
    { value: 'lead', label: 'Lead/Principal (9+ years)', count: 0 },
    { value: 'executive', label: 'Executive/Director', count: 0 }
  ]

  const companySizes = [
    { value: 'startup', label: 'Startup (1-50)', count: 0 },
    { value: 'small', label: 'Small (51-200)', count: 0 },
    { value: 'medium', label: 'Medium (201-1000)', count: 0 },
    { value: 'large', label: 'Large (1001-5000)', count: 0 },
    { value: 'enterprise', label: 'Enterprise (5000+)', count: 0 }
  ]

  const industries = [
    { value: 'technology', label: 'Technology', count: 0 },
    { value: 'fintech', label: 'Fintech', count: 0 },
    { value: 'healthcare', label: 'Healthcare', count: 0 },
    { value: 'ecommerce', label: 'E-commerce', count: 0 },
    { value: 'gaming', label: 'Gaming', count: 0 },
    { value: 'education', label: 'Education', count: 0 },
    { value: 'media', label: 'Media & Entertainment', count: 0 },
    { value: 'consulting', label: 'Consulting', count: 0 }
  ]

  // ======================
  // FILTER LOGIC
  // ======================

  // Categorize job by role type
  const categorizeJobRole = (roleTitle) => {
    const roleLower = roleTitle.toLowerCase()
    
    for (const roleType of roleTypes) {
      for (const keyword of roleType.keywords) {
        if (roleLower.includes(keyword)) {
          return roleType.value
        }
      }
    }
    
    return 'other'
  }

  // Extract experience level from job title/description
  const extractExperienceLevel = (roleTitle, description = '') => {
    const text = `${roleTitle} ${description}`.toLowerCase()
    
    if (text.includes('senior') || text.includes('sr.') || text.includes('lead') || text.includes('principal')) {
      return 'senior'
    } else if (text.includes('junior') || text.includes('jr.') || text.includes('entry') || text.includes('associate')) {
      return 'entry'
    } else if (text.includes('manager') || text.includes('director') || text.includes('head of')) {
      return 'executive'
    } else if (text.includes('mid') || text.includes('intermediate')) {
      return 'mid'
    } else {
      return 'mid' // Default to mid-level
    }
  }

  // Calculate counts for filter options
  const calculateCounts = () => {
    const updatedRoleTypes = roleTypes.map(type => ({ ...type, count: 0 }))
    const updatedExperience = experienceLevels.map(level => ({ ...level, count: 0 }))
    const updatedCompanySizes = companySizes.map(size => ({ ...size, count: 0 }))
    const updatedIndustries = industries.map(industry => ({ ...industry, count: 0 }))

    jobs.forEach(job => {
      // Count role types
      const roleCategory = categorizeJobRole(job.role)
      const roleTypeIndex = updatedRoleTypes.findIndex(type => type.value === roleCategory)
      if (roleTypeIndex !== -1) {
        updatedRoleTypes[roleTypeIndex].count++
      }

      // Count experience levels
      const expLevel = extractExperienceLevel(job.role, job.notes)
      const expIndex = updatedExperience.findIndex(level => level.value === expLevel)
      if (expIndex !== -1) {
        updatedExperience[expIndex].count++
      }

      // Count company sizes (simplified logic)
      const companySize = getCompanySize(job.company)
      const sizeIndex = updatedCompanySizes.findIndex(size => size.value === companySize)
      if (sizeIndex !== -1) {
        updatedCompanySizes[sizeIndex].count++
      }

      // Count industries
      const industry = getIndustry(job.company)
      const industryIndex = updatedIndustries.findIndex(ind => ind.value === industry)
      if (industryIndex !== -1) {
        updatedIndustries[industryIndex].count++
      }
    })

    return {
      roleTypes: updatedRoleTypes,
      experienceLevels: updatedExperience,
      companySizes: updatedCompanySizes,
      industries: updatedIndustries
    }
  }

  // Simple company size categorization
  const getCompanySize = (company) => {
    const companyLower = company.toLowerCase()
    const bigTech = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix', 'uber', 'airbnb']
    const enterprise = ['ibm', 'oracle', 'salesforce', 'adobe', 'intuit', 'paypal', 'stripe']
    
    if (bigTech.some(tech => companyLower.includes(tech))) return 'enterprise'
    if (enterprise.some(ent => companyLower.includes(ent))) return 'large'
    return 'medium' // Default
  }

  // Simple industry categorization
  const getIndustry = (company) => {
    const companyLower = company.toLowerCase()
    
    if (['bank', 'financial', 'fintech', 'stripe', 'paypal'].some(term => companyLower.includes(term))) return 'fintech'
    if (['health', 'medical', 'bio', 'pharma'].some(term => companyLower.includes(term))) return 'healthcare'
    if (['game', 'gaming', 'entertainment', 'media'].some(term => companyLower.includes(term))) return 'gaming'
    if (['shop', 'commerce', 'retail', 'amazon'].some(term => companyLower.includes(term))) return 'ecommerce'
    if (['education', 'learn', 'school', 'university'].some(term => companyLower.includes(term))) return 'education'
    
    return 'technology' // Default
  }

  // Filter jobs based on current filters
  const filterJobs = (jobsList) => {
    return jobsList.filter(job => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const searchableText = `${job.role} ${job.company} ${job.location} ${job.notes || ''}`.toLowerCase()
        if (!searchableText.includes(query)) return false
      }

      // Role type filter
      if (filters.roleTypes.length > 0) {
        const jobRole = categorizeJobRole(job.role)
        if (!filters.roleTypes.includes(jobRole)) return false
      }

      // Location filter (remote/onsite/hybrid)
      if (filters.remote !== 'all') {
        const isRemote = job.location?.toLowerCase().includes('remote') || job.remote_work
        const isHybrid = job.location?.toLowerCase().includes('hybrid')
        
        if (filters.remote === 'remote' && !isRemote) return false
        if (filters.remote === 'onsite' && (isRemote || isHybrid)) return false
        if (filters.remote === 'hybrid' && !isHybrid) return false
      }

      // Experience level filter
      if (filters.experienceLevel.length > 0) {
        const jobExpLevel = extractExperienceLevel(job.role, job.notes)
        if (!filters.experienceLevel.includes(jobExpLevel)) return false
      }

      // Company size filter
      if (filters.companySize.length > 0) {
        const jobCompanySize = getCompanySize(job.company)
        if (!filters.companySize.includes(jobCompanySize)) return false
      }

      // Industry filter
      if (filters.industries.length > 0) {
        const jobIndustry = getIndustry(job.company)
        if (!filters.industries.includes(jobIndustry)) return false
      }

      // Salary range filter (if salary data exists)
      if (job.salary_min && job.salary_max) {
        if (job.salary_max < filters.salaryRange.min || job.salary_min > filters.salaryRange.max) {
          return false
        }
      }

      return true
    })
  }

  // ======================
  // EVENT HANDLERS
  // ======================

  const handleFilterChange = (filterType, value) => {
    let newFilters = { ...filters }

    switch (filterType) {
      case 'roleTypes':
      case 'experienceLevel':
      case 'companySize':
      case 'industries':
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value)
        } else {
          newFilters[filterType] = [...newFilters[filterType], value]
        }
        break
      case 'remote':
      case 'searchQuery':
        newFilters[filterType] = value
        break
      case 'salaryRange':
        newFilters.salaryRange = value
        break
      default:
        break
    }

    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      roleTypes: [],
      locations: [],
      salaryRange: { min: 0, max: 300000 },
      experienceLevel: [],
      remote: 'all',
      companySize: [],
      industries: [],
      searchQuery: ''
    }
    setFilters(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.roleTypes.length > 0) count++
    if (filters.experienceLevel.length > 0) count++
    if (filters.companySize.length > 0) count++
    if (filters.industries.length > 0) count++
    if (filters.remote !== 'all') count++
    if (filters.searchQuery) count++
    return count
  }

  // ======================
  // EFFECTS
  // ======================

  useEffect(() => {
    const filteredJobs = filterJobs(jobs)
    onFilterChange(filteredJobs, filters)
  }, [filters, jobs])

  // Calculate counts when jobs change
  const counts = calculateCounts()

  // ======================
  // RENDER COMPONENT
  // ======================

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Job Filters</h3>
              <p className="text-sm text-gray-600">
                {getActiveFilterCount() > 0 && `${getActiveFilterCount()} filters active • `}
                {filterJobs(jobs).length} jobs match
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{isExpanded ? 'Less' : 'More'} Filters</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {/* Role Type Quick Filters */}
          {counts.roleTypes.slice(0, 6).map(roleType => (
            roleType.count > 0 && (
              <button
                key={roleType.value}
                onClick={() => handleFilterChange('roleTypes', roleType.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.roleTypes.includes(roleType.value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {roleType.label} ({roleType.count})
              </button>
            )
          ))}
          
          {/* Remote Filter */}
          <button
            onClick={() => handleFilterChange('remote', filters.remote === 'remote' ? 'all' : 'remote')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filters.remote === 'remote'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏠 Remote Only
          </button>
        </div>
      </div>

      {/* Extended Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Role Types */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Role Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {counts.roleTypes.map(roleType => (
                <label key={roleType.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roleTypes.includes(roleType.value)}
                    onChange={() => handleFilterChange('roleTypes', roleType.value)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {roleType.label} ({roleType.count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Work Type */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Work Type</h4>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'onsite', label: 'On-site' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('remote', option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.remote === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
            <div className="space-y-2">
              {counts.experienceLevels.map(level => (
                <label key={level.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.experienceLevel.includes(level.value)}
                    onChange={() => handleFilterChange('experienceLevel', level.value)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {level.label} ({level.count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Company Size */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Company Size</h4>
            <div className="space-y-2">
              {counts.companySizes.map(size => (
                <label key={size.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.companySize.includes(size.value)}
                    onChange={() => handleFilterChange('companySize', size.value)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {size.label} ({size.count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Industries</h4>
            <div className="grid grid-cols-2 gap-2">
              {counts.industries.map(industry => (
                <label key={industry.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.industries.includes(industry.value)}
                    onChange={() => handleFilterChange('industries', industry.value)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {industry.label} ({industry.count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Salary Range</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Min Salary</label>
                  <input
                    type="number"
                    min="0"
                    max="500000"
                    step="5000"
                    value={filters.salaryRange.min}
                    onChange={(e) => handleFilterChange('salaryRange', { ...filters.salaryRange, min: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Max Salary</label>
                  <input
                    type="number"
                    min="0"
                    max="500000"
                    step="5000"
                    value={filters.salaryRange.max}
                    onChange={(e) => handleFilterChange('salaryRange', { ...filters.salaryRange, max: parseInt(e.target.value) || 300000 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="300000"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                ${filters.salaryRange.min.toLocaleString()} - ${filters.salaryRange.max.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}