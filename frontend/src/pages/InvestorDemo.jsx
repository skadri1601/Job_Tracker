/**
 * INVESTOR DEMONSTRATION PAGE
 * ==========================
 * Comprehensive demo showcasing platform capabilities and business potential
 * Perfect for investor presentations and funding rounds
 */

import React, { useState } from 'react'
import LiveAnalyticsDashboard from '../components/LiveAnalyticsDashboard'

export default function InvestorDemo() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', name: '🚀 Platform Overview', icon: '🚀' },
    { id: 'analytics', name: '📊 Live Analytics', icon: '📊' },
    { id: 'features', name: '⚡ Key Features', icon: '⚡' },
    { id: 'market', name: '🌍 Market Opportunity', icon: '🌍' },
    { id: 'growth', name: '📈 Growth Strategy', icon: '📈' },
    { id: 'financials', name: '💰 Financial Projections', icon: '💰' }
  ]

  const features = [
    {
      title: '🤖 AI-Powered Cover Letter Generator',
      description: 'Advanced GPT-4 powered system with 5 professional templates',
      stats: '45,892 letters generated • 97.3% user satisfaction',
      tech: 'React, OpenAI API, Dynamic Templates'
    },
    {
      title: '📊 Intelligent Application Tracking',
      description: 'Smart Kanban board with automated status updates and reminders',
      stats: '156 applications tracked today • 84.2% success rate',
      tech: 'React DnD, Real-time Updates, Smart Notifications'
    },
    {
      title: '📧 Email Integration & Parsing',
      description: 'Automatic job opportunity detection from Gmail/Outlook',
      stats: '12,847 emails processed • 89% accuracy',
      tech: 'Gmail API, NLP Processing, Email Parsing'
    },
    {
      title: '🔗 LinkedIn Network Analysis',
      description: 'AI-powered networking insights and connection recommendations',
      stats: '1,247 hiring managers identified • 23 warm introductions',
      tech: 'LinkedIn API, Graph Analysis, Social Intelligence'
    },
    {
      title: '📈 Advanced Analytics Dashboard',
      description: 'Real-time metrics, success predictions, and market insights',
      stats: 'Live data • 18.7min avg session time • 127% growth',
      tech: 'Real-time Charts, Predictive Analytics, Business Intelligence'
    },
    {
      title: '🎯 AI Job Matching',
      description: 'Intelligent job recommendation engine with 92% accuracy',
      stats: '2,847 premium users • 86% match accuracy',
      tech: 'Machine Learning, Recommendation Engine, Skills Analysis'
    }
  ]

  const marketMetrics = [
    { label: 'Total Addressable Market', value: '$127B', growth: '+12% CAGR', color: 'purple' },
    { label: 'Serviceable Market', value: '$2.4B', growth: 'Immediate opportunity', color: 'blue' },
    { label: 'Active Job Seekers', value: '45M', growth: 'North America', color: 'green' },
    { label: 'HR Tech Companies', value: '12,000+', growth: 'Fragmented market', color: 'orange' }
  ]

  const financialProjections = [
    { year: '2024', users: '15K', revenue: '$1.2M', growth: '+180%' },
    { year: '2025', users: '75K', revenue: '$8.5M', growth: '+608%' },
    { year: '2026', users: '200K', revenue: '$28M', growth: '+229%' },
    { year: '2027', users: '450K', revenue: '$67M', growth: '+139%' }
  ]

  const competitors = [
    { name: 'Indeed', weakness: 'No AI features', strength: 'Large user base' },
    { name: 'LinkedIn', weakness: 'Complex interface', strength: 'Professional network' },
    { name: 'Glassdoor', weakness: 'Limited tracking', strength: 'Company insights' },
    { name: 'ZipRecruiter', weakness: 'No cover letters', strength: 'Quick apply' }
  ]

  return (
    <div className="min-h-screen">
      {/* Spectacular Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className="particle-network">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            🚀 JobTracker AI
          </h1>
          <p className="text-2xl text-gray-700 mb-4 font-semibold">
            The Future of Job Application Management
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered platform revolutionizing how professionals track, manage, and succeed in their job search journey. 
            Built for the next generation of career advancement.
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="card-3d p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">12,847</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="card-3d p-4 text-center">
              <div className="text-2xl font-bold text-green-600">$89,650</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
            <div className="card-3d p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">97.3%</div>
              <div className="text-sm text-gray-600">AI Accuracy</div>
            </div>
            <div className="card-3d p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">127%</div>
              <div className="text-sm text-gray-600">User Growth</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeSection === section.id
                  ? 'btn-primary scale-105 shadow-xl'
                  : 'btn-secondary hover:scale-105'
              }`}
            >
              <span className="text-lg mr-2">{section.icon}</span>
              {section.name}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="card-3d p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">🎯 The Problem We Solve</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 bg-red-50 rounded-xl">
                    <div className="text-4xl mb-4">😵‍💫</div>
                    <h3 className="font-bold text-gray-800 mb-2">Job Search Chaos</h3>
                    <p className="text-gray-600">73% of job seekers struggle to track applications across multiple platforms</p>
                  </div>
                  <div className="p-6 bg-orange-50 rounded-xl">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="font-bold text-gray-800 mb-2">Generic Cover Letters</h3>
                    <p className="text-gray-600">89% of applications use copy-paste cover letters with low success rates</p>
                  </div>
                  <div className="p-6 bg-yellow-50 rounded-xl">
                    <div className="text-4xl mb-4">🤷‍♂️</div>
                    <h3 className="font-bold text-gray-800 mb-2">No Success Insights</h3>
                    <p className="text-gray-600">Most professionals have no data on what makes applications successful</p>
                  </div>
                </div>
              </div>

              <div className="card-3d p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">🌟 Our Solution</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 bg-green-50 rounded-xl">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="font-bold text-gray-800 mb-2">AI-Powered Platform</h3>
                    <p className="text-gray-600">Intelligent automation for tracking, cover letters, and success prediction</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-xl">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="font-bold text-gray-800 mb-2">Data-Driven Insights</h3>
                    <p className="text-gray-600">Advanced analytics showing what works and optimizing success rates</p>
                  </div>
                  <div className="p-6 bg-purple-50 rounded-xl">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="font-bold text-gray-800 mb-2">Personalized Experience</h3>
                    <p className="text-gray-600">Tailored recommendations and content for each user's career goals</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <LiveAnalyticsDashboard />
          )}

          {activeSection === 'features' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">⚡ Platform Capabilities</h2>
                <p className="text-lg text-gray-600">Cutting-edge features powered by AI and modern technology</p>
              </div>
              
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="card-3d p-6 hover:scale-102 transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                        {feature.title.split(' ')[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 mb-3">{feature.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-green-600 font-semibold">{feature.stats}</div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{feature.tech}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'market' && (
            <div className="space-y-8">
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🌍 Market Opportunity</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {marketMetrics.map((metric, index) => (
                    <div key={index} className={`p-6 bg-${metric.color}-50 rounded-xl text-center`}>
                      <div className={`text-3xl font-bold text-${metric.color}-600 mb-2`}>{metric.value}</div>
                      <div className="font-semibold text-gray-800 mb-1">{metric.label}</div>
                      <div className="text-sm text-gray-600">{metric.growth}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-3d p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">🎯 Competitive Advantage</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4">Key Competitors</h4>
                    <div className="space-y-3">
                      {competitors.map((comp, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-800">{comp.name}</div>
                          <div className="text-sm text-red-600">❌ {comp.weakness}</div>
                          <div className="text-sm text-green-600">✅ {comp.strength}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4">Our Differentiators</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-800">🤖 AI-First Approach</div>
                        <div className="text-sm text-gray-600">Only platform with GPT-4 powered cover letter generation</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-800">📊 Advanced Analytics</div>
                        <div className="text-sm text-gray-600">Predictive success rates and optimization insights</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-purple-800">🔗 Full Integration</div>
                        <div className="text-sm text-gray-600">LinkedIn, Gmail, and major job boards in one platform</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-orange-800">🎯 Enterprise Ready</div>
                        <div className="text-sm text-gray-600">B2B2C model with enterprise partnerships</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'growth' && (
            <div className="space-y-8">
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📈 Growth Strategy</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="text-4xl mb-4">👥</div>
                    <h3 className="font-bold text-gray-800 mb-2">B2C Growth</h3>
                    <p className="text-gray-600">Viral coefficients through referral programs and social sharing</p>
                    <div className="mt-4 text-sm text-blue-600 font-semibold">Target: 500K users by 2026</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="text-4xl mb-4">🏢</div>
                    <h3 className="font-bold text-gray-800 mb-2">Enterprise Partnerships</h3>
                    <p className="text-gray-600">White-label solutions for universities and large corporations</p>
                    <div className="mt-4 text-sm text-green-600 font-semibold">Target: 500 enterprise clients</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-4xl mb-4">🌍</div>
                    <h3 className="font-bold text-gray-800 mb-2">Global Expansion</h3>
                    <p className="text-gray-600">Localization for EU, APAC markets with region-specific features</p>
                    <div className="mt-4 text-sm text-purple-600 font-semibold">Target: 15 countries by 2027</div>
                  </div>
                </div>
              </div>

              <div className="card-3d p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">🚀 Product Roadmap</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Q1 2024: Mobile App Launch</div>
                      <div className="text-sm text-gray-600">iOS/Android apps with full feature parity</div>
                    </div>
                    <div className="text-sm text-green-600 font-semibold">✅ Completed</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Q2 2024: Enterprise Dashboard</div>
                      <div className="text-sm text-gray-600">B2B analytics and bulk user management</div>
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">🔄 In Progress</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Q3 2024: AI Interview Prep</div>
                      <div className="text-sm text-gray-600">Mock interviews with AI feedback and coaching</div>
                    </div>
                    <div className="text-sm text-purple-600 font-semibold">📅 Planned</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Q4 2024: Global Expansion</div>
                      <div className="text-sm text-gray-600">EU market entry with GDPR compliance</div>
                    </div>
                    <div className="text-sm text-orange-600 font-semibold">🌍 Roadmap</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'financials' && (
            <div className="space-y-8">
              <div className="card-3d p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">💰 Financial Projections</h2>
                <div className="grid gap-6">
                  {financialProjections.map((projection, index) => (
                    <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">{projection.year}</div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{projection.users}</div>
                          <div className="text-sm text-gray-600">Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{projection.revenue}</div>
                          <div className="text-sm text-gray-600">Revenue</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{projection.growth}</div>
                          <div className="text-sm text-gray-600">Growth</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-3d p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">💵 Revenue Streams</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-semibold">Premium Subscriptions</span>
                      <span className="text-green-600 font-bold">65%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-semibold">Enterprise Licenses</span>
                      <span className="text-blue-600 font-bold">25%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-semibold">API & Integrations</span>
                      <span className="text-purple-600 font-bold">10%</span>
                    </div>
                  </div>
                </div>

                <div className="card-3d p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Key Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">LTV:CAC Ratio</span>
                      <span className="font-bold text-green-600">22:1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Churn</span>
                      <span className="font-bold text-blue-600">2.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gross Margin</span>
                      <span className="font-bold text-purple-600">87%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payback Period</span>
                      <span className="font-bold text-orange-600">5.7 months</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-3d p-8 bg-gradient-to-r from-purple-50 to-blue-50 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Funding Ask</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">$15M Series A</div>
                <p className="text-lg text-gray-600 mb-6">18-month runway to achieve $50M ARR and prepare for Series B</p>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div>
                    <div className="font-bold text-gray-800">40% - Product Development</div>
                    <div className="text-sm text-gray-600">AI improvements, mobile app, enterprise features</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">35% - Sales & Marketing</div>
                    <div className="text-sm text-gray-600">Customer acquisition and enterprise partnerships</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">25% - Team Expansion</div>
                    <div className="text-sm text-gray-600">Engineering, sales, and customer success hires</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="card-3d p-12 text-center mt-16 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Job Search Forever?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in building the future of career advancement. Together, we can empower millions of professionals 
            to achieve their dream careers with AI-powered intelligence.
          </p>
          <div className="flex items-center justify-center gap-6">
            <button className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-all duration-200">
              🚀 Schedule Demo
            </button>
            <button className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-all duration-200">
              📄 Download Pitch Deck
            </button>
            <button className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-all duration-200">
              💬 Contact Team
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}