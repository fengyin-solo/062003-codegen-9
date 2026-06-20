import { GAME_CONFIG } from '../config/gameConfig'

const TL_CFG = GAME_CONFIG.timeline

export function createInitialTimeline() {
  return {
    nodes: [
      {
        id: 'start',
        day: 1,
        type: 'major_event_positive',
        title: '事务所成立',
        description: '五位练习生已就位，三年征途正式开始。',
        data: {},
      },
    ],
    achievementPoints: 0,
    lastMilestoneFans: 0,
    lastMilestoneMoney: 0,
    lastYearReviewed: 0,
    yearlyStats: {},
  }
}

function createNode(type, day, title, description, data = {}) {
  const nodeType = TL_CFG.nodeTypes[type]
  return {
    id: `${type}_${day}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    day,
    type,
    title,
    description,
    data,
    importance: nodeType?.importance || 'medium',
    icon: nodeType?.icon || '📌',
    points: nodeType?.achievementPoints || 0,
  }
}

export function addTimelineNode(timeline, type, day, title, description, data = {}) {
  const node = createNode(type, day, title, description, data)
  return {
    ...timeline,
    nodes: [...timeline.nodes, node],
    achievementPoints: Math.max(0, timeline.achievementPoints + node.points),
  }
}

export function checkFanMilestones(timeline, currentFans, day) {
  const milestones = TL_CFG.fanMilestones
  let newTimeline = timeline
  let newMilestone = null

  for (const milestone of milestones) {
    if (
      currentFans >= milestone.fans &&
      timeline.lastMilestoneFans < milestone.fans
    ) {
      newMilestone = milestone
    }
  }

  if (newMilestone) {
    newTimeline = addTimelineNode(
      newTimeline,
      'fan_milestone',
      day,
      `粉丝突破 ${newMilestone.label}`,
      `粉丝数达到 ${currentFans.toLocaleString()}，达成「${newMilestone.label}」成就！`,
      { fans: currentFans, milestone: newMilestone.label }
    )
    newTimeline = { ...newTimeline, lastMilestoneFans: newMilestone.fans }
  }

  return { timeline: newTimeline, hitMilestone: !!newMilestone }
}

export function checkMoneyMilestones(timeline, currentMoney, day) {
  const milestones = TL_CFG.moneyMilestones
  let newTimeline = timeline
  let newMilestone = null

  for (const milestone of milestones) {
    if (
      currentMoney >= milestone.money &&
      timeline.lastMilestoneMoney < milestone.money
    ) {
      newMilestone = milestone
    }
  }

  if (newMilestone) {
    newTimeline = addTimelineNode(
      newTimeline,
      'money_milestone',
      day,
      `资金突破 ${newMilestone.label}`,
      `资金达到 ¥${currentMoney.toLocaleString()}，达成「${newMilestone.label}」成就！`,
      { money: currentMoney, milestone: newMilestone.label }
    )
    newTimeline = { ...newTimeline, lastMilestoneMoney: newMilestone.money }
  }

  return { timeline: newTimeline, hitMilestone: !!newMilestone }
}

export function generateYearlyReview(state, year) {
  const startDay = (year - 1) * TL_CFG.yearInterval + 1
  const endDay = year * TL_CFG.yearInterval

  const yearNodes = state.timeline.nodes.filter(
    (n) => n.day >= startDay && n.day <= endDay
  )

  const debuts = yearNodes.filter((n) => n.type === 'debut')
  const singles = yearNodes.filter((n) => n.type === 'single_release')
  const positiveEvents = yearNodes.filter((n) => n.type === 'major_event_positive')
  const negativeEvents = yearNodes.filter((n) => n.type === 'major_event_negative')

  const yearGroups = state.groups.filter((g) => g.debutedDay >= startDay && g.debutedDay <= endDay)
  const totalSinglesThisYear = state.groups.reduce((sum, g) => {
    return sum + g.singles.filter((s) => s.day >= startDay && s.day <= endDay).length
  }, 0)

  const startFans = state.timeline.yearlyStats[year - 1]?.endFans || GAME_CONFIG.initial.fans
  const fansGain = state.fans - startFans

  const startMoney = state.timeline.yearlyStats[year - 1]?.endMoney || GAME_CONFIG.initial.money
  const moneyChange = state.money - startMoney

  const activeTrainees = state.trainees.filter((t) => t.status !== 'left').length

  let rating = 'C'
  const score = debuts.length * 30 + totalSinglesThisYear * 10 + Math.floor(fansGain / 1000) * 5 + (moneyChange > 0 ? 20 : -10)
  if (score >= 150) rating = 'S'
  else if (score >= 100) rating = 'A'
  else if (score >= 60) rating = 'B'

  const review = {
    year,
    startDay,
    endDay,
    debutCount: debuts.length,
    groups: yearGroups.map((g) => g.name),
    singleCount: totalSinglesThisYear,
    fansGain,
    endFans: state.fans,
    moneyChange,
    endMoney: state.money,
    activeTrainees,
    groupCount: state.groups.length,
    positiveEventCount: positiveEvents.length,
    negativeEventCount: negativeEvents.length,
    rating,
    score,
    highlights: generateHighlights(debuts, singles, positiveEvents, fansGain, moneyChange),
    lowlights: generateLowlights(negativeEvents, moneyChange),
  }

  return review
}

function generateHighlights(debuts, singles, positiveEvents, fansGain, moneyChange) {
  const highlights = []

  if (debuts.length > 0) {
    highlights.push(`今年有 ${debuts.length} 个组合成功出道！`)
  }
  if (singles.length > 0) {
    highlights.push(`共发行了 ${singles.length} 张单曲。`)
  }
  if (fansGain >= 5000) {
    highlights.push(`粉丝暴涨 ${fansGain.toLocaleString()} 人，人气飙升！`)
  } else if (fansGain > 0) {
    highlights.push(`粉丝稳步增长 ${fansGain.toLocaleString()} 人。`)
  }
  if (moneyChange >= 50000) {
    highlights.push(`盈利 ¥${moneyChange.toLocaleString()}，财务状况优秀！`)
  } else if (moneyChange > 0) {
    highlights.push(`实现盈利 ¥${moneyChange.toLocaleString()}。`)
  }
  if (positiveEvents.length >= 2) {
    highlights.push(`今年好事连连，共发生 ${positiveEvents.length} 件重大正面事件！`)
  }

  if (highlights.length === 0) {
    highlights.push('稳扎稳打，积蓄力量。')
  }

  return highlights
}

function generateLowlights(negativeEvents, moneyChange) {
  const lowlights = []

  if (negativeEvents.length > 0) {
    lowlights.push(`遭遇了 ${negativeEvents.length} 次负面事件冲击。`)
  }
  if (moneyChange < -20000) {
    lowlights.push(`财务亏损 ¥${Math.abs(moneyChange).toLocaleString()}，需要注意成本控制。`)
  } else if (moneyChange < 0) {
    lowlights.push(`出现小幅亏损，需谨慎经营。`)
  }

  return lowlights
}

export function checkYearlyReview(state) {
  const currentDay = state.day
  const yearInterval = TL_CFG.yearInterval
  const currentYear = Math.floor(currentDay / yearInterval)

  if (currentYear > state.timeline.lastYearReviewed && currentYear > 0) {
    const review = generateYearlyReview(state, currentYear)
    return {
      needsReview: true,
      year: currentYear,
      review,
    }
  }

  return { needsReview: false }
}

export function applyYearlyReview(timeline, review, day) {
  const newTimeline = addTimelineNode(
    timeline,
    'year_review',
    day,
    `第 ${review.year} 年回顾 · 评级 ${review.rating}`,
    `年度评分 ${review.score} 分，评级 ${review.rating}。${review.highlights[0] || ''}`,
    { review }
  )

  return {
    ...newTimeline,
    lastYearReviewed: review.year,
    yearlyStats: {
      ...newTimeline.yearlyStats,
      [review.year]: {
        endFans: review.endFans,
        endMoney: review.endMoney,
        rating: review.rating,
        score: review.score,
      },
    },
  }
}

export function getOpportunityBonus(achievementPoints) {
  const bonus = TL_CFG.opportunityBonus

  const salesMultiplier = Math.min(
    1 + achievementPoints * bonus.salesMultiplierPerPoint,
    bonus.maxMultiplier
  )

  const fansMultiplier = Math.min(
    1 + achievementPoints * bonus.fansMultiplierPerPoint,
    bonus.maxMultiplier
  )

  const positiveEventBoost = Math.min(
    achievementPoints * bonus.positiveEventBoostPerPoint,
    bonus.maxPositiveEventBoost
  )

  return {
    salesMultiplier,
    fansMultiplier,
    positiveEventBoost,
  }
}

export function getTimelineNodesByYear(timeline) {
  const byYear = {}
  for (const node of timeline.nodes) {
    const year = Math.ceil(node.day / TL_CFG.yearInterval)
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(node)
  }
  return byYear
}

export function getTimelineHighlights(timeline, limit = 5) {
  return [...timeline.nodes]
    .filter((n) => n.importance === 'high')
    .sort((a, b) => b.day - a.day)
    .slice(0, limit)
}
