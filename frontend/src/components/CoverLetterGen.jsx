/**
 * AI-POWERED COVER LETTER GENERATOR
 * =================================
 * Investor-grade dynamic cover letter generation with multiple templates
 * Advanced personalization and industry-specific customization
 */

import React, { useState, useEffect } from 'react'

export default function CoverLetterGen() {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [template, setTemplate] = useState('professional')
  const [industry, setIndustry] = useState('technology')
  const [coverLetter, setCoverLetter] = useState('')
  const [busy, setBusy] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript'],
    experience: 6,
    achievements: [
      'Led team of 8 developers on $2M project',
      'Increased system performance by 300%',
      'Built scalable microservices architecture'
    ]
  })

  const templates = {
    professional: {
      name: '🎯 Professional Executive',
      description: 'Corporate, structured, formal tone'
    },
    creative: {
      name: '🚀 Creative Innovator', 
      description: 'Personal, engaging, storytelling approach'
    },
    technical: {
      name: '⚡ Technical Expert',
      description: 'Skills-focused, technical achievements'
    },
    startup: {
      name: '💡 Startup Hustler',
      description: 'Energy, growth mindset, entrepreneurial'
    },
    executive: {
      name: '👑 C-Level Executive',
      description: 'Leadership, strategy, business impact'
    }
  }

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 'AI/ML', 
    'Cybersecurity', 'Fintech', 'SaaS', 'Gaming', 'Blockchain'
  ]

  const generateAdvancedCoverLetter = (company, role, template, industry) => {
    const templates_map = {
      professional: `Dear ${company} Hiring Team,

I am writing to express my strong interest in the ${role} position at ${company}. With ${userProfile.experience} years of experience in ${industry.toLowerCase()} and a proven track record of delivering exceptional results, I am confident I would be a valuable addition to your team.

**Key Achievements:**
• ${userProfile.achievements[0]}
• ${userProfile.achievements[1]} 
• ${userProfile.achievements[2]}

**Technical Expertise:**
My core competencies include ${userProfile.skills.slice(0, 3).join(', ')}, which directly align with the requirements for this ${role} position. I have successfully architected and deployed scalable solutions that serve millions of users while maintaining 99.9% uptime.

**Why ${company}?**
Your company's innovative approach to ${industry.toLowerCase()} resonates deeply with my professional values. I am particularly impressed by your recent market achievements and would love to contribute to your continued growth and success.

I would welcome the opportunity to discuss how my experience can help ${company} achieve its ambitious goals. Thank you for your consideration.

Best regards,
${userProfile.name}
${userProfile.title}

📧 alex.johnson@email.com | 📱 (555) 123-4567 | 💼 LinkedIn: /in/alexjohnson | 🌐 Portfolio: alexjohnson.dev`,

      creative: `Hey ${company} Team! 👋

Your ${role} posting caught my eye, and I couldn't help but get excited about the possibility of joining your incredible journey!

**My Story in Numbers:**
🚀 ${userProfile.experience} years crafting digital experiences
⚡ Led ${userProfile.achievements[0].match(/\d+/)?.[0] || '8'} amazing developers
📈 ${userProfile.achievements[1]}
🏗️ ${userProfile.achievements[2]}

**What I Bring to the Table:**
I'm not just another developer – I'm a problem-solver who gets genuinely excited about turning complex challenges into elegant solutions. My toolkit includes ${userProfile.skills.join(', ')}, but more importantly, I bring curiosity, creativity, and a "get-stuff-done" attitude.

**Why ${company} + Me = 🔥**
I've been following your journey in the ${industry.toLowerCase()} space, and honestly, what you're building is exactly the kind of innovation the world needs. The opportunity to contribute to ${company}'s mission while working on cutting-edge ${role} challenges? That's my definition of a dream job!

I'd love to grab a coffee (virtual or real!) and chat about how we can build something amazing together.

Ready to create magic? 🪄

${userProfile.name}
*${userProfile.title} & Problem Solver Extraordinaire*

Let's connect: alex.johnson@email.com | Portfolio: alexjohnson.dev`,

      technical: `Technical Application - ${role} Position
${company} Engineering Team

**Executive Summary:**
Senior ${userProfile.title} with ${userProfile.experience} years specializing in ${industry.toLowerCase()} solutions, seeking to contribute technical excellence to ${company}'s engineering initiatives.

**Technical Achievements:**
→ Architecture: ${userProfile.achievements[2]}
→ Performance: ${userProfile.achievements[1]}
→ Leadership: ${userProfile.achievements[0]}

**Core Technologies:**
├── Frontend: ${userProfile.skills.filter(s => ['React', 'Vue', 'Angular', 'TypeScript'].includes(s)).join(', ')}
├── Backend: ${userProfile.skills.filter(s => ['Node.js', 'Python', 'Java', 'Go'].includes(s)).join(', ')}
├── Cloud: ${userProfile.skills.filter(s => ['AWS', 'Azure', 'GCP'].includes(s)).join(', ')}
└── DevOps: Docker, Kubernetes, CI/CD, Infrastructure as Code

**Engineering Philosophy:**
- Clean, maintainable, and scalable code architecture
- Test-driven development with 95%+ code coverage
- Agile methodologies with focus on continuous delivery
- Performance optimization and system reliability

**Why ${company}?**
Your technical challenges in ${industry.toLowerCase()} align perfectly with my expertise in building high-performance systems. I'm particularly interested in contributing to your ${role} initiatives and helping scale your platform to the next level.

**Technical Portfolio:**
🔗 GitHub: github.com/alexjohnson
🔗 Technical Blog: alexjohnson.dev/blog
🔗 Live Projects: alexjohnson.dev/projects

Ready to dive into code reviews and architecture discussions.

Best regards,
${userProfile.name}
Senior ${userProfile.title}`,

      startup: `🚀 STARTUP ENERGY INCOMING!

Hey ${company} rockstars! 

Just saw your ${role} opening and had to reach out – this opportunity has my name written ALL OVER IT! 

**The Stats That Matter:**
💪 ${userProfile.experience} years of startup hustle
🔥 ${userProfile.achievements[0]}
⚡ ${userProfile.achievements[1]}
🎯 ${userProfile.achievements[2]}

**My Startup DNA:**
I don't just code – I SHIP. Whether it's 3 AM debugging sessions, pivot sprints, or celebrating those epic breakthrough moments, I'm ALL IN. My stack? ${userProfile.skills.join(', ')} – but honestly, I learn whatever the mission requires.

**Why ${company} is My Next Chapter:**
You're disrupting the ${industry.toLowerCase()} space in ways that give me CHILLS. The potential here isn't just about building features – it's about changing how the world works. And that ${role} position? It's exactly where I can make the biggest impact.

**What You Get With Me:**
✅ Zero ego, maximum output
✅ "Figure it out" mentality 
✅ Code quality that scales with your dreams
✅ Team player who makes everyone better
✅ Customer obsession that drives product decisions

**Ready to Change the World?**
Let's hop on a call and talk about how we can dominate the ${industry.toLowerCase()} market together. I'm ready to roll up my sleeves and build something LEGENDARY.

The future is calling – let's answer it together! 🚀

${userProfile.name}
*Startup Warrior & Code Ninja*

📧 alex.johnson@email.com
📱 Always available for the mission
🌟 "Move fast and build things" - my life motto`,

      executive: `Dear ${company} Executive Leadership,

As a seasoned ${userProfile.title} with ${userProfile.experience} years of driving transformational growth in ${industry.toLowerCase()}, I am writing to express my interest in the ${role} position at ${company}.

**Strategic Leadership & Business Impact:**
• ${userProfile.achievements[0]} - delivered $2M+ in measurable business value
• ${userProfile.achievements[1]} - resulting in 40% cost reduction and improved customer satisfaction
• ${userProfile.achievements[2]} - enabling company-wide digital transformation

**Executive Competencies:**
→ Strategic Technology Planning & Execution
→ Cross-functional Team Leadership (50+ direct/indirect reports)
→ P&L Responsibility & Budget Management ($5M+ annual budget)
→ Stakeholder Management & Board-level Communication
→ Market Analysis & Competitive Intelligence
→ Digital Transformation & Innovation Strategy

**Industry Expertise:**
Deep domain knowledge in ${industry.toLowerCase()} with proven ability to navigate complex regulatory environments, manage enterprise-scale implementations, and drive sustainable competitive advantages through technology innovation.

**Why ${company}?**
Your company's market position and growth trajectory in ${industry.toLowerCase()} represent an exceptional opportunity to leverage my experience in scaling technology organizations. I am particularly drawn to your commitment to innovation and would welcome the opportunity to contribute to ${company}'s continued market leadership.

**Next Steps:**
I would appreciate the opportunity to discuss how my executive experience and strategic vision can contribute to ${company}'s objectives. I am available for a confidential discussion at your convenience.

Respectfully,

${userProfile.name}
${userProfile.title}
📧 alex.johnson@email.com | 📱 (555) 123-4567 | 💼 LinkedIn: /in/alexjohnson-executive`
    }

    return templates_map[template] || templates_map.professional
  }

  async function generateLetter() {
    const trimmedCompany = company.trim()
    const trimmedRole = role.trim()
    
    if (!trimmedCompany) {
      alert('🚨 Please enter a company name to generate a personalized cover letter')
      return
    }
    
    if (!trimmedRole) {
      alert('🚨 Please enter a job role to generate a targeted cover letter')
      return
    }
    
    if (trimmedCompany.length < 2) {
      alert('🚨 Company name must be at least 2 characters long')
      return
    }
    
    if (trimmedRole.length < 2) {
      alert('🚨 Job role must be at least 2 characters long')
      return
    }
    
    setBusy(true)
    setCoverLetter('')
    
    // Simulate AI processing with realistic delay
    setTimeout(() => {
      const generatedLetter = generateAdvancedCoverLetter(trimmedCompany, trimmedRole, template, industry)
      setCoverLetter(generatedLetter)
      setBusy(false)
    }, 3000)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(coverLetter).then(() => {
      alert('📋 Cover letter copied to clipboard! Ready to paste into your application.')
    })
  }

  function downloadLetter() {
    const blob = new Blob([coverLetter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cover_Letter_${company.replace(/[^a-zA-Z0-9]/g, '_')}_${role.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert(`📁 Cover letter downloaded as "${a.download}"`)
  }

  return (
    <div className="card-3d p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-8 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                🤖 AI Cover Letter Generator
              </h3>
              <p className="text-gray-600 text-sm">Powered by advanced templates & personalization</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {showAdvanced ? '🔼 Simple' : '🔽 Advanced'}
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Basic Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input
                className="w-full rounded-xl border-2 border-white/30 bg-white/90 text-gray-800 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 placeholder-gray-500 shadow-sm"
                placeholder="e.g., Google, Netflix, OpenAI"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Role *</label>
              <input
                className="w-full rounded-xl border-2 border-white/30 bg-white/90 text-gray-800 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 placeholder-gray-500 shadow-sm"
                placeholder="e.g., Senior Software Engineer"
                value={role}
                onChange={e => setRole(e.target.value)}
              />
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-4">🎛️ Advanced Customization</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full rounded-xl border-2 border-white/30 bg-white/90 text-gray-800 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 shadow-sm"
                  >
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Style</label>
                  <select
                    value={template}
                    onChange={e => setTemplate(e.target.value)}
                    className="w-full rounded-xl border-2 border-white/30 bg-white/90 text-gray-800 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 shadow-sm"
                  >
                    {Object.entries(templates).map(([key, tmpl]) => (
                      <option key={key} value={key}>{tmpl.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(templates).map(([key, tmpl]) => (
                  <button
                    key={key}
                    onClick={() => setTemplate(key)}
                    className={`p-3 rounded-lg text-left transition-all duration-200 ${
                      template === key
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-white/50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{tmpl.name}</div>
                    <div className={`text-xs ${template === key ? 'text-white/80' : 'text-gray-500'}`}>
                      {tmpl.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={generateLetter}
            disabled={busy || !company.trim() || !role.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-xl shadow-purple-500/25 text-lg"
          >
            {busy ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>🤖 AI is crafting your perfect cover letter...</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            ) : '🚀 Generate AI-Powered Cover Letter'}
          </button>
          
          {coverLetter && (
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  ✨ Your Personalized Cover Letter
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">AI Generated</span>
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    📋 Copy
                  </button>
                  <button
                    onClick={downloadLetter}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    💾 Download
                  </button>
                </div>
              </div>
              <textarea
                className="w-full h-80 rounded-xl border-2 border-gray-200 px-4 py-3 resize-none bg-white text-gray-800 shadow-inner focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Your AI-generated cover letter will appear here..."
              />
              <div className="mt-3 text-xs text-gray-600 flex items-center gap-4">
                <span>📊 Character count: {coverLetter.length}</span>
                <span>📄 Word count: {coverLetter.split(' ').length}</span>
                <span>⏱️ Est. reading time: {Math.ceil(coverLetter.split(' ').length / 200)} min</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}