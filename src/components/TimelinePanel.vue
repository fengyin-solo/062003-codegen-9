<template>
  <div class="timeline-panel card">
    <div class="panel-header">
      <h3>📜 世界观时间线</h3>
      <div class="achievement-badge">
        ⭐ {{ achievementPoints }}
      </div>
    </div>

    <div class="bonus-info">
      <div class="bonus-item">
        <span class="bonus-label">销量加成</span>
        <span class="bonus-value success">+{{ salesBonus }}%</span>
      </div>
      <div class="bonus-item">
        <span class="bonus-label">粉丝加成</span>
        <span class="bonus-value success">+{{ fansBonus }}%</span>
      </div>
    </div>

    <div class="filter-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'highlights' }"
        @click="activeTab = 'highlights'"
      >
        大事记
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部
      </button>
    </div>

    <div class="timeline-list">
      <div v-if="displayNodes.length === 0" class="empty">暂无时间线记录</div>
      <div
        v-for="node in displayNodes"
        :key="node.id"
        class="timeline-node"
        :class="'importance-' + node.importance"
      >
        <div class="node-icon">{{ node.icon }}</div>
        <div class="node-content">
          <div class="node-head">
            <span class="node-title">{{ node.title }}</span>
            <span class="node-day">第 {{ node.day }} 天</span>
          </div>
          <div class="node-desc">{{ node.description }}</div>
          <div v-if="node.points !== 0" class="node-points" :class="node.points > 0 ? 'positive' : 'negative'">
            {{ node.points > 0 ? '+' : '' }}{{ node.points }} 成就点
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getOpportunityBonus } from '../utils/timeline'

const props = defineProps({
  timeline: Object,
})

const activeTab = ref('highlights')

const achievementPoints = computed(() => {
  return props.timeline?.achievementPoints || 0
})

const bonus = computed(() => {
  return getOpportunityBonus(achievementPoints.value)
})

const salesBonus = computed(() => {
  return Math.round((bonus.value.salesMultiplier - 1) * 100)
})

const fansBonus = computed(() => {
  return Math.round((bonus.value.fansMultiplier - 1) * 100)
})

const displayNodes = computed(() => {
  if (!props.timeline?.nodes) return []
  let nodes = [...props.timeline.nodes].sort((a, b) => b.day - a.day)

  if (activeTab.value === 'highlights') {
    nodes = nodes.filter((n) => n.importance === 'high')
  }

  return nodes
})
</script>

<style scoped>
.timeline-panel h3 {
  margin: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.achievement-badge {
  background: linear-gradient(135deg, var(--accent), #7c3aed);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.bonus-info {
  display: flex;
  gap: 1rem;
  padding: 0.6rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.bonus-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bonus-label {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.bonus-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.bonus-value.success {
  color: var(--success);
}

.filter-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: var(--accent);
}

.tab-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.timeline-list {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty {
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
}

.timeline-node {
  display: flex;
  gap: 0.6rem;
  padding: 0.6rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 3px solid var(--border);
}

.timeline-node.importance-high {
  border-left-color: var(--accent);
}

.timeline-node.importance-medium {
  border-left-color: var(--success);
}

.timeline-node.importance-low {
  border-left-color: var(--text-muted);
  opacity: 0.8;
}

.node-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.node-content {
  flex: 1;
  min-width: 0;
}

.node-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}

.node-title {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.node-day {
  font-size: 0.7rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.node-desc {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.node-points {
  font-size: 0.72rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.node-points.positive {
  color: var(--success);
}

.node-points.negative {
  color: var(--danger);
}
</style>
