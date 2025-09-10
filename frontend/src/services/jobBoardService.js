/**
 * JOB BOARD SERVICE
 * =================
 * Real job posting data integration with major job boards
 * APIs: Indeed, LinkedIn, Glassdoor, RemoteOK, AngelList, etc.
 */

// ======================
// API CONFIGURATION
// ======================

const API_ENDPOINTS = {
  // RapidAPI Job Board APIs
  indeed: 'https://indeed11.p.rapidapi.com/search',
  linkedin: 'https://linkedin-jobs-search.p.rapidapi.com/search',
  glassdoor: 'https://glassdoor1.p.rapidapi.com/search',
  remoteok: 'https://remoteok.com/api',
  
  // Free/Public APIs
  jobs2careers: 'https://api.jobs2careers.com/api/search.php',
  usajobs: 'https://data.usajobs.gov/api/search',
  github: 'https://jobs.github.com/positions.json',
  
  // Aggregator APIs
  jooble: 'https://jooble.org/api/',
  findwork: 'https://findwork.dev/api/jobs/',
  
  // Developer-focused
  stackoverflow: 'https://api.stackexchange.com/2.3/jobs',
  angellist: 'https://api.angel.co/1/jobs',
  
  // Custom scraped data (would need backend implementation)
  custom: '/api/jobs/scrape'
}

const API_KEYS = {
  rapidapi: process.env.REACT_APP_RAPIDAPI_KEY || 'your-rapidapi-key',
  usajobs: process.env.REACT_APP_USAJOBS_KEY || 'your-usajobs-key',
  github: process.env.REACT_APP_GITHUB_TOKEN || 'your-github-token'
}

// ======================
// JOB BOARD INTEGRATIONS
// ======================

