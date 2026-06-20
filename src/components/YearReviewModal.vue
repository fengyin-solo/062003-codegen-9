<template>
  <div class="modal-overlay">
    <div class="modal card">
      <div class="modal-header">
        <h3>📅 第 {{ review.year }} 年度回顾</h3>
        <div class="rating-badge" :class="'rating-' + review.rating">
          {{ review.rating }}
        </div>
      </div>

      <p class="subtitle">第 {{ review.startDay }} 天 - 第 {{ review.endDay }} 天</p>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎤</div>
          <div class="stat-info">
            <div class="stat-value">{{ review.debutCount }}</div>
            <div class="stat-label">新出道组合</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💿</div>
          <div class="stat-info">
            <div class="stat-value">{{ review.singleCount }}</div>
            <div class="stat-label">发行单曲</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-value" :class="review.fansGain >= 0 ? 'positive' : 'negative'">
              {{ review.fansGain >= 0 ? '+' : '' }}{{ review.fansGain.toLocaleString() }}
            </div>
            <div class="stat-label">粉丝增长</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <div class="stat-value" :class="review.moneyChange >= 0 ? 'positive' : 'negative'">
              {{ review.moneyChange >= 0 ? '+' : '' }}¥{{ review.moneyChange.toLocaleString() }}
            </div>
            <div class="stat-label">资金变动</div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-row">
          <span class="info-label">当前组合数</span>
          <span class="info-value">{{ review.groupCount }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">在籍练习生</span>
          <span class="info-value">{{ review.activeTrainees }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">年度评分</span>
          <span class="info-value">{{ review.score }} 分</span>
        </div>
        <div class="info-row">
          <span class="info-label">正面事件</span>
          <span class="info-value success">{{ review.positiveEventCount }} 件</span>
        </div>
        <div class="info-row">
          <span class="info-label">负面事件</span>
          <span class="info-value danger">{{ review.negativeEventCount }} 件</span>
        </div>
      </div>

      <div v-if="review.groups.length > 0" class="groups-section">
        <h4>✨ 今年出道</h4>
        <div class="group-tags">
          <span v-for="g in review.groups" :key="g" class="group-tag">{{ g }}</span>
        </div>
      </div>

      <div class="highlights-section">
        <h4>🌟 年度亮点</h4>
        <ul class="highlight-list">
          <li v-for="(h, i) in review.highlights" :key="i" class="highlight-item positive">
            {{ h }}
          </li>
        </ul>
      </div>

      <div v-if="review.lowlights.length > 0" class="lowlights-section">
        <h4>⚠️ 需要改进</h4>
        <ul class="highlight-list">
          <li v-for="(l, i) in review.lowlights" :key="i" class="highlight-item negative">
            {{ l }}
          </li>
        </ul>
      </div>

      <div class="action-section">
        <button class="btn primary" @click="$emit('confirm')">
          继续经营
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  review: Object,
})
defineEmits(['confirm'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
  padding: 1rem;
}

.modal {
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.modal-header h3 {
  margin: 0;
}

.rating-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.rating-badge.rating-S {
  background: linear-gradient(135deg, #f39c12, #e74c3c);
  box-shadow: 0 0 20px rgba(243, 156, 18, 0.4);
}

.rating-badge.rating-A {
  background: linear-gradient(135deg, #9b59c4, #3498db);
}

.rating-badge.rating-B {
  background: linear-gradient(135deg, #27ae60, #16a085);
}

.rating-badge.rating-C {
  background: linear-gradient(135deg, #7f8c8d, #95a5a6);
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.stat-value.positive {
  color: var(--success);
}

.stat-value.negative {
  color: var(--danger);
}

.stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.info-section {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.85rem;
}

.info-label {
  color: var(--text-muted);
}

.info-value {
  font-weight: 500;
}

.info-value.success {
  color: var(--success);
}

.info-value.danger {
  color: var(--danger);
}

.groups-section,
.highlights-section,
.lowlights-section {
  margin-bottom: 1rem;
}

.groups-section h4,
.highlights-section h4,
.lowlights-section h4 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.group-tag {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.highlight-list {
  list-style: none;
  padding: 0;
}

.highlight-item {
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
}

.highlight-item.positive {
  background: var(--success-soft);
  color: var(--success);
}

.highlight-item.negative {
  background: var(--danger-soft);
  color: var(--danger);
}

.action-section {
  padding-top: 0.5rem;
}

.action-section .btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
}
</style>
