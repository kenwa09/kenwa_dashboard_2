<template>
  <div class="shares-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Deelverzoeken</h1>
        <p class="page-sub">{{ shares.length }} totale verzoeken</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="search" type="text" placeholder="Zoek op naam of locatie..." />
      </div>
      <div class="filter-chips">
        <button
          v-for="s in ['all', 'pending', 'accepted', 'declined']" :key="s"
          class="chip" :class="{ active: statusFilter === s }"
          @click="statusFilter = s"
        >
          {{ s === 'all' ? 'Alle' : s === 'pending' ? 'In afwachting' : s === 'accepted' ? 'Geaccepteerd' : 'Afgewezen' }}
        </button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Eigenaar</th>
              <th>Ontvanger</th>
              <th>Locatie</th>
              <th>Status</th>
              <th>Aangemaakt</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="share in filteredShares" :key="share.id">
              <td><span class="name-cell">{{ findUser(share.ownerId)?.name || 'Onbekend' }}</span></td>
              <td>{{ findUser(share.targetUserId)?.name || share.targetContactName || 'Onbekend' }}</td>
              <td class="td-muted">{{ findLocation(share.locationId)?.label || '—' }}</td>
              <td>
                <span class="status-badge" :class="'status-' + share.status">
                  {{ share.status === 'pending' ? 'In afwachting' : share.status === 'accepted' ? 'Geaccepteerd' : 'Afgewezen' }}
                </span>
              </td>
              <td class="td-date">{{ formatDate(share.createdAt) }}</td>
            </tr>
            <tr v-if="filteredShares.length === 0">
              <td colspan="5" class="empty-row">Geen deelverzoeken gevonden</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-footer">{{ filteredShares.length }} van {{ shares.length }} verzoeken</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

const { data } = await useAsyncData('admin-shares', () => $fetch('/api/admin/shares'))
const shares = computed(() => data.value?.shares || [])
const locations = computed(() => data.value?.locations || [])
const users = computed(() => data.value?.users || [])

const search = ref('')
const statusFilter = ref('all')

const filteredShares = computed(() => {
  let result = shares.value
  if (statusFilter.value !== 'all') {
    result = result.filter((s: any) => s.status === statusFilter.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter((s: any) => {
      const owner = findUser(s.ownerId)
      const target = findUser(s.targetUserId)
      const loc = findLocation(s.locationId)
      return owner?.name?.toLowerCase().includes(q) ||
        target?.name?.toLowerCase().includes(q) ||
        loc?.label?.toLowerCase().includes(q) ||
        s.targetContactName?.toLowerCase()?.includes(q)
    })
  }
  return result
})

function findUser (id: string) { return users.value.find((u: any) => u.id === id) }
function findLocation (id: string) { return locations.value.find((l: any) => l.id === id) }
function formatDate (date: string) {
  return new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped lang="scss">
.shares-page { max-width: 1100px; }
.page-header { margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

.toolbar { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 0.75rem; }
.search-bar {
  display: flex; align-items: center; gap: 0.6rem;
  background: white; border: 1.5px solid #e2e8f0; border-radius: 0.6rem;
  padding: 0.5rem 0.85rem; transition: border-color 0.15s;
  &:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
  svg { color: #94a3b8; flex-shrink: 0; }
  input { flex: 1; border: none; outline: none; font-size: 0.88rem; background: transparent; &::placeholder { color: #cbd5e1; } }
}

.filter-chips { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.chip {
  padding: 0.3rem 0.7rem; border-radius: 999px; border: 1px solid #e2e8f0; background: white;
  font-size: 0.78rem; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.12s;
  &:hover { border-color: #cbd5e1; }
  &.active { background: #6366f1; color: white; border-color: #6366f1; }
}

.table-card { background: white; border-radius: 0.85rem; border: 1px solid #f1f5f9; overflow: hidden; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th {
  text-align: left; padding: 0.7rem 0.85rem; font-size: 0.72rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; background: #fafbfc; border-bottom: 1px solid #f1f5f9;
}
td { padding: 0.7rem 0.85rem; font-size: 0.88rem; border-bottom: 1px solid #f8fafc; }
tbody tr { transition: background 0.1s; &:hover { background: #fafbfe; } &:last-child td { border-bottom: none; } }
.name-cell { font-weight: 600; color: #0f172a; }
.td-muted { color: #64748b; }
.td-date { white-space: nowrap; color: #94a3b8; font-size: 0.82rem; }

.status-badge { display: inline-flex; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
.status-pending { background: rgba(245,158,11,0.1); color: #f59e0b; }
.status-accepted { background: rgba(16,185,129,0.1); color: #10b981; }
.status-declined { background: rgba(239,68,68,0.1); color: #ef4444; }

.empty-row { text-align: center; color: #94a3b8; padding: 2rem 1rem !important; }
.table-footer { padding: 0.6rem 0.85rem; font-size: 0.78rem; color: #94a3b8; border-top: 1px solid #f1f5f9; }

@media (max-width: 640px) { th:nth-child(3), td:nth-child(3) { display: none; } }
</style>
