/**
 * CV MATCHING SERVICE
 * ===================
 * AI-powered CV parsing and job description matching system
 * Features: CV parsing, skill extraction, job matching, compatibility scoring
 */

// ======================
// CV MATCHING SERVICE
// ======================

class CVMatchingService {
  constructor() {
    this.cachedParsedCVs = new Map()
    this.skillDatabase = this.buildSkillDatabase()
    this.industryKeywords = this.buildIndustryKeywords()
  }

  // ======================
  // CV PARSING
  // ======================

  // Parse CV from various formats
  async parseCV(file) {
    try {
      const fileType = file.type
      let extractedText = ''
      
      // Extract text based on file type
      if (fileType === 'application/pdf') {
        extractedText = await this.parsePDF(file)
      } else if (fileType.includes('word')) {
        extractedText = await this.parseWord(file)
      } else if (fileType === 'text/plain') {
        extractedText = await this.parseText(file)
      } else {
        throw new Error('Unsupported file format')
      }
      
      // Parse the extracted text
      const parsedCV = await this.parseExtractedText(extractedText)
      
      // Cache the result
      this.cachedParsedCVs.set(file.name, parsedCV)
      
      return parsedCV
    } catch (error) {
      console.error('CV parsing error:', error)
      throw new Error('Failed to parse CV: ' + error.message)
    }
  }