class JobBoardService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 30 * 60 * 1000 // 30 minutes
  }

  // ======================
  // MAIN SEARCH FUNCTION
  // ======================

  async searchJobs(filters = {}) {
    const {
      query = 'software engineer',
      location = 'United States',
      experience = 'mid',
      remote = false,
      salary_min = null,
      company_size = null,
      limit = 50,
      sources = ['indeed', 'linkedin', 'remoteok', 'github']
    } = filters

    const allJobs = []
    const errors = []

    // Search multiple job boards in parallel
    const searchPromises = sources.map(async (source) => {
      try {
        const jobs = await this.searchJobBoard(source, {
          query,
          location,
          experience,
          remote,
          salary_min,
          company_size,
          limit: Math.ceil(limit / sources.length)
        })
        return { source, jobs, error: null }
      } catch (error) {
        console.error(`Error searching ${source}:`, error)
        return { source, jobs: [], error: error.message }
      }
    })

    const results = await Promise.allSettled(searchPromises)

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { source, jobs, error } = result.value
        if (error) {
          errors.push({ source, error })
        } else {
          allJobs.push(...jobs.map(job => ({ ...job, source })))
        }
      }
    })

    // Remove duplicates and sort by relevance
    const uniqueJobs = this.removeDuplicates(allJobs)
    const sortedJobs = this.sortJobsByRelevance(uniqueJobs, query)

    return {
      jobs: sortedJobs.slice(0, limit),
      totalFound: uniqueJobs.length,
      sources: sources.length,
      errors
    }
  }

  // ======================
  // INDIVIDUAL JOB BOARD SEARCHES
  // ======================

  async searchJobBoard(source, filters) {
    const cacheKey = `${source}-${JSON.stringify(filters)}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    let jobs = []

    switch (source) {
      case 'indeed':
        jobs = await this.searchIndeed(filters)
        break
      case 'linkedin':
        jobs = await this.searchLinkedIn(filters)
        break
      case 'remoteok':
        jobs = await this.searchRemoteOK(filters)
        break
      case 'github':
        jobs = await this.searchGitHubJobs(filters)
        break
      case 'glassdoor':
        jobs = await this.searchGlassdoor(filters)
        break
      case 'stackoverflow':
        jobs = await this.searchStackOverflow(filters)
        break
      default:
        throw new Error(`Unsupported job board: ${source}`)
    }

    // Cache the results
    this.cache.set(cacheKey, {
      data: jobs,
      timestamp: Date.now()
    })

    return jobs
  }

  // Indeed API Integration
  async searchIndeed(filters) {
    const params = new URLSearchParams({
      query: filters.query,
      location: filters.location,
      radius: '50',
      job_type: filters.remote ? 'remote' : 'all',
      date_posted: '14', // Last 14 days
      limit: filters.limit || 20
    })

    try {
      const response = await fetch(`${API_ENDPOINTS.indeed}?${params}`, {
        headers: {
          'X-RapidAPI-Key': API_KEYS.rapidapi,
          'X-RapidAPI-Host': 'indeed11.p.rapidapi.com'
        }
      })

      if (!response.ok) throw new Error('Indeed API error')

      const data = await response.json()
      
      return (data.jobs || []).map(job => ({
        id: job.key || job.jobkey,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description || job.summary,
        url: job.url,
        salary: this.parseSalary(job.salary),
        posted_date: this.parseDate(job.date),
        remote: job.remote || job.location?.toLowerCase().includes('remote'),
        employment_type: job.type || 'full-time',
        applicants_count: this.estimateApplicants(job.date, 'indeed'),
        source: 'indeed'
      }))
    } catch (error) {
      console.error('Indeed search error:', error)
      return []
    }
  }

  // LinkedIn Jobs API Integration
  async searchLinkedIn(filters) {
    const params = new URLSearchParams({
      keywords: filters.query,
      location: filters.location,
      dateSincePosted: 'week',
      jobType: 'F', // Full-time
      remoteFilter: filters.remote ? 'remote' : 'all',
      experienceLevel: this.mapExperienceLevel(filters.experience),
      limit: filters.limit || 20
    })

    try {
      const response = await fetch(`${API_ENDPOINTS.linkedin}?${params}`, {
        headers: {
          'X-RapidAPI-Key': API_KEYS.rapidapi,
          'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
        }
      })

      if (!response.ok) throw new Error('LinkedIn API error')

      const data = await response.json()
      
      return (data.jobs || []).map(job => ({
        id: job.id,
        title: job.title,
        company: job.company?.name || job.companyName,
        location: job.location,
        description: job.description,
        url: job.url || job.applyUrl,
        salary: this.parseSalary(job.salary),
        posted_date: this.parseDate(job.publishedAt || job.postedAt),
        remote: job.remote || job.workplaceTypes?.includes('remote'),
        employment_type: job.employmentType || 'full-time',
        applicants_count: job.applicantsCount || this.estimateApplicants(job.publishedAt, 'linkedin'),
        skills_required: job.skills || [],
        experience_level: job.experienceLevel,
        source: 'linkedin'
      }))
    } catch (error) {
      console.error('LinkedIn search error:', error)
      return []
    }
  }

  // RemoteOK API Integration (Free API)
  async searchRemoteOK(filters) {
    if (!filters.remote) return [] // RemoteOK is only for remote jobs

    try {
      const response = await fetch(API_ENDPOINTS.remoteok)
      
      if (!response.ok) throw new Error('RemoteOK API error')

      const data = await response.json()
      
      return data
        .filter(job => 
          job && 
          job.position && 
          job.company && 
          job.position.toLowerCase().includes(filters.query.toLowerCase())
        )
        .slice(0, filters.limit || 20)
        .map(job => ({
          id: job.id,
          title: job.position,
          company: job.company,
          location: 'Remote',
          description: job.description,
          url: job.url,
          salary: this.parseSalary(`$${job.salary_min}-${job.salary_max}`),
          posted_date: this.parseDate(job.date),
          remote: true,
          employment_type: 'full-time',
          applicants_count: this.estimateApplicants(job.date, 'remoteok'),
          tags: job.tags || [],
          source: 'remoteok'
        }))
    } catch (error) {
      console.error('RemoteOK search error:', error)
      return []
    }
  }

  // GitHub Jobs API Integration
  async searchGitHubJobs(filters) {
    const params = new URLSearchParams({
      description: filters.query,
      location: filters.location,
      full_time: filters.employment_type !== 'part-time',
      page: 0
    })

    try {
      const response = await fetch(`${API_ENDPOINTS.github}?${params}`, {
        headers: {
          'User-Agent': 'Job-Tracker-App',
          'Authorization': `token ${API_KEYS.github}`
        }
      })

      if (!response.ok) throw new Error('GitHub Jobs API error')

      const jobs = await response.json()
      
      return jobs.slice(0, filters.limit || 20).map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        url: job.url,
        salary: null, // GitHub Jobs doesn't provide salary
        posted_date: this.parseDate(job.created_at),
        remote: job.location?.toLowerCase().includes('remote'),
        employment_type: job.type?.toLowerCase() || 'full-time',
        applicants_count: this.estimateApplicants(job.created_at, 'github'),
        source: 'github'
      }))
    } catch (error) {
      console.error('GitHub Jobs search error:', error)
      return []
    }
  }

  // Glassdoor API Integration
  async searchGlassdoor(filters) {
    const params = new URLSearchParams({
      term: filters.query,
      location: filters.location,
      radius: 50,
      jobType: 'fulltime',
      minSalary: filters.salary_min || 50000,
      maxAge: 30, // Last 30 days
      pageSize: filters.limit || 20
    })

    try {
      const response = await fetch(`${API_ENDPOINTS.glassdoor}?${params}`, {
        headers: {
          'X-RapidAPI-Key': API_KEYS.rapidapi,
          'X-RapidAPI-Host': 'glassdoor1.p.rapidapi.com'
        }
      })

      if (!response.ok) throw new Error('Glassdoor API error')

      const data = await response.json()
      
      return (data.jobs || []).map(job => ({
        id: job.jobId,
        title: job.jobTitle,
        company: job.employerName,
        location: job.location,
        description: job.jobDescription,
        url: job.jobUrl,
        salary: this.parseSalary(job.salaryText),
        posted_date: this.parseDate(job.discoverDate),
        remote: job.location?.toLowerCase().includes('remote'),
        employment_type: 'full-time',
        applicants_count: this.estimateApplicants(job.discoverDate, 'glassdoor'),
        company_rating: job.overallRating,
        source: 'glassdoor'
      }))
    } catch (error) {
      console.error('Glassdoor search error:', error)
      return []
    }
  }

  // Stack Overflow Jobs Integration
  async searchStackOverflow(filters) {
    const params = new URLSearchParams({
      site: 'stackoverflow',
      tagged: this.extractTechTags(filters.query).join(';'),
      location: filters.location,
      distanceUnits: 'Miles',
      distanceRadius: 50
    })

    try {
      const response = await fetch(`${API_ENDPOINTS.stackoverflow}?${params}`)
      
      if (!response.ok) throw new Error('Stack Overflow API error')

      const data = await response.json()
      
      return (data.jobs || []).map(job => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        location: job.location,
        description: job.description,
        url: job.link,
        salary: this.parseSalary(job.salary),
        posted_date: new Date(job.creation_date * 1000).toISOString(),
        remote: job.remote,
        employment_type: job.job_type?.toLowerCase() || 'full-time',
        applicants_count: this.estimateApplicants(new Date(job.creation_date * 1000), 'stackoverflow'),
        tags: job.tags || [],
        source: 'stackoverflow'
      }))
    } catch (error) {
      console.error('Stack Overflow search error:', error)
      return []
    }
  }

  // ======================
  // UTILITY FUNCTIONS
  // ======================

  // Remove duplicate jobs based on title and company
  removeDuplicates(jobs) {
    const seen = new Set()
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  // Sort jobs by relevance to search query
  sortJobsByRelevance(jobs, query) {
    const queryWords = query.toLowerCase().split(' ')
    
    return jobs.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, queryWords)
      const scoreB = this.calculateRelevanceScore(b, queryWords)
      
      // Secondary sort by posted date (newer first)
      if (scoreA === scoreB) {
        return new Date(b.posted_date) - new Date(a.posted_date)
      }
      
      return scoreB - scoreA
    })
  }

  calculateRelevanceScore(job, queryWords) {
    let score = 0
    const text = `${job.title} ${job.description}`.toLowerCase()
    
    queryWords.forEach(word => {
      if (job.title.toLowerCase().includes(word)) score += 3
      if (job.description?.toLowerCase().includes(word)) score += 1
    })
    
    // Boost recent postings
    const daysOld = (Date.now() - new Date(job.posted_date)) / (1000 * 60 * 60 * 24)
    if (daysOld < 7) score += 2
    else if (daysOld < 14) score += 1
    
    return score
  }

  // Parse salary information
  parseSalary(salaryText) {
    if (!salaryText) return null
    
    const text = salaryText.toLowerCase()
    const numbers = text.match(/\d+(?:,\d{3})*/g)
    
    if (!numbers) return null
    
    const values = numbers.map(n => parseInt(n.replace(/,/g, '')))
    
    if (text.includes('hour')) {
      return {
        min: values[0] * 2080, // Assuming 40 hours/week
        max: values[1] ? values[1] * 2080 : values[0] * 2080,
        type: 'hourly'
      }
    }
    
    return {
      min: values[0],
      max: values[1] || values[0],
      type: 'annual'
    }
  }

  // Parse and standardize dates
  parseDate(dateString) {
    if (!dateString) return new Date().toISOString()
    
    try {
      return new Date(dateString).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  // Estimate applicant count based on job age and source
  estimateApplicants(postedDate, source) {
    const daysOld = (Date.now() - new Date(postedDate)) / (1000 * 60 * 60 * 24)
    
    const baseRates = {
      linkedin: 50,
      indeed: 30,
      glassdoor: 25,
      github: 15,
      remoteok: 20,
      stackoverflow: 18
    }
    
    const baseRate = baseRates[source] || 25
    return Math.floor(baseRate * Math.sqrt(daysOld + 1))
  }

  // Map experience levels to API formats
  mapExperienceLevel(level) {
    const mapping = {
      'entry': '1',
      'mid': '2',
      'senior': '3',
      'lead': '4',
      'executive': '5'
    }
    return mapping[level] || '2'
  }

  // Extract technology tags from search query
  extractTechTags(query) {
    const techKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
      'typescript', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift',
      'aws', 'docker', 'kubernetes', 'mongodb', 'postgresql', 'mysql'
    ]
    
    return techKeywords.filter(tech => 
      query.toLowerCase().includes(tech)
    )
  }

  // ======================
  // JOB DETAILS
  // ======================

  // Get detailed job information
  async getJobDetails(jobId, source) {
    // This would fetch additional details about a specific job
    // Implementation depends on the specific API
    try {
      switch (source) {
        case 'linkedin':
          return await this.getLinkedInJobDetails(jobId)
        case 'indeed':
          return await this.getIndeedJobDetails(jobId)
        default:
          return null
      }
    } catch (error) {
      console.error(`Error fetching job details for ${jobId}:`, error)
      return null
    }
  }

  async getLinkedInJobDetails(jobId) {
    // Implementation for LinkedIn job details
    // This would include company info, full description, requirements, etc.
    return null
  }

  async getIndeedJobDetails(jobId) {
    // Implementation for Indeed job details
    return null
  }

  // ======================
  // COMPANY INFORMATION
  // ======================

  // Get company information
  async getCompanyInfo(companyName) {
    // This would fetch company details, funding, size, etc.
    // Could integrate with Crunchbase, LinkedIn Company API, etc.
    try {
      const response = await fetch(`/api/companies/${encodeURIComponent(companyName)}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Error fetching company info:', error)
    }
    
    return {
      name: companyName,
      size: 'Unknown',
      industry: 'Technology',
      founded: null,
      funding: null,
      rating: null
    }
  }

  // ======================
  // ANALYTICS
  // ======================

  // Get job market analytics
  async getMarketAnalytics(query, location) {
    const jobs = await this.searchJobs({ query, location, limit: 100 })
    
    const salaries = jobs.jobs
      .filter(job => job.salary?.min)
      .map(job => job.salary.min)
    
    const companies = {}
    const locations = {}
    
    jobs.jobs.forEach(job => {
      companies[job.company] = (companies[job.company] || 0) + 1
      locations[job.location] = (locations[job.location] || 0) + 1
    })
    
    return {
      totalJobs: jobs.totalFound,
      averageSalary: salaries.length ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : null,
      salaryRange: salaries.length ? {
        min: Math.min(...salaries),
        max: Math.max(...salaries)
      } : null,
      topCompanies: Object.entries(companies)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([company, count]) => ({ company, count })),
      topLocations: Object.entries(locations)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([location, count]) => ({ location, count })),
      sources: jobs.jobs.reduce((acc, job) => {
        acc[job.source] = (acc[job.source] || 0) + 1
        return acc
      }, {})
    }
  }
}

// Export singleton instance
export default new JobBoardService()