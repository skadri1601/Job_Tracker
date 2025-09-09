/**
 * SALARY NEGOTIATION ASSISTANT COMPONENT
 * =====================================
 * AI-powered salary negotiation guidance and market data
 * Features: Market analysis, negotiation strategies, offer evaluation
 */

import React, { useState, useEffect } from 'react'

export default function SalaryNegotiation({ application, userProfile }) {
  // ======================
  // STATE MANAGEMENT
  // ======================
  
  const [marketData, setMarketData] = useState(null)
  const [negotiationAdvice, setNegotiationAdvice] = useState(null)
  const [offerEvaluation, setOfferEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userOffer, setUserOffer] = useState({
    baseSalary: '',
    bonus: '',
    equity: '',
    benefits: '',
    ptodays: '',
    remote: false
  })

  // ======================
  // MARKET DATA ANALYSIS
  // ======================
  
  const generateMarketData = (app, profile) => {
    const role = app.role
    const location = app.location
    const experience = profile?.experience_years || 3
    
    // Base salary calculation (this would use real APIs like Glassdoor, PayScale)
    const baseSalaryData = calculateBaseSalary(role, location, experience)
    
    return {
      baseSalary: baseSalaryData,
      totalCompensation: {
        p10: baseSalaryData.p10 * 1.1,
        p25: baseSalaryData.p25 * 1.15,
        median: baseSalaryData.median * 1.2,
        p75: baseSalaryData.p75 * 1.25,
        p90: baseSalaryData.p90 * 1.3
      },
      marketTrends: {
        direction: 'up',
        changePercent: 8.5,
        demandLevel: 'high',
        competitionLevel: 'moderate'
      },
      location: {
        name: location,
        costOfLiving: getCostOfLivingIndex(location),
        techHubRanking: getTechHubRanking(location)
      },
      companyFactor: getCompanyFactor(app.company),
      negotiationPower: calculateNegotiationPower(app, profile)
    }
  }

  const calculateBaseSalary = (role, location, experience) => {
    // Base salaries by role (simplified - real implementation would use APIs)
    const roleSalaries = {
      'software engineer': { base: 90000, multiplier: 1.0 },
      'senior software engineer': { base: 130000, multiplier: 1.0 },
      'staff software engineer': { base: 180000, multiplier: 1.0 },
      'principal software engineer': { base: 220000, multiplier: 1.0 },
      'engineering manager': { base: 160000, multiplier: 1.0 },
      'frontend developer': { base: 85000, multiplier: 1.0 },
      'backend developer': { base: 95000, multiplier: 1.0 },
      'fullstack developer': { base: 90000, multiplier: 1.0 },
      'devops engineer': { base: 100000, multiplier: 1.0 }
    }

    // Find matching role
    const roleKey = Object.keys(roleSalaries).find(key => 
      role.toLowerCase().includes(key)
    ) || 'software engineer'
    
    const baseSalary = roleSalaries[roleKey].base
    
    // Adjust for experience (5% per year beyond 0 years)
    const experienceMultiplier = 1 + (experience * 0.05)
    
    // Adjust for location
    const locationMultiplier = getLocationMultiplier(location)
    
    const adjustedBase = baseSalary * experienceMultiplier * locationMultiplier
    
    return {
      p10: Math.round(adjustedBase * 0.8),
      p25: Math.round(adjustedBase * 0.9),
      median: Math.round(adjustedBase * 1.0),
      p75: Math.round(adjustedBase * 1.15),
      p90: Math.round(adjustedBase * 1.3),
      source: 'Market Analysis'
    }
  }

  const getLocationMultiplier = (location) => {
    const locationLower = location.toLowerCase()
    
    // High-cost tech hubs
    if (locationLower.includes('san francisco') || locationLower.includes('palo alto')) return 1.4
    if (locationLower.includes('new york')) return 1.25
    if (locationLower.includes('seattle')) return 1.2
    if (locationLower.includes('boston')) return 1.15
    if (locationLower.includes('los angeles')) return 1.1
    if (locationLower.includes('remote')) return 1.05
    
    // Lower-cost areas
    return 0.9
  }

  const getCostOfLivingIndex = (location) => {
    const locationLower = location.toLowerCase()
    if (locationLower.includes('san francisco')) return 180
    if (locationLower.includes('new york')) return 150
    if (locationLower.includes('seattle')) return 130
    if (locationLower.includes('boston')) return 125
    return 100 // Base index
  }

  const getTechHubRanking = (location) => {
    const locationLower = location.toLowerCase()
    if (locationLower.includes('san francisco')) return 1
    if (locationLower.includes('seattle')) return 2
    if (locationLower.includes('new york')) return 3
    if (locationLower.includes('boston')) return 4
    return 10
  }

  const getCompanyFactor = (company) => {
    const companyLower = company.toLowerCase()
    const bigTech = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix']
    const wellFunded = ['stripe', 'airbnb', 'uber', 'spotify', 'shopify']
    
    if (bigTech.some(tech => companyLower.includes(tech))) {
      return {
        type: 'Big Tech',
        salaryMultiplier: 1.3,
        equityValue: 'high',
        benefits: 'excellent'
      }
    }
    
    if (wellFunded.some(company => companyLower.includes(company))) {
      return {
        type: 'Well-funded Startup',
        salaryMultiplier: 1.1,
        equityValue: 'high',
        benefits: 'good'
      }
    }
    
    return {
      type: 'Standard Company',
      salaryMultiplier: 1.0,
      equityValue: 'moderate',
      benefits: 'standard'
    }
  }

  const calculateNegotiationPower = (app, profile) => {
    let power = 50 // Base power
    
    // Experience adds power
    const experience = profile?.experience_years || 0
    power += Math.min(experience * 5, 25)
    
    // Skills relevance
    const skills = profile?.skills || []
    const demandSkills = ['React', 'Python', 'AWS', 'Kubernetes', 'TypeScript']
    const matchedSkills = skills.filter(skill => demandSkills.includes(skill))
    power += matchedSkills.length * 3
    
    // Market conditions
    power += 15 // Current tight job market
    
    // Multiple offers boost power significantly
    // power += multipleOffers ? 20 : 0
    
    return {
      score: Math.min(power, 95),
      level: power >= 80 ? 'high' : power >= 60 ? 'moderate' : 'low',
      factors: [
        `${experience} years experience`,
        `${matchedSkills.length} in-demand skills`,
        'Strong job market'
      ]
    }
  }

  // ======================
  // NEGOTIATION STRATEGIES
  // ======================
  
  const generateNegotiationAdvice = (marketData, app, profile) => {
    const powerLevel = marketData.negotiationPower.level
    
    const strategies = {
      opening: {
        high: "You have strong negotiation power. Start with a confident ask 15-20% above the median market rate.",
        moderate: "You have moderate negotiation power. Start with an ask 10-15% above the median market rate.",
        low: "Build your case carefully. Start with an ask 5-10% above the median market rate and focus on value."
      },
      timing: {
        best: "Best time to negotiate is after receiving the offer but before accepting. You typically have 1 week.",
        avoid: "Avoid negotiating during the interview process or after you've already accepted."
      },
      tactics: generateNegotiationTactics(powerLevel, marketData),
      scripts: generateNegotiationScripts(marketData, app),
      leverage: generateLeveragePoints(marketData, profile)
    }

    return strategies
  }

  const generateNegotiationTactics = (powerLevel, marketData) => {
    const baseTactics = [
      {
        title: "Anchor High",
        description: "Start with a number higher than your target to create room for compromise",
        example: `Start at $${(marketData.baseSalary.p75 * 1.1).toLocaleString()} to land at $${marketData.baseSalary.p75.toLocaleString()}`
      },
      {
        title: "Bundle Compensation",
        description: "Don't just focus on base salary - consider total compensation package",
        example: "If they can't move on base salary, ask for signing bonus, equity, or additional PTO"
      },
      {
        title: "Use Market Data",
        description: "Reference specific market data to justify your ask",
        example: `Based on market research, the typical range for this role is $${marketData.baseSalary.p25.toLocaleString()} - $${marketData.baseSalary.p75.toLocaleString()}`
      }
    ]

    if (powerLevel === 'high') {
      baseTactics.push({
        title: "Multiple Offers Strategy",
        description: "Leverage competing offers to create urgency and justify higher compensation",
        example: "I have another offer that expires Friday, but I'd prefer to work here if we can match the compensation"
      })
    }

    return baseTactics
  }

  const generateNegotiationScripts = (marketData, app) => {
    return {
      initial: `Thank you for the offer! I'm very excited about the ${app.role} position at ${app.company}. Based on my research and experience, I was hoping we could discuss the compensation package.`,
      
      salaryAsk: `Looking at market data for ${app.role} positions in ${app.location}, I see the typical range is $${marketData.baseSalary.p25.toLocaleString()} - $${marketData.baseSalary.p75.toLocaleString()}. Given my ${marketData.negotiationPower.factors.join(', ')}, I was hoping we could target the upper end of that range.`,
      
      flexibility: "I'm flexible on how we structure this - whether through base salary, signing bonus, equity, or additional benefits. What matters most is finding a package that reflects the value I'll bring to the team.",
      
      closing: "I'm really excited about this opportunity and believe I can make a significant impact. Can we work together to find a compensation package that works for both of us?",
      
      counterOffer: "I appreciate you working with me on this. While I understand the constraints, is there any flexibility in [specific area like signing bonus, equity, start date, etc.]?"
    }
  }

  const generateLeveragePoints = (marketData, profile) => {
    return [
      {
        category: "Market Position",
        points: [
          `Market rate for this role is $${marketData.baseSalary.median.toLocaleString()}`,
          `${marketData.marketTrends.changePercent}% salary increase trend this year`,
          `${marketData.marketTrends.demandLevel} demand for this skillset`
        ]
      },
      {
        category: "Your Value",
        points: [
          `${profile?.experience_years || 3} years relevant experience`,
          `Specialized skills: ${(profile?.skills || []).slice(0, 3).join(', ')}`,
          "Track record of successful project delivery"
        ]
      },
      {
        category: "Total Package",
        points: [
          "Consider equity value and vesting schedule",
          "Factor in health benefits and 401k matching",
          "Account for PTO, flexible work, and other perks"
        ]
      }
    ]
  }

  // ======================
  // OFFER EVALUATION
  // ======================
  
  const evaluateOffer = (offer, marketData) => {
    const baseSalary = parseInt(offer.baseSalary) || 0
    const bonus = parseInt(offer.bonus) || 0
    const totalCash = baseSalary + bonus

    const evaluation = {
      baseSalaryAnalysis: {
        offered: baseSalary,
        market: marketData.baseSalary.median,
        percentile: calculatePercentile(baseSalary, marketData.baseSalary),
        verdict: getVerdictForComponent(baseSalary, marketData.baseSalary.median)
      },
      totalCompensation: {
        offered: totalCash,
        market: marketData.totalCompensation.median,
        percentile: calculatePercentile(totalCash, marketData.totalCompensation),
        verdict: getVerdictForComponent(totalCash, marketData.totalCompensation.median)
      },
      negotiationRecommendation: generateNegotiationRecommendation(offer, marketData),
      improvementAreas: identifyImprovementAreas(offer, marketData)
    }

    return evaluation
  }

  const calculatePercentile = (value, marketRange) => {
    if (value <= marketRange.p10) return 10
    if (value <= marketRange.p25) return 25
    if (value <= marketRange.median) return 50
    if (value <= marketRange.p75) return 75
    if (value <= marketRange.p90) return 90
    return 95
  }

  const getVerdictForComponent = (offered, market) => {
    const ratio = offered / market
    if (ratio >= 1.15) return { rating: 'excellent', color: 'text-green-600', message: 'Above market rate' }
    if (ratio >= 1.05) return { rating: 'good', color: 'text-blue-600', message: 'Competitive with market' }
    if (ratio >= 0.95) return { rating: 'fair', color: 'text-yellow-600', message: 'At market rate' }
    return { rating: 'low', color: 'text-red-600', message: 'Below market rate' }
  }

  const generateNegotiationRecommendation = (offer, marketData) => {
    const baseSalary = parseInt(offer.baseSalary) || 0
    const marketMedian = marketData.baseSalary.median
    
    if (baseSalary < marketMedian * 0.9) {
      return {
        priority: 'high',
        message: 'Strong negotiation recommended - offer is significantly below market',
        suggestedAsk: Math.round(marketData.baseSalary.p75),
        strategy: 'Focus on base salary increase with market data as justification'
      }
    } else if (baseSalary < marketMedian) {
      return {
        priority: 'medium',
        message: 'Moderate negotiation recommended - room for improvement',
        suggestedAsk: Math.round(marketData.baseSalary.median * 1.1),
        strategy: 'Ask for modest base increase or enhance other components'
      }
    } else {
      return {
        priority: 'low',
        message: 'Offer is competitive - negotiate other components if desired',
        suggestedAsk: baseSalary,
        strategy: 'Focus on equity, signing bonus, or benefits if needed'
      }
    }
  }

  const identifyImprovementAreas = (offer, marketData) => {
    const areas = []
    const baseSalary = parseInt(offer.baseSalary) || 0
    
    if (baseSalary < marketData.baseSalary.median) {
      areas.push({
        component: 'Base Salary',
        current: `$${baseSalary.toLocaleString()}`,
        target: `$${marketData.baseSalary.median.toLocaleString()}`,
        improvement: `+$${(marketData.baseSalary.median - baseSalary).toLocaleString()}`
      })
    }

    if (!offer.equity || offer.equity === '') {
      areas.push({
        component: 'Equity',
        current: 'Not specified',
        target: 'Standard equity package',
        improvement: 'Request equity details'
      })
    }

    if (!offer.bonus || parseInt(offer.bonus) < baseSalary * 0.1) {
      areas.push({
        component: 'Bonus',
        current: `$${(parseInt(offer.bonus) || 0).toLocaleString()}`,
        target: `$${Math.round(baseSalary * 0.15).toLocaleString()} (15%)`,
        improvement: `+$${Math.round(baseSalary * 0.15 - (parseInt(offer.bonus) || 0)).toLocaleString()}`
      })
    }

    return areas
  }

  // ======================
  // EFFECTS
  // ======================
  
  useEffect(() => {
    if (application && userProfile) {
      setLoading(true)
      
      setTimeout(() => {
        const market = generateMarketData(application, userProfile)
        const advice = generateNegotiationAdvice(market, application, userProfile)
        
        setMarketData(market)
        setNegotiationAdvice(advice)
        setLoading(false)
      }, 1500)
    }
  }, [application, userProfile])

  useEffect(() => {
    if (marketData && (userOffer.baseSalary || userOffer.bonus)) {
      const evaluation = evaluateOffer(userOffer, marketData)
      setOfferEvaluation(evaluation)
    } else {
      setOfferEvaluation(null)
    }
  }, [userOffer, marketData])

  // ======================
  // RENDER COMPONENT
  // ======================
  
  if (!application) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Salary Negotiation Assistant</h3>
            <p className="text-sm text-gray-600">Market data and negotiation strategies for {application.role}</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Analyzing market data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Market Data Overview */}
      {marketData && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Market Analysis</h4>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Base Salary Range</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>10th percentile:</span>
                  <span className="font-medium">${marketData.baseSalary.p10.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>25th percentile:</span>
                  <span className="font-medium">${marketData.baseSalary.p25.toLocaleString()}</span>
                </div>
                <div className="flex justify-between bg-green-100 px-2 py-1 rounded">
                  <span className="font-medium">Median:</span>
                  <span className="font-bold text-green-600">${marketData.baseSalary.median.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>75th percentile:</span>
                  <span className="font-medium">${marketData.baseSalary.p75.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>90th percentile:</span>
                  <span className="font-medium">${marketData.baseSalary.p90.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Your Negotiation Power</h5>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    marketData.negotiationPower.level === 'high' ? 'bg-green-100 text-green-700' :
                    marketData.negotiationPower.level === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {marketData.negotiationPower.score}/100 - {marketData.negotiationPower.level}
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {marketData.negotiationPower.factors.map((factor, index) => (
                    <li key={index}>• {factor}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Market Trends</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📈 Salaries trending {marketData.marketTrends.direction} {marketData.marketTrends.changePercent}%</div>
                  <div>🔥 Demand: {marketData.marketTrends.demandLevel}</div>
                  <div>⚖️ Competition: {marketData.marketTrends.competitionLevel}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Company Factor: {marketData.companyFactor.type}</h5>
            <div className="text-sm text-gray-600">
              Salary multiplier: {marketData.companyFactor.salaryMultiplier}x | 
              Equity value: {marketData.companyFactor.equityValue} | 
              Benefits: {marketData.companyFactor.benefits}
            </div>
          </div>
        </div>
      )}

      {/* Offer Evaluation */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">💰 Evaluate Your Offer</h4>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
              <input
                type="number"
                value={userOffer.baseSalary}
                onChange={(e) => setUserOffer(prev => ({ ...prev, baseSalary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Enter base salary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Bonus</label>
              <input
                type="number"
                value={userOffer.bonus}
                onChange={(e) => setUserOffer(prev => ({ ...prev, bonus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Enter annual bonus"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equity Value (Annual)</label>
              <input
                type="text"
                value={userOffer.equity}
                onChange={(e) => setUserOffer(prev => ({ ...prev, equity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., $50,000 or 0.5%"
              />
            </div>
          </div>

          {offerEvaluation && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Offer Analysis</h5>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base Salary:</span>
                    <span className={`text-sm font-medium ${offerEvaluation.baseSalaryAnalysis.verdict.color}`}>
                      {offerEvaluation.baseSalaryAnalysis.percentile}th percentile
                    </span>
                  </div>
                  
                  <div className="bg-white rounded p-3">
                    <div className={`font-medium mb-1 ${offerEvaluation.negotiationRecommendation.priority === 'high' ? 'text-red-600' : 
                      offerEvaluation.negotiationRecommendation.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {offerEvaluation.negotiationRecommendation.message}
                    </div>
                    <div className="text-sm text-gray-600">
                      {offerEvaluation.negotiationRecommendation.strategy}
                    </div>
                  </div>
                </div>
              </div>

              {offerEvaluation.improvementAreas.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Improvement Areas</h5>
                  <div className="space-y-2">
                    {offerEvaluation.improvementAreas.map((area, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{area.component}</div>
                        <div className="text-gray-600">
                          Current: {area.current} → Target: {area.target} ({area.improvement})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Negotiation Scripts */}
      {negotiationAdvice && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">🗣️ Negotiation Scripts</h4>
          
          <div className="space-y-4">
            {Object.entries(negotiationAdvice.scripts).map(([type, script]) => (
              <div key={type} className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2 capitalize">{type.replace(/([A-Z])/g, ' $1')}</h5>
                <p className="text-sm text-gray-700 italic">"{script}"</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Negotiation Tactics</h5>
              <div className="space-y-3">
                {negotiationAdvice.tactics.map((tactic, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="font-medium text-gray-900 mb-1">{tactic.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{tactic.description}</div>
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      Example: {tactic.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Your Leverage Points</h5>
              <div className="space-y-3">
                {negotiationAdvice.leverage.map((category, index) => (
                  <div key={index}>
                    <div className="font-medium text-gray-900 mb-2">{category.category}</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {category.points.map((point, pointIndex) => (
                        <li key={pointIndex}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}