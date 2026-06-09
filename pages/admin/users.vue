<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Gebruikersbeheer</h1>
        <p class="page-sub">{{ users.length }} geregistreerde accounts</p>
      </div>
      <div class="header-actions">
        <a href="/api/admin/users/export" class="btn btn-ghost" target="_blank">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          CSV
        </a>
        <button class="btn btn-primary" @click="showCreateForm = !showCreateForm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line v-if="!showCreateForm" x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {{ showCreateForm ? 'Annuleren' : 'Nieuw account' }}
        </button>
      </div>
    </div>

    <!-- Create form -->
    <Transition name="slide">
      <div v-if="showCreateForm" class="create-card">
        <h3>Nieuw account aanmaken</h3>
        <form class="create-form" @submit.prevent="createUser">
          <div class="form-row">
            <div class="form-group">
              <label>Naam</label>
              <input v-model="newUser.name" type="text" placeholder="Volledige naam" required />
            </div>
            <div class="form-group">
              <label>E-mail</label>
              <input v-model="newUser.email" type="email" placeholder="email@voorbeeld.nl" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Telefoon</label>
              <input v-model="newUser.phone" type="tel" placeholder="+31 6 12345678" />
            </div>
            <div class="form-group">
              <label>Wachtwoord</label>
              <input v-model="newUser.password" type="password" placeholder="Min. 8 tekens" required />
            </div>
          </div>
          <p v-if="createError" class="error-msg">{{ createError }}</p>
          <button type="submit" class="btn btn-primary" :disabled="creating">
            {{ creating ? 'Bezig...' : 'Account aanmaken' }}
          </button>
        </form>
      </div>
    </Transition>

    <!-- Search + bulk actions -->
    <div class="toolbar">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="search" type="text" placeholder="Zoek op naam, e-mail of telefoon..." />
      </div>
      <Transition name="fade">
        <div v-if="selectedIds.size > 0" class="bulk-bar">
          <span class="bulk-count">{{ selectedIds.size }} geselecteerd</span>
          <button class="btn-sm btn-bulk" @click="bulkAction('block')">Blokkeren</button>
          <button class="btn-sm btn-bulk" @click="bulkAction('unblock')">Deblokkeren</button>
          <button class="btn-sm btn-bulk btn-bulk--danger" @click="bulkAction('delete')">Verwijderen</button>
          <button class="btn-sm btn-bulk--clear" @click="selectedIds.clear()">Deselecteren</button>
        </div>
      </Transition>
    </div>

    <!-- Users table -->
    <div class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="th-check">
                <input type="checkbox" :checked="allSelected" @change="toggleAll" />
              </th>
              <th>Gebruiker</th>
              <th>Rol</th>
              <th>Status</th>
              <th>Privacy</th>
              <th>Aangemeld</th>
              <th class="th-actions">Acties</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" :class="{ 'row-selected': selectedIds.has(user.id) }">
              <td class="td-check">
                <input v-if="user.role !== 'admin'" type="checkbox" :checked="selectedIds.has(user.id)" @change="toggleSelect(user.id)" />
              </td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar" :style="{ background: avatarColor(user.name) }">
                    {{ user.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div class="user-details">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-email">{{ user.email || user.phone || '—' }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="role-badge" :class="user.role === 'admin' ? 'role-admin' : 'role-user'">
                  {{ user.role === 'admin' ? 'Admin' : 'Gebruiker' }}
                </span>
              </td>
              <td>
                <span class="status-dot" :class="user.blocked ? 'dot-blocked' : 'dot-active'" />
                {{ user.blocked ? 'Geblokkeerd' : 'Actief' }}
              </td>
              <td>
                <span :class="user.privacyAcceptedAt ? 'privacy-yes' : 'privacy-no'">
                  {{ user.privacyAcceptedAt ? 'Geaccepteerd' : 'Open' }}
                </span>
              </td>
              <td class="td-date">{{ formatDate(user.createdAt) }}</td>
              <td>
                <div v-if="user.role !== 'admin'" class="action-btns">
                  <button class="action-btn action-edit" title="Bewerken" @click="openEdit(user)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    class="action-btn"
                    :class="user.blocked ? 'action-unblock' : 'action-block'"
                    :disabled="togglingId === user.id"
                    :title="user.blocked ? 'Deblokkeren' : 'Blokkeren'"
                    @click="toggleBlock(user)"
                  >
                    <svg v-if="!user.blocked" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                  <button class="action-btn action-delete" :disabled="deletingId === user.id" title="Verwijderen" @click="confirmDelete(user)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                <span v-else class="admin-label">—</span>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="empty-row">Geen gebruikers gevonden</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-footer">
        <span>{{ filteredUsers.length }} van {{ users.length }} gebruikers</span>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
          <div class="modal">
            <h3>Gebruiker verwijderen</h3>
            <p>Weet je zeker dat je <strong>{{ deleteTarget.name }}</strong> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.</p>
            <div class="modal-actions">
              <button class="btn btn-ghost" @click="deleteTarget = null">Annuleren</button>
              <button class="btn btn-danger" :disabled="deletingId === deleteTarget.id" @click="doDelete">
                {{ deletingId ? 'Verwijderen...' : 'Verwijderen' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="editTarget" class="modal-overlay" @click.self="editTarget = null">
          <div class="modal modal--edit">
            <h3>Gebruiker bewerken</h3>
            <form @submit.prevent="saveEdit">
              <div class="form-group">
                <label>Naam</label>
                <input v-model="editForm.name" type="text" required />
              </div>
              <div class="form-group">
                <label>E-mail</label>
                <input v-model="editForm.email" type="email" />
              </div>
              <div class="form-group">
                <label>Telefoon</label>
                <input v-model="editForm.phone" type="tel" />
              </div>
              <div class="form-group">
                <label>Rol</label>
                <select v-model="editForm.role">
                  <option value="user">Gebruiker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <p v-if="editError" class="error-msg">{{ editError }}</p>
              <div class="modal-actions">
                <button type="button" class="btn btn-ghost" @click="editTarget = null">Annuleren</button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  {{ saving ? 'Opslaan...' : 'Opslaan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Bulk confirm modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="bulkConfirm" class="modal-overlay" @click.self="bulkConfirm = null">
          <div class="modal">
            <h3>{{ bulkConfirm.title }}</h3>
            <p>{{ bulkConfirm.message }}</p>
            <div class="modal-actions">
              <button class="btn btn-ghost" @click="bulkConfirm = null">Annuleren</button>
              <button class="btn btn-danger" :disabled="bulkLoading" @click="executeBulk">
                {{ bulkLoading ? 'Bezig...' : 'Bevestigen' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

const { data, refresh } = await useAsyncData('admin-users', () => $fetch('/api/admin/users'))
const users = computed(() => data.value?.users || [])

const showCreateForm = ref(false)
const creating = ref(false)
const createError = ref('')
const togglingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const deleteTarget = ref<any>(null)
const search = ref('')
const selectedIds = ref(new Set<string>())

// Edit state
const editTarget = ref<any>(null)
const editForm = ref({ name: '', email: '', phone: '', role: 'user' })
const editError = ref('')
const saving = ref(false)

// Bulk state
const bulkConfirm = ref<{ action: string; title: string; message: string } | null>(null)
const bulkLoading = ref(false)

const newUser = ref({ name: '', email: '', phone: '', password: '' })

const filteredUsers = computed(() => {
  if (!search.value.trim()) return users.value
  const q = search.value.toLowerCase()
  return users.value.filter((u: any) =>
    u.name?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q) ||
    u.phone?.includes(q)
  )
})

const allSelected = computed(() => {
  const selectable = filteredUsers.value.filter((u: any) => u.role !== 'admin')
  return selectable.length > 0 && selectable.every((u: any) => selectedIds.value.has(u.id))
})

function toggleAll () {
  const selectable = filteredUsers.value.filter((u: any) => u.role !== 'admin')
  if (allSelected.value) {
    selectedIds.value.clear()
  } else {
    selectable.forEach((u: any) => selectedIds.value.add(u.id))
  }
  selectedIds.value = new Set(selectedIds.value)
}

function toggleSelect (id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
  selectedIds.value = new Set(selectedIds.value)
}

function avatarColor (name: string) {
  const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']
  let hash = 0
  for (let i = 0; i < (name?.length || 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function formatDate (d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function createUser () {
  try {
    creating.value = true
    createError.value = ''
    await $fetch('/api/admin/users/create', { method: 'POST', body: newUser.value })
    newUser.value = { name: '', email: '', phone: '', password: '' }
    showCreateForm.value = false
    await refresh()
  } catch (err: any) {
    createError.value = err?.data?.message || 'Er is een fout opgetreden'
  } finally {
    creating.value = false
  }
}

async function toggleBlock (user: any) {
  try {
    togglingId.value = user.id
    const action = user.blocked ? 'unblock' : 'block'
    await $fetch(`/api/admin/users/${user.id}/${action}`, { method: 'POST' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Er is een fout opgetreden')
  } finally {
    togglingId.value = null
  }
}

function confirmDelete (user: any) { deleteTarget.value = user }

async function doDelete () {
  if (!deleteTarget.value) return
  try {
    deletingId.value = deleteTarget.value.id
    await $fetch(`/api/admin/users/${deleteTarget.value.id}/delete`, { method: 'POST' })
    deleteTarget.value = null
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Er is een fout opgetreden')
  } finally {
    deletingId.value = null
  }
}

function openEdit (user: any) {
  editTarget.value = user
  editForm.value = { name: user.name, email: user.email || '', phone: user.phone || '', role: user.role }
  editError.value = ''
}

async function saveEdit () {
  if (!editTarget.value) return
  try {
    saving.value = true
    editError.value = ''
    await $fetch(`/api/admin/users/${editTarget.value.id}/edit`, { method: 'POST', body: editForm.value })
    editTarget.value = null
    await refresh()
  } catch (err: any) {
    editError.value = err?.data?.message || 'Er is een fout opgetreden'
  } finally {
    saving.value = false
  }
}

function bulkAction (action: string) {
  const count = selectedIds.value.size
  const titles: Record<string, string> = { block: 'Gebruikers blokkeren', unblock: 'Gebruikers deblokkeren', delete: 'Gebruikers verwijderen' }
  const messages: Record<string, string> = {
    block: `Weet je zeker dat je ${count} gebruiker(s) wilt blokkeren?`,
    unblock: `Weet je zeker dat je ${count} gebruiker(s) wilt deblokkeren?`,
    delete: `Weet je zeker dat je ${count} gebruiker(s) wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`
  }
  bulkConfirm.value = { action, title: titles[action], message: messages[action] }
}

async function executeBulk () {
  if (!bulkConfirm.value) return
  try {
    bulkLoading.value = true
    await $fetch('/api/admin/users/bulk', {
      method: 'POST',
      body: { action: bulkConfirm.value.action, userIds: Array.from(selectedIds.value) }
    })
    selectedIds.value.clear()
    selectedIds.value = new Set()
    bulkConfirm.value = null
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Er is een fout opgetreden')
  } finally {
    bulkLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.users-page { max-width: 1100px; }

.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
}
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

.header-actions { display: flex; gap: 0.5rem; }

.btn {
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.55rem 1.1rem; border: none; border-radius: 0.6rem;
  cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.15s;
}
.btn-primary {
  background: var(--gradient-primary, linear-gradient(135deg, #6366f1, #8b5cf6)); color: white;
  box-shadow: 0 2px 10px rgba(99,102,241,0.2);
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
}
.btn-ghost {
  background: white; color: #64748b; border: 1px solid #e2e8f0;
  &:hover { background: #f8fafc; color: #334155; }
}
.btn-danger {
  background: #ef4444; color: white;
  &:hover { background: #dc2626; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

/* ── Create form ── */
.create-card {
  background: white; border-radius: 0.85rem; padding: 1.5rem; margin-bottom: 1rem;
  border: 1px solid #f1f5f9;
  h3 { margin: 0 0 1rem; font-size: 1rem; font-weight: 600; }
}
.create-form { display: flex; flex-direction: column; gap: 0.25rem; }
.form-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
}
.form-group {
  display: flex; flex-direction: column; gap: 0.25rem;
  label { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
  input, select {
    padding: 0.55rem 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 0.5rem;
    font-size: 0.9rem; outline: none; transition: border-color 0.15s;
    &:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
    &::placeholder { color: #cbd5e1; }
  }
  select { background: white; }
}
.error-msg { color: #ef4444; font-size: 0.85rem; margin: 0.25rem 0 0.5rem; }

/* ── Toolbar ── */
.toolbar { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem; }

.search-bar {
  display: flex; align-items: center; gap: 0.6rem;
  background: white; border: 1.5px solid #e2e8f0; border-radius: 0.6rem;
  padding: 0.5rem 0.85rem; transition: border-color 0.15s;
  &:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
  svg { color: #94a3b8; flex-shrink: 0; }
  input { flex: 1; border: none; outline: none; font-size: 0.88rem; background: transparent; &::placeholder { color: #cbd5e1; } }
}

.bulk-bar {
  display: flex; align-items: center; gap: 0.5rem; padding: 0.55rem 0.85rem;
  background: #f8fafc; border-radius: 0.6rem; border: 1px solid #e2e8f0;
}
.bulk-count { font-size: 0.82rem; font-weight: 600; color: #334155; margin-right: 0.25rem; }
.btn-sm { padding: 0.3rem 0.7rem; border: none; border-radius: 0.4rem; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
.btn-bulk { background: rgba(99,102,241,0.1); color: #6366f1; &:hover { background: rgba(99,102,241,0.18); } }
.btn-bulk--danger { background: rgba(239,68,68,0.1); color: #ef4444; &:hover { background: rgba(239,68,68,0.18); } }
.btn-bulk--clear { background: none; border: none; color: #94a3b8; font-size: 0.78rem; cursor: pointer; &:hover { color: #334155; } }

/* ── Table ── */
.table-card {
  background: white; border-radius: 0.85rem; border: 1px solid #f1f5f9; overflow: hidden;
}
.table-wrapper { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; }
th {
  text-align: left; padding: 0.7rem 0.85rem; font-size: 0.72rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;
  background: #fafbfc; border-bottom: 1px solid #f1f5f9;
}
td {
  padding: 0.7rem 0.85rem; font-size: 0.88rem; border-bottom: 1px solid #f8fafc; vertical-align: middle;
}
tbody tr {
  transition: background 0.1s;
  &:hover { background: #fafbfe; }
  &:last-child td { border-bottom: none; }
}
.row-selected { background: rgba(99,102,241,0.04) !important; }

.th-check, .td-check { width: 2.5rem; text-align: center; }
.th-actions { text-align: right; }

/* ── User cell ── */
.user-cell { display: flex; align-items: center; gap: 0.65rem; }
.user-avatar {
  width: 2rem; height: 2rem; border-radius: 0.5rem;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 0.78rem; flex-shrink: 0;
}
.user-details { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-weight: 600; color: #0f172a; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-email { font-size: 0.75rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ── Badges ── */
.role-badge {
  display: inline-flex; padding: 0.15rem 0.5rem; border-radius: 999px;
  font-size: 0.72rem; font-weight: 600;
}
.role-admin { background: rgba(99,102,241,0.1); color: #6366f1; }
.role-user { background: #f1f5f9; color: #94a3b8; }

.status-dot {
  display: inline-block; width: 0.45rem; height: 0.45rem; border-radius: 50%; margin-right: 0.35rem; vertical-align: middle;
}
.dot-active { background: #10b981; }
.dot-blocked { background: #ef4444; }

.privacy-yes { color: #10b981; font-weight: 500; }
.privacy-no { color: #94a3b8; }
.td-date { white-space: nowrap; color: #94a3b8; font-size: 0.82rem; }

/* ── Actions ── */
.action-btns { display: flex; gap: 0.3rem; justify-content: flex-end; }
.action-btn {
  width: 1.85rem; height: 1.85rem; border-radius: 0.4rem; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.12s;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.action-edit { background: rgba(99,102,241,0.08); color: #6366f1; &:hover:not(:disabled) { background: rgba(99,102,241,0.16); } }
.action-block { background: rgba(245,158,11,0.08); color: #f59e0b; &:hover:not(:disabled) { background: rgba(245,158,11,0.16); } }
.action-unblock { background: rgba(16,185,129,0.08); color: #10b981; &:hover:not(:disabled) { background: rgba(16,185,129,0.16); } }
.action-delete { background: rgba(239,68,68,0.06); color: #ef4444; &:hover:not(:disabled) { background: rgba(239,68,68,0.14); } }

.admin-label { color: #94a3b8; text-align: right; display: block; }
.empty-row { text-align: center; color: #94a3b8; padding: 2rem 1rem !important; }

.table-footer { padding: 0.6rem 0.85rem; font-size: 0.78rem; color: #94a3b8; border-top: 1px solid #f1f5f9; }

/* ── Modals ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.35); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.modal {
  background: white; border-radius: 0.85rem; padding: 1.75rem; max-width: 420px; width: 90%;
  box-shadow: 0 16px 48px rgba(15,23,42,0.15);
  h3 { margin: 0 0 0.6rem; font-size: 1.1rem; }
  p { margin: 0 0 1.25rem; font-size: 0.88rem; line-height: 1.5; color: #64748b; }
}
.modal--edit { max-width: 460px; }
.modal-actions { display: flex; gap: 0.6rem; justify-content: flex-end; }

/* ── Transitions ── */
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; }
.slide-enter-to, .slide-leave-from { opacity: 1; max-height: 400px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  th:nth-child(5), td:nth-child(5),
  th:nth-child(6), td:nth-child(6) { display: none; }
}
</style>
