<template>
  <div class="admin-overview">
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-sub">Overzicht van kenwa.nl</p>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div v-for="stat in statItems" :key="stat.label" class="stat-card">
        <div class="stat-top">
          <span class="stat-label">{{ stat.label }}</span>
          <div class="stat-icon" :style="{ color: stat.color, background: stat.bg }" v-html="stat.icon" />
        </div>
        <div class="stat-bottom">
          <span class="stat-value">{{ stat.value }}</span>
          <span v-if="stat.trend" class="stat-trend" :class="stat.trend > 0 ? 'trend-up' : 'trend-neutral'">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }} deze week
          </span>
        </div>
      </div>
    </div>

    <div class="two-col">
      <!-- Activity Feed -->
      <div class="feed-card">
        <div class="card-header">
          <h2 class="card-title">Recente activiteit</h2>
        </div>
        <div v-if="activity.length === 0" class="feed-empty">Nog geen activiteit</div>
        <div v-else class="feed-list">
          <div v-for="(item, i) in activity.slice(0, 12)" :key="i" class="feed-item">
            <div class="feed-dot" :class="'dot-' + item.type" />
            <div class="feed-body">
              <span class="feed-text">{{ item.label }}</span>
              <span class="feed-time">{{ timeAgo(item.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions + Alerts -->
      <div class="side-col">
        <!-- Alerts -->
        <div v-if="alerts.length > 0" class="alerts-card">
          <div class="card-header">
            <h2 class="card-title">Meldingen</h2>
            <button class="link-btn" @click="dismissAlerts">Alles gelezen</button>
          </div>
          <div v-for="alert in alerts.slice(0, 5)" :key="alert.id" class="alert-item" :class="'alert-' + alert.severity">
            <div class="alert-dot" />
            <div class="alert-body">
              <span class="alert-title">{{ alert.title }}</span>
              <span v-if="alert.message" class="alert-msg">{{ alert.message }}</span>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="quick-card">
          <h2 class="card-title">Snelle acties</h2>
          <div class="quick-list">
            <NuxtLink to="/admin/users" class="quick-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Gebruiker toevoegen
            </NuxtLink>
            <NuxtLink to="/admin/blog/create" class="quick-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Blog schrijven
            </NuxtLink>
            <NuxtLink to="/admin/logs" class="quick-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Logs bekijken
            </NuxtLink>
            <a href="/api/admin/users/export" class="quick-item" target="_blank">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Gebruikers exporteren
            </a>
          </div>
        </div>

        <!-- Audit log preview -->
        <div v-if="auditLogs.length > 0" class="audit-card">
          <div class="card-header">
            <h2 class="card-title">Audit log</h2>
          </div>
          <div v-for="log in auditLogs.slice(0, 5)" :key="log.id" class="audit-item">
            <span class="audit-text">{{ log.adminName }}: {{ log.action }} <strong v-if="log.targetName">{{ log.targetName }}</strong></span>
            <span class="audit-time">{{ timeAgo(log.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

const { data: overview } = await useAsyncData('admin-overview', () => $fetch('/api/admin/overview'))
const { data: activityData } = await useAsyncData('admin-activity', () => $fetch('/api/admin/activity'))
const { data: auditData } = await useAsyncData('admin-audit', () => $fetch('/api/admin/audit?limit=10'))
const { data: alertsData, refresh: refreshAlerts } = await useAsyncData('admin-alerts', () => $fetch('/api/admin/alerts?unread=true'))

const stats = computed(() => overview.value?.stats)
const trends = computed(() => (overview.value as any)?.trends)
const activity = computed(() => (activityData.value as any)?.activity || [])
const auditLogs = computed(() => (auditData.value as any)?.logs || [])
const alerts = computed(() => (alertsData.value as any)?.alerts || [])

const statItems = computed(() => [
  {
    label: 'Gebruikers', value: stats.value?.users ?? 0, color: '#6366f1', bg: 'rgba(99,102,241,0.1)',
    trend: trends.value?.usersThisWeek || 0,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>'
  },
  {
    label: 'Locaties', value: stats.value?.locations ?? 0, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
  },
  {
    label: 'Deelverzoeken', value: stats.value?.shares ?? 0, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    trend: trends.value?.sharesThisWeek || 0,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/></svg>'
  },
  {
    label: 'Paginaweergaven', value: stats.value?.pageViews ?? 0, color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
  },
  {
    label: 'Deelgebruik', value: stats.value?.shareUses ?? 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg>'
  }
])

function timeAgo (dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Zojuist'
  if (mins < 60) return `${mins}m geleden`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}u geleden`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d geleden`
  return new Date(dateStr).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

async function dismissAlerts () {
  await $fetch('/api/admin/alerts', { method: 'POST', body: { markAllRead: true } })
  await refreshAlerts()
}
</script>

<style scoped lang="scss">
.admin-overview { max-width: 1100px; }

.page-header { margin-bottom: 1.75rem; }
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 0.85rem;
  padding: 1.1rem 1.2rem;
  border: 1px solid #f1f5f9;
}

.stat-top {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;
}

.stat-label { font-size: 0.75rem; font-weight: 500; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.03em; }

.stat-icon {
  width: 1.85rem; height: 1.85rem; border-radius: 0.45rem;
  display: flex; align-items: center; justify-content: center;
  :deep(svg) { width: 0.95rem; height: 0.95rem; }
}

.stat-bottom { display: flex; align-items: baseline; gap: 0.5rem; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #0f172a; line-height: 1; }

.stat-trend {
  font-size: 0.72rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 0.3rem;
}
.trend-up { color: #16a34a; background: rgba(22,163,74,0.08); }
.trend-neutral { color: #94a3b8; background: rgba(148,163,184,0.1); }

/* ── Two column ── */
.two-col {
  display: grid; grid-template-columns: 1fr 340px; gap: 1rem; align-items: start;
}
.side-col { display: flex; flex-direction: column; gap: 0.75rem; }

/* ── Cards ── */
.feed-card, .quick-card, .audit-card, .alerts-card {
  background: white; border-radius: 0.85rem; padding: 1.15rem 1.25rem; border: 1px solid #f1f5f9;
}

.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; }
.card-title { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin: 0; }

.link-btn {
  background: none; border: none; color: #6366f1; font-size: 0.78rem; font-weight: 600; cursor: pointer;
  &:hover { text-decoration: underline; }
}

/* ── Feed ── */
.feed-empty { color: #94a3b8; font-size: 0.88rem; padding: 1.5rem 0; text-align: center; }
.feed-list { display: flex; flex-direction: column; }

.feed-item {
  display: flex; gap: 0.75rem; padding: 0.6rem 0;
  border-bottom: 1px solid #f8fafc;
  &:last-child { border: none; }
}

.feed-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; margin-top: 0.4rem; flex-shrink: 0; }
.dot-user_registered { background: #6366f1; }
.dot-share_created { background: #8b5cf6; }
.dot-blog_published { background: #06b6d4; }
.dot-admin_action { background: #f59e0b; }

.feed-body { display: flex; flex-direction: column; min-width: 0; }
.feed-text { font-size: 0.85rem; color: #334155; line-height: 1.35; }
.feed-time { font-size: 0.72rem; color: #94a3b8; margin-top: 0.1rem; }

/* ── Alerts ── */
.alert-item {
  display: flex; gap: 0.6rem; padding: 0.55rem 0;
  border-bottom: 1px solid #f8fafc;
  &:last-child { border: none; }
}
.alert-dot { width: 0.45rem; height: 0.45rem; border-radius: 50%; margin-top: 0.35rem; flex-shrink: 0; }
.alert-info .alert-dot { background: #3b82f6; }
.alert-warning .alert-dot { background: #f59e0b; }
.alert-critical .alert-dot { background: #ef4444; }

.alert-body { display: flex; flex-direction: column; min-width: 0; }
.alert-title { font-size: 0.82rem; font-weight: 600; color: #334155; }
.alert-msg { font-size: 0.75rem; color: #94a3b8; margin-top: 0.1rem; }

/* ── Quick actions ── */
.quick-list { display: flex; flex-direction: column; gap: 0.35rem; }
.quick-item {
  display: flex; align-items: center; gap: 0.65rem;
  padding: 0.6rem 0.75rem; border-radius: 0.55rem;
  text-decoration: none; color: #334155; font-size: 0.85rem; font-weight: 500;
  transition: background 0.12s;
  svg { width: 1rem; height: 1rem; color: #6366f1; flex-shrink: 0; }
  &:hover { background: #f8fafc; color: #6366f1; }
}

/* ── Audit ── */
.audit-item {
  display: flex; flex-direction: column; padding: 0.5rem 0;
  border-bottom: 1px solid #f8fafc;
  &:last-child { border: none; }
}
.audit-text { font-size: 0.82rem; color: #475569; line-height: 1.35; }
.audit-time { font-size: 0.7rem; color: #94a3b8; margin-top: 0.1rem; }

@media (max-width: 820px) {
  .two-col { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