  // Parse PDF files
  async parsePDF(file) {
    // In a real implementation, you would use a library like PDF.js or pdf-parse
    // For now, simulate PDF parsing
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Simulate PDF text extraction
        const mockText = `
          John Doe
          Software Engineer
          john.doe@email.com | (555) 123-4567 | San Francisco, CA
          
          EXPERIENCE
          Senior Software Engineer | Google Inc. | 2021 - Present
          - Developed scalable web applications using React, Node.js, and TypeScript
          - Led a team of 5 engineers in building microservices architecture
          - Improved application performance by 40% through optimization
          - Implemented CI/CD pipelines using Docker and Kubernetes
          
          Software Engineer | Microsoft | 2019 - 2021
          - Built responsive web applications using Angular and .NET Core
          - Collaborated with product managers on feature development
          - Mentored junior developers on best practices
          
          EDUCATION
          Bachelor of Science in Computer Science | Stanford University | 2019
          
          SKILLS
          Programming Languages: JavaScript, TypeScript, Python, Java, C#
          Frontend: React, Angular, Vue.js, HTML5, CSS3, SASS
          Backend: Node.js, .NET Core, Express.js, Python Flask
          Databases: MongoDB, PostgreSQL, MySQL, Redis
          Cloud: AWS, Azure, Google Cloud Platform
          Tools: Docker, Kubernetes, Jenkins, Git, JIRA
          
          CERTIFICATIONS
          - AWS Certified Solutions Architect
          - Google Cloud Professional Developer
        `
        resolve(mockText)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  // Parse Word documents
  async parseWord(file) {
    // In a real implementation, you would use mammoth.js or similar
    return this.parsePDF(file) // Mock implementation
  }

  // Parse plain text files
  async parseText(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsText(file)
    })
  }

  // Parse extracted text into structured data
  async parseExtractedText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line)
    
    const parsedCV = {
      personalInfo: this.extractPersonalInfo(text),
      summary: this.extractSummary(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      skills: this.extractSkills(text),
      certifications: this.extractCertifications(text),
      projects: this.extractProjects(text),
      
      // Analysis results
      analysis: {
        experienceYears: 0,
        skillCategories: {},
        industryExperience: [],
        seniorityLevel: 'mid',
        techStack: [],
        domains: []
      }
    }
    
    // Perform analysis
    parsedCV.analysis = this.analyzeCV(parsedCV)
    
    return parsedCV
  }

  // Extract personal information
  extractPersonalInfo(text) {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/
    const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9-]+)/i
    const githubRegex = /(github\.com\/[a-zA-Z0-9-]+)/i
    
    const lines = text.split('\n').slice(0, 10) // First 10 lines usually contain personal info
    const firstLines = lines.join(' ')
    
    return {
      name: this.extractName(lines),
      email: emailRegex.exec(firstLines)?.[1] || null,
      phone: phoneRegex.exec(firstLines)?.[1] || null,
      linkedin: linkedinRegex.exec(firstLines)?.[1] || null,
      github: githubRegex.exec(firstLines)?.[1] || null,
      location: this.extractLocation(firstLines)
    }
  }

  // Extract name (usually first or second line)
  extractName(lines) {
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim()
      // Skip lines that are obviously not names
      if (line.includes('@') || line.includes('http') || line.match(/\d{3}/)) continue
      
      // Check if line looks like a name
      if (line.split(' ').length >= 2 && line.split(' ').length <= 4) {
        return line
      }
    }
    return 'Unknown'
  }

  // Extract location from text
  extractLocation(text) {
    const locationPatterns = [
      /([A-Z][a-z]+ [A-Z][a-z]+, [A-Z]{2})/,  // City State, ST
      /([A-Z][a-z]+, [A-Z]{2})/,               // City, ST
      /([A-Z][a-z]+ [A-Z][a-z]+)/              // City State
    ]
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  // Extract professional summary
  extractSummary(text) {
    const summaryKeywords = ['summary', 'profile', 'objective', 'about']
    const lines = text.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim()
      
      if (summaryKeywords.some(keyword => line.includes(keyword))) {
        // Found summary section, extract following lines until next section
        const summaryLines = []
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim()
          if (nextLine && !this.isSection(nextLine)) {
            summaryLines.push(nextLine)
          } else if (this.isSection(nextLine)) {
            break
          }
        }
        return summaryLines.join(' ')
      }
    }
    
    return null
  }

  // Extract work experience
  extractExperience(text) {
    const experiences = []
    const lines = text.split('\n')
    let currentExperience = null
    let inExperienceSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lowerLine = line.toLowerCase()
      
      // Check if we're entering experience section
      if (lowerLine.includes('experience') || lowerLine.includes('work history')) {
        inExperienceSection = true
        continue
      }
      
      // Check if we're leaving experience section
      if (inExperienceSection && this.isSection(line) && 
          !lowerLine.includes('experience') && !lowerLine.includes('work')) {
        break
      }
      
      if (inExperienceSection && line) {
        // Check if this line looks like a job title/company
        if (this.looksLikeJobTitle(line)) {
          // Save previous experience if exists
          if (currentExperience && currentExperience.title) {
            experiences.push(currentExperience)
          }
          
          // Parse job title, company, and dates
          currentExperience = this.parseJobLine(line)
        } else if (currentExperience && line.startsWith('-')) {
          // This looks like a responsibility
          if (!currentExperience.responsibilities) {
            currentExperience.responsibilities = []
          }
          currentExperience.responsibilities.push(line.substring(1).trim())
        } else if (currentExperience && line.length > 20) {
          // Long line might be a description
          if (!currentExperience.description) {
            currentExperience.description = line
          }
        }
      }
    }
    
    // Add last experience
    if (currentExperience && currentExperience.title) {
      experiences.push(currentExperience)
    }
    
    return experiences
  }

  // Parse job title line
  parseJobLine(line) {
    // Common patterns:
    // "Senior Software Engineer | Google | 2021 - Present"
    // "Software Engineer at Microsoft (2019-2021)"
    // "Lead Developer, Apple Inc., 2020-Present"
    
    const separators = ['|', ' at ', ' - ', ', ']
    let parts = [line]
    
    for (const separator of separators) {
      if (line.includes(separator)) {
        parts = line.split(separator).map(p => p.trim())
        break
      }
    }
    
    // Extract dates
    const datePattern = /(\d{4}\s*[-–]\s*(?:\d{4}|present))/i
    const dateMatch = line.match(datePattern)
    const dates = dateMatch ? dateMatch[1] : null
    
    // Remove dates from parts
    if (dates) {
      parts = parts.map(part => part.replace(datePattern, '').trim()).filter(part => part)
    }
    
    return {
      title: parts[0] || 'Unknown Title',
      company: parts[1] || 'Unknown Company',
      dates: dates,
      location: parts[2] || null,
      responsibilities: [],
      description: null
    }
  }

  // Extract education
  extractEducation(text) {
    const education = []
    const lines = text.split('\n')
    let inEducationSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lowerLine = line.toLowerCase()
      
      if (lowerLine.includes('education') || lowerLine.includes('academic')) {
        inEducationSection = true
        continue
      }
      
      if (inEducationSection && this.isSection(line) && !lowerLine.includes('education')) {
        break
      }
      
      if (inEducationSection && line) {
        const degree = this.parseEducationLine(line)
        if (degree) {
          education.push(degree)
        }
      }
    }
    
    return education
  }

  // Parse education line
  parseEducationLine(line) {
    const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'associate', 'certificate']
    const lowerLine = line.toLowerCase()
    
    if (degreeKeywords.some(keyword => lowerLine.includes(keyword))) {
      const yearPattern = /(\d{4})/
      const yearMatch = line.match(yearPattern)
      
      return {
        degree: line,
        school: null,
        year: yearMatch ? yearMatch[1] : null,
        field: this.extractField(line)
      }
    }
    
    return null
  }

  // Extract field of study
  extractField(line) {
    const fields = ['computer science', 'engineering', 'mathematics', 'business', 'physics', 'chemistry']
    const lowerLine = line.toLowerCase()
    
    for (const field of fields) {
      if (lowerLine.includes(field)) {
        return field
      }
    }
    
    return null
  }

  // Extract skills from CV
  extractSkills(text) {
    const skills = {
      programming: [],
      frameworks: [],
      databases: [],
      tools: [],
      cloud: [],
      soft: [],
      other: []
    }
    
    const lines = text.split('\n')
    let inSkillsSection = false
    
    // First, look for dedicated skills section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lowerLine = line.toLowerCase()
      
      if (lowerLine.includes('skills') || lowerLine.includes('technologies') || 
          lowerLine.includes('technical skills')) {
        inSkillsSection = true
        continue
      }
      
      if (inSkillsSection && this.isSection(line) && !lowerLine.includes('skill')) {
        break
      }
      
      if (inSkillsSection && line) {
        this.categorizeSkills(line, skills)
      }
    }
    
    // Also scan entire document for known skills
    this.scanForSkills(text, skills)
    
    return skills
  }

  // Categorize skills by type
  categorizeSkills(line, skills) {
    const categories = {
      programming: this.skillDatabase.programming,
      frameworks: this.skillDatabase.frameworks,
      databases: this.skillDatabase.databases,
      tools: this.skillDatabase.tools,
      cloud: this.skillDatabase.cloud
    }
    
    const lowerLine = line.toLowerCase()
    
    for (const [category, skillList] of Object.entries(categories)) {
      for (const skill of skillList) {
        if (lowerLine.includes(skill.toLowerCase()) && !skills[category].includes(skill)) {
          skills[category].push(skill)
        }
      }
    }
  }

  // Scan entire document for skills
  scanForSkills(text, skills) {
    const lowerText = text.toLowerCase()
    
    // Scan for all skill types
    Object.entries(this.skillDatabase).forEach(([category, skillList]) => {
      skillList.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase()) && 
            !skills[category]?.includes(skill) && 
            !skills.other.includes(skill)) {
          
          if (skills[category]) {
            skills[category].push(skill)
          } else {
            skills.other.push(skill)
          }
        }
      })
    })
  }

  // Extract certifications
  extractCertifications(text) {
    const certifications = []
    const certKeywords = ['certification', 'certified', 'certificate']
    const lines = text.split('\n')
    let inCertSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lowerLine = line.toLowerCase()
      
      if (certKeywords.some(keyword => lowerLine.includes(keyword))) {
        if (this.isSection(line)) {
          inCertSection = true
          continue
        } else {
          // Inline certification
          certifications.push({
            name: line,
            issuer: this.extractIssuer(line),
            year: this.extractYear(line)
          })
        }
      }
      
      if (inCertSection && this.isSection(line)) {
        break
      }
      
      if (inCertSection && line && line.length > 5) {
        certifications.push({
          name: line,
          issuer: this.extractIssuer(line),
          year: this.extractYear(line)
        })
      }
    }
    
    return certifications
  }

  // Extract projects
  extractProjects(text) {
    const projects = []
    const lines = text.split('\n')
    let inProjectSection = false
    let currentProject = null
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lowerLine = line.toLowerCase()
      
      if (lowerLine.includes('project') && this.isSection(line)) {
        inProjectSection = true
        continue
      }
      
      if (inProjectSection && this.isSection(line) && !lowerLine.includes('project')) {
        if (currentProject) projects.push(currentProject)
        break
      }
      
      if (inProjectSection && line) {
        if (line.length > 10 && !line.startsWith('-')) {
          // New project
          if (currentProject) projects.push(currentProject)
          currentProject = {
            name: line,
            description: null,
            technologies: []
          }
        } else if (currentProject && line.startsWith('-')) {
          currentProject.description = line.substring(1).trim()
        }
      }
    }
    
    if (currentProject) projects.push(currentProject)
    
    return projects
  }

  // ======================
  // CV ANALYSIS
  // ======================

  // Analyze parsed CV
  analyzeCV(parsedCV) {
    return {
      experienceYears: this.calculateExperienceYears(parsedCV.experience),
      skillCategories: this.categorizeAllSkills(parsedCV.skills),
      industryExperience: this.identifyIndustries(parsedCV.experience),
      seniorityLevel: this.determineSeniorityLevel(parsedCV),
      techStack: this.identifyTechStack(parsedCV.skills),
      domains: this.identifyDomains(parsedCV),
      strengths: this.identifyStrengths(parsedCV),
      recommendations: this.generateRecommendations(parsedCV)
    }
  }

  // Calculate total years of experience
  calculateExperienceYears(experiences) {
    let totalMonths = 0
    
    experiences.forEach(exp => {
      if (exp.dates) {
        const months = this.parseDateRange(exp.dates)
        totalMonths += months
      }
    })
    
    return Math.round(totalMonths / 12 * 10) / 10 // Round to 1 decimal place
  }

  // Parse date range to months
  parseDateRange(dateString) {
    const cleanDate = dateString.toLowerCase().replace(/[()]/g, '')
    const parts = cleanDate.split(/[-–]/).map(p => p.trim())
    
    if (parts.length !== 2) return 12 // Default to 1 year if can't parse
    
    const startYear = parseInt(parts[0])
    const endPart = parts[1]
    
    const endYear = endPart.includes('present') || endPart.includes('current') ? 
      new Date().getFullYear() : parseInt(endPart)
    
    if (isNaN(startYear) || isNaN(endYear)) return 12
    
    return Math.max(1, (endYear - startYear) * 12)
  }

  // Determine seniority level
  determineSeniorityLevel(parsedCV) {
    const years = parsedCV.analysis?.experienceYears || 0
    const hasLeadership = parsedCV.experience.some(exp => 
      exp.title?.toLowerCase().includes('lead') || 
      exp.title?.toLowerCase().includes('senior') ||
      exp.title?.toLowerCase().includes('manager')
    )
    
    if (years >= 8 || hasLeadership) return 'senior'
    if (years >= 4) return 'mid'
    if (years >= 1) return 'junior'
    return 'entry'
  }

  // Identify tech stack
  identifyTechStack(skills) {
    const stack = []
    
    // Frontend
    const frontend = skills.frameworks?.filter(f => 
      ['React', 'Angular', 'Vue.js', 'HTML5', 'CSS3'].includes(f)
    ) || []
    if (frontend.length > 0) stack.push({ category: 'Frontend', technologies: frontend })
    
    // Backend
    const backend = skills.programming?.filter(p => 
      ['Node.js', 'Python', 'Java', 'C#', '.NET'].includes(p)
    ) || []
    if (backend.length > 0) stack.push({ category: 'Backend', technologies: backend })
    
    // Database
    if (skills.databases?.length > 0) {
      stack.push({ category: 'Database', technologies: skills.databases })
    }
    
    // Cloud
    if (skills.cloud?.length > 0) {
      stack.push({ category: 'Cloud', technologies: skills.cloud })
    }
    
    return stack
  }

  // ======================
  // JOB MATCHING
  // ======================

  // Match CV against job description
  async matchJobToCV(jobDescription, parsedCV) {
    const jobRequirements = this.parseJobRequirements(jobDescription)
    const matchScore = this.calculateMatchScore(parsedCV, jobRequirements)
    const gaps = this.identifySkillGaps(parsedCV, jobRequirements)
    const recommendations = this.generateMatchRecommendations(parsedCV, jobRequirements, matchScore)
    
    return {
      matchScore,
      jobRequirements,
      skillMatches: this.findSkillMatches(parsedCV, jobRequirements),
      experienceMatch: this.calculateExperienceMatch(parsedCV, jobRequirements),
      skillGaps: gaps,
      recommendations,
      competitivenessScore: this.calculateCompetitiveness(parsedCV, jobRequirements),
      improvementAreas: this.identifyImprovementAreas(gaps)
    }
  }

  // Parse job requirements from description
  parseJobRequirements(jobDescription) {
    const text = jobDescription.toLowerCase()
    
    return {
      skills: this.extractRequiredSkills(text),
      experience: this.extractExperienceRequirements(text),
      education: this.extractEducationRequirements(text),
      softSkills: this.extractSoftSkills(text),
      responsibilities: this.extractResponsibilities(jobDescription),
      requirements: this.extractRequirements(jobDescription),
      preferred: this.extractPreferredQualifications(text)
    }
  }

  // Extract required skills from job description
  extractRequiredSkills(text) {
    const skills = {
      programming: [],
      frameworks: [],
      databases: [],
      tools: [],
      cloud: [],
      other: []
    }
    
    // Scan for known skills
    Object.entries(this.skillDatabase).forEach(([category, skillList]) => {
      skillList.forEach(skill => {
        if (text.includes(skill.toLowerCase())) {
          if (skills[category]) {
            skills[category].push(skill)
          } else {
            skills.other.push(skill)
          }
        }
      })
    })
    
    return skills
  }

  // Calculate overall match score
  calculateMatchScore(parsedCV, jobRequirements) {
    let totalScore = 0
    let maxScore = 0
    
    // Skills matching (40% weight)
    const skillScore = this.calculateSkillMatchScore(parsedCV.skills, jobRequirements.skills)
    totalScore += skillScore * 0.4
    maxScore += 40
    
    // Experience matching (30% weight)
    const expScore = this.calculateExperienceMatchScore(parsedCV, jobRequirements)
    totalScore += expScore * 0.3
    maxScore += 30
    
    // Education matching (15% weight)
    const eduScore = this.calculateEducationMatchScore(parsedCV.education, jobRequirements.education)
    totalScore += eduScore * 0.15
    maxScore += 15
    
    // Soft skills matching (15% weight)
    const softScore = this.calculateSoftSkillsMatchScore(parsedCV, jobRequirements.softSkills)
    totalScore += softScore * 0.15
    maxScore += 15
    
    return Math.round((totalScore / maxScore) * 100)
  }

  // Calculate skill match score
  calculateSkillMatchScore(cvSkills, jobSkills) {
    let matches = 0
    let total = 0
    
    Object.entries(jobSkills).forEach(([category, requiredSkills]) => {
      requiredSkills.forEach(skill => {
        total++
        if (cvSkills[category]?.some(cvSkill => 
          cvSkill.toLowerCase() === skill.toLowerCase()
        )) {
          matches++
        }
      })
    })
    
    return total > 0 ? (matches / total) * 100 : 50
  }

  // ======================
  // SKILL DATABASE
  // ======================

  // Build comprehensive skill database
  buildSkillDatabase() {
    return {
      programming: [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'PHP', 
        'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL'
      ],
      frameworks: [
        'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Next.js', 'Nuxt.js',
        '.NET', '.NET Core', 'ASP.NET', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
        'Laravel', 'Rails', 'Svelte', 'Ember.js', 'Backbone.js'
      ],
      databases: [
        'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 
        'DynamoDB', 'Oracle', 'SQL Server', 'Elasticsearch', 'Neo4j'
      ],
      cloud: [
        'AWS', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
        'CloudFormation', 'Serverless', 'Lambda', 'EC2', 'S3', 'Azure Functions'
      ],
      tools: [
        'Git', 'GitHub', 'GitLab', 'Jenkins', 'CircleCI', 'Travis CI', 'JIRA',
        'Confluence', 'Slack', 'Docker', 'Webpack', 'Babel', 'ESLint', 'Jest',
        'Cypress', 'Selenium', 'Postman', 'Figma', 'Adobe Creative Suite'
      ],
      mobile: [
        'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin', 'Ionic', 
        'Cordova', 'Swift', 'Objective-C', 'Kotlin', 'Java'
      ]
    }
  }

  // Build industry keywords
  buildIndustryKeywords() {
    return {
      technology: ['software', 'tech', 'engineering', 'development', 'programming'],
      finance: ['fintech', 'banking', 'financial', 'trading', 'payments'],
      healthcare: ['health', 'medical', 'hospital', 'pharma', 'biotech'],
      ecommerce: ['ecommerce', 'retail', 'marketplace', 'shopping'],
      gaming: ['gaming', 'game', 'entertainment', 'media'],
      education: ['education', 'learning', 'university', 'school']
    }
  }

  // ======================
  // UTILITY METHODS
  // ======================

  // Check if line is a section header
  isSection(line) {
    const sectionKeywords = [
      'experience', 'education', 'skills', 'projects', 'certifications',
      'summary', 'objective', 'profile', 'work history', 'employment'
    ]
    
    const lowerLine = line.toLowerCase().trim()
    
    // All caps might be a section
    if (line === line.toUpperCase() && line.length > 3) return true
    
    // Contains section keywords
    return sectionKeywords.some(keyword => lowerLine.includes(keyword))
  }

  // Check if line looks like a job title
  looksLikeJobTitle(line) {
    const titleKeywords = [
      'engineer', 'developer', 'manager', 'analyst', 'architect', 'lead',
      'director', 'consultant', 'specialist', 'coordinator', 'designer'
    ]
    
    const lowerLine = line.toLowerCase()
    return titleKeywords.some(keyword => lowerLine.includes(keyword)) ||
           line.includes('|') || line.includes(' at ') || line.includes(' - ')
  }

  // Extract issuer from certification line
  extractIssuer(line) {
    const issuers = ['AWS', 'Google', 'Microsoft', 'Oracle', 'Cisco', 'CompTIA']
    const lowerLine = line.toLowerCase()
    
    for (const issuer of issuers) {
      if (lowerLine.includes(issuer.toLowerCase())) {
        return issuer
      }
    }
    
    return null
  }

  // Extract year from text
  extractYear(text) {
    const yearMatch = text.match(/(\d{4})/)
    return yearMatch ? yearMatch[1] : null
  }

  // Additional helper methods for completeness...
  categorizeAllSkills(skills) {
    const total = Object.values(skills).reduce((sum, arr) => sum + (arr?.length || 0), 0)
    return {
      total,
      breakdown: Object.entries(skills).map(([category, skillList]) => ({
        category,
        count: skillList?.length || 0,
        percentage: total > 0 ? Math.round((skillList?.length || 0) / total * 100) : 0
      }))
    }
  }

  identifyIndustries(experiences) {
    return ['Technology', 'Software'] // Simplified
  }

  identifyDomains(parsedCV) {
    return ['Web Development', 'Software Engineering'] // Simplified
  }

  identifyStrengths(parsedCV) {
    return ['Technical Skills', 'Problem Solving'] // Simplified
  }

  generateRecommendations(parsedCV) {
    return ['Consider adding more certifications', 'Expand cloud skills'] // Simplified
  }

  findSkillMatches(parsedCV, jobRequirements) {
    return [] // Simplified
  }

  calculateExperienceMatch(parsedCV, jobRequirements) {
    return 80 // Simplified
  }

  identifySkillGaps(parsedCV, jobRequirements) {
    return [] // Simplified
  }

  generateMatchRecommendations(parsedCV, jobRequirements, matchScore) {
    return [] // Simplified
  }

  calculateCompetitiveness(parsedCV, jobRequirements) {
    return 75 // Simplified
  }

  identifyImprovementAreas(gaps) {
    return [] // Simplified
  }

  calculateExperienceMatchScore(parsedCV, jobRequirements) {
    return 80 // Simplified
  }

  calculateEducationMatchScore(education, jobEducation) {
    return 70 // Simplified
  }

  calculateSoftSkillsMatchScore(parsedCV, jobSoftSkills) {
    return 75 // Simplified
  }

  extractExperienceRequirements(text) {
    return {} // Simplified
  }

  extractEducationRequirements(text) {
    return {} // Simplified
  }

  extractSoftSkills(text) {
    return [] // Simplified
  }

  extractResponsibilities(text) {
    return [] // Simplified
  }

  extractRequirements(text) {
    return [] // Simplified
  }

  extractPreferredQualifications(text) {
    return [] // Simplified
  }
}

// Export singleton instance
export default new CVMatchingService()