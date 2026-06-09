<template>
  <div class="logs-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Systeem Logs</h1>
        <p class="page-sub">E-mail en systeem logs voor debugging</p>
      </div>
      <button class="btn btn-ghost" @click="fetchLogs">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
        </svg>
        Vernieuwen
      </button>
    </div>

    <div class="toolbar">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Zoek in logs..." />
      </div>
      <div class="filter-row">
        <div class="filter-chips">
          <button class="chip" :class="{ active: !filters.errorsOnly }" @click="filters.errorsOnly = false; fetchLogs()">Alle</button>
          <button class="chip" :class="{ active: filters.errorsOnly }" @click="filters.errorsOnly = true; fetchLogs()">Alleen errors</button>
        </div>
        <select v-model="filters.category" class="filter-select" @change="fetchLogs()">
          <option value="">Alle categorieën</option>
          <option value="mail">E-mail</option>
          <option value="auth">Authenticatie</option>
          <option value="db">Database</option>
        </select>
        <select v-model="filters.days" class="filter-select" @change="fetchLogs()">
          <option :value="1">Vandaag</option>
          <option :value="3">3 dagen</option>
          <option :value="7">7 dagen</option>
          <option :value="14">14 dagen</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="status-msg">Logs laden...</div>
    <div v-else-if="error" class="error-box">{{ error }}</div>
    <div v-else-if="filteredLogs.length === 0" class="status-msg">Geen logs gevonden</div>

    <div v-else class="logs-list">
      <div v-for="(log, index) in filteredLogs" :key="index" class="log-entry" :class="log.level">
        <div class="log-header">
          <span class="log-level" :class="log.level">{{ log.level.toUpperCase() }}</span>
          <span class="log-category">{{ log.category }}</span>
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
        </div>
        <div class="log-message">{{ log.message }}</div>
        <div v-if="log.details" class="log-details">
          <button class="toggle-btn" @click="toggleDetails(index)">
            {{ expandedLogs.has(index) ? 'Details verbergen' : 'Details tonen' }}
          </button>
          <pre v-if="expandedLogs.has(index)">{{ JSON.stringify(log.details, null, 2) }}</pre>
        </div>
        <div v-if="log.error" class="log-error">
          <strong>{{ log.error.name }}:</strong> {{ log.error.message }}
          <pre v-if="log.error.stack && expandedLogs.has(index)">{{ log.error.stack }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  category: string
  message: string
  details?: Record<string, unknown>
  error?: { name: string; message: string; stack?: string }
}

const logs = ref<LogEntry[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const expandedLogs = ref(new Set<number>())
const searchQuery = ref('')

const filters = reactive({ errorsOnly: false, category: '', days: 7 })

const filteredLogs = computed(() => {
  if (!searchQuery.value.trim()) return logs.value
  const q = searchQuery.value.toLowerCase()
  return logs.value.filter(l =>
    l.message?.toLowerCase().includes(q) ||
    l.category?.toLowerCase().includes(q)
  )
})

function formatTime (timestamp: string) {
  return new Date(timestamp).toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function toggleDetails (index: number) {
  if (expandedLogs.value.has(index)) { expandedLogs.value.delete(index) } else { expandedLogs.value.add(index) }
  expandedLogs.value = new Set(expandedLogs.value)
}

async function fetchLogs () {
  loading.value = true
  error.value = null
  try {
    const params = new URLSearchParams()
    if (filters.errorsOnly) params.set('errors', 'true')
    if (filters.category) params.set('category', filters.category)
    params.set('days', String(filters.days))
    const response = await $fetch<{ logs: LogEntry[] }>(`/api/admin/logs?${params}`)
    logs.value = response.logs
    expandedLogs.value = new Set()
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.message || 'Kon logs niet laden'
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchLogs() })
</script>

<style scoped lang="scss">
.logs-page { max-width: 1100px; }

.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
}
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

.btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.55rem 1.1rem; border: none; border-radius: 0.6rem; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.15s; }
.btn-ghost { background: white; color: #64748b; border: 1px solid #e2e8f0; &:hover { background: #f8fafc; color: #334155; } }

.toolbar { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
.search-bar {
  display: flex; align-items: center; gap: 0.6rem;
  background: white; border: 1.5px solid #e2e8f0; border-radius: 0.6rem;
  padding: 0.5rem 0.85rem; transition: border-color 0.15s;
  &:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
  svg { color: #94a3b8; flex-shrink: 0; }
  input { flex: 1; border: none; outline: none; font-size: 0.88rem; background: transparent; &::placeholder { color: #cbd5e1; } }
}

.filter-row { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
.filter-chips { display: flex; gap: 0.35rem; }
.chip {
  padding: 0.3rem 0.7rem; border-radius: 999px; border: 1px solid #e2e8f0; background: white;
  font-size: 0.78rem; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.12s;
  &:hover { border-color: #cbd5e1; }
  &.active { background: #6366f1; color: white; border-color: #6366f1; }
}
.filter-select {
  padding: 0.35rem 0.7rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;
  font-size: 0.82rem; background: white; color: #334155;
}

.status-msg { text-align: center; padding: 2rem; color: #94a3b8; font-size: 0.9rem; }
.error-box { padding: 0.85rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.6rem; color: #dc2626; font-size: 0.88rem; }

.logs-list { display: flex; flex-direction: column; gap: 0.4rem; }

.log-entry {
  padding: 0.85rem 1rem; background: white; border-radius: 0.6rem;
  border-left: 3px solid #e2e8f0; border: 1px solid #f1f5f9;
  &.error { border-left-color: #ef4444; background: #fefefe; }
  &.warn { border-left-color: #f59e0b; }
  &.info { border-left-color: #3b82f6; }
}

.log-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; }
.log-level {
  padding: 0.1rem 0.4rem; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  &.error { background: #fee2e2; color: #dc2626; }
  &.warn { background: #fef3c7; color: #d97706; }
  &.info { background: #dbeafe; color: #2563eb; }
}
.log-category { padding: 0.1rem 0.4rem; background: #f1f5f9; border-radius: 0.25rem; font-size: 0.72rem; color: #475569; }
.log-time { font-size: 0.72rem; color: #94a3b8; margin-left: auto; }

.log-message { font-size: 0.85rem; color: #1e293b; line-height: 1.4; }

.log-details { margin-top: 0.5rem; }
.toggle-btn { background: none; border: none; padding: 0; font-size: 0.75rem; color: #6366f1; cursor: pointer; font-weight: 500; &:hover { text-decoration: underline; } }
.log-details pre, .log-error pre {
  margin: 0.35rem 0 0; padding: 0.6rem; background: #f8fafc; border-radius: 0.3rem;
  font-size: 0.72rem; overflow-x: auto; white-space: pre-wrap; word-break: break-word;
}
.log-error {
  margin-top: 0.4rem; padding: 0.4rem 0.6rem; background: #fef2f2; border-radius: 0.3rem;
  font-size: 0.82rem; color: #b91c1c;
}
</style>
