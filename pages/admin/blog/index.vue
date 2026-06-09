<template>
  <div class="blog-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Blogbeheer</h1>
        <p class="page-sub">{{ posts.length }} artikelen</p>
      </div>
      <div class="header-btns">
        <button class="btn btn-translate" :disabled="translating" @click="translateAll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/>
          </svg>
          {{ translating ? 'Vertalen...' : 'Vertaal alle blogs' }}
        </button>
        <NuxtLink to="/admin/blog/create" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nieuw artikel
        </NuxtLink>
      </div>
    </div>

    <div class="toolbar">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="search" type="text" placeholder="Zoek op titel..." />
      </div>
      <div class="filter-chips">
        <button v-for="s in ['all', 'published', 'draft']" :key="s" class="chip" :class="{ active: statusFilter === s }" @click="statusFilter = s">
          {{ s === 'all' ? 'Alle' : s === 'published' ? 'Gepubliceerd' : 'Concept' }}
        </button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Status</th>
              <th>Datum</th>
              <th class="th-actions">Acties</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in filteredPosts" :key="post.id">
              <td>
                <NuxtLink :to="`/admin/blog/${post.id}`" class="post-title">{{ post.title }}</NuxtLink>
              </td>
              <td>
                <span class="status-badge" :class="post.status === 'published' ? 'status-published' : 'status-draft'">
                  {{ post.status === 'published' ? 'Gepubliceerd' : 'Concept' }}
                </span>
              </td>
              <td class="td-date">{{ formatDate(post.createdAt) }}</td>
              <td>
                <div class="action-btns">
                  <NuxtLink :to="`/admin/blog/${post.id}`" class="action-btn action-edit" title="Bewerken">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </NuxtLink>
                  <button class="action-btn action-delete" :disabled="deletingId === post.id" title="Verwijderen" @click="deletePost(post.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPosts.length === 0">
              <td colspan="4" class="empty-row">Geen artikelen gevonden</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-footer">{{ filteredPosts.length }} van {{ posts.length }} artikelen</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

const { data, refresh } = await useAsyncData('admin-blog', () => $fetch('/api/admin/blog'))
const posts = computed(() => (data.value as any)?.posts || data.value || [])

const deletingId = ref<string | null>(null)
const translating = ref(false)
const search = ref('')
const statusFilter = ref('all')

const filteredPosts = computed(() => {
  let result = posts.value
  if (statusFilter.value !== 'all') {
    result = result.filter((p: any) => p.status === statusFilter.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter((p: any) => p.title?.toLowerCase().includes(q))
  }
  return result
})

function formatDate (date: string) {
  return new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function translateAll () {
  if (!confirm('Alle blogs zonder Engelse vertaling worden nu automatisch vertaald via AI. Dit kan even duren. Doorgaan?')) return
  try {
    translating.value = true
    const result = await $fetch<{ total: number; translated: number; failed: number }>('/api/admin/blog/translate-all', { method: 'POST' })
    if (result.total === 0) {
      alert('Alle blogs hebben al een Engelse vertaling.')
    } else {
      alert(`Klaar! ${result.translated} van ${result.total} blogs vertaald.${result.failed ? ` ${result.failed} mislukt.` : ''}`)
    }
    await refresh()
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'Vertalen mislukt. Controleer of de OpenAI API-sleutel is ingesteld.')
  } finally {
    translating.value = false
  }
}

async function deletePost (id: string) {
  if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return
  try {
    deletingId.value = id
    await $fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Er is een fout opgetreden')
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped lang="scss">
.blog-page { max-width: 1100px; }
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
}
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

.header-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.55rem 1.1rem; border: none; border-radius: 0.6rem; cursor: pointer; font-size: 0.85rem; font-weight: 600; text-decoration: none; transition: all 0.15s; &:disabled { opacity: 0.5; cursor: not-allowed; } }
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; box-shadow: 0 2px 10px rgba(99,102,241,0.2);
  &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
}
.btn-translate {
  background: rgba(16,185,129,0.1); color: #059669; border: 1px solid rgba(16,185,129,0.2);
  &:hover:not(:disabled) { background: rgba(16,185,129,0.18); }
}

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
.th-actions { text-align: right; }

.post-title { color: #0f172a; font-weight: 600; text-decoration: none; &:hover { color: #6366f1; } }
.td-date { white-space: nowrap; color: #94a3b8; font-size: 0.82rem; }

.status-badge { display: inline-flex; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
.status-published { background: rgba(16,185,129,0.1); color: #10b981; }
.status-draft { background: rgba(245,158,11,0.1); color: #f59e0b; }

.action-btns { display: flex; gap: 0.3rem; justify-content: flex-end; }
.action-btn {
  width: 1.85rem; height: 1.85rem; border-radius: 0.4rem; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.12s; text-decoration: none;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.action-edit { background: rgba(99,102,241,0.08); color: #6366f1; &:hover { background: rgba(99,102,241,0.16); } }
.action-delete { background: rgba(239,68,68,0.06); color: #ef4444; &:hover:not(:disabled) { background: rgba(239,68,68,0.14); } }

.empty-row { text-align: center; color: #94a3b8; padding: 2rem 1rem !important; }
.table-footer { padding: 0.6rem 0.85rem; font-size: 0.78rem; color: #94a3b8; border-top: 1px solid #f1f5f9; }
</style>
