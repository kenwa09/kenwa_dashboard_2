<template>
  <div>
    <h1>Bannerbeheer</h1>

    <div class="card create-form">
      <h3>{{ editingBanner ? 'Banner bewerken' : 'Nieuwe banner' }}</h3>
      <form @submit.prevent="editingBanner ? updateBanner() : createBanner()">
        <div class="form-row">
          <div class="form-group">
            <label>Titel</label>
            <input v-model="form.title" type="text" required />
          </div>
          <div class="form-group">
            <label>Positie</label>
            <input v-model="form.position" type="text" placeholder="bijv. homepage-top" required />
          </div>
          <div class="form-group">
            <label>Afbeelding URL</label>
            <input v-model="form.imageUrl" type="url" />
          </div>
          <div class="form-group">
            <label>Link URL</label>
            <input v-model="form.linkUrl" type="url" />
          </div>
        </div>
        <p v-if="formError" class="error">{{ formError }}</p>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="formSaving">
            {{ formSaving ? 'Opslaan...' : (editingBanner ? 'Bijwerken' : 'Toevoegen') }}
          </button>
          <button v-if="editingBanner" type="button" class="btn btn-secondary" @click="cancelEdit">
            Annuleren
          </button>
        </div>
      </form>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Positie</th>
            <th>Status</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="banner in banners" :key="banner.id">
            <td>{{ banner.title }}</td>
            <td>{{ banner.position }}</td>
            <td>
              <span :class="banner.active ? 'status-active' : 'status-inactive'">
                {{ banner.active ? 'Actief' : 'Inactief' }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-primary" @click="startEdit(banner)">Bewerken</button>
              <button
                class="btn btn-sm"
                :class="banner.active ? 'btn-warning' : 'btn-success'"
                :disabled="togglingId === banner.id"
                @click="toggleActive(banner)"
              >
                {{ banner.active ? 'Deactiveren' : 'Activeren' }}
              </button>
              <button
                class="btn btn-sm btn-danger"
                :disabled="deletingId === banner.id"
                @click="deleteBanner(banner.id)"
              >
                Verwijderen
              </button>
            </td>
          </tr>
          <tr v-if="banners.length === 0">
            <td colspan="4">Geen banners gevonden.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

const { data, refresh } = await useAsyncData('admin-banners', () => $fetch('/api/admin/banners'))
const banners = computed(() => (data.value as any)?.banners || data.value || [])

const formSaving = ref(false)
const formError = ref('')
const editingBanner = ref<any>(null)
const togglingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

const form = ref({
  title: '',
  position: '',
  imageUrl: '',
  linkUrl: ''
})

function resetForm () {
  form.value = { title: '', position: '', imageUrl: '', linkUrl: '' }
  editingBanner.value = null
  formError.value = ''
}

function startEdit (banner: any) {
  editingBanner.value = banner
  form.value = {
    title: banner.title || '',
    position: banner.position || '',
    imageUrl: banner.imageUrl || '',
    linkUrl: banner.linkUrl || ''
  }
}

function cancelEdit () {
  resetForm()
}

async function createBanner () {
  try {
    formSaving.value = true
    formError.value = ''
    await $fetch('/api/admin/banners', {
      method: 'POST',
      body: form.value
    })
    resetForm()
    await refresh()
  } catch (err: any) {
    formError.value = err?.data?.message || 'Er is een fout opgetreden'
  } finally {
    formSaving.value = false
  }
}

async function updateBanner () {
  try {
    formSaving.value = true
    formError.value = ''
    await $fetch(`/api/admin/banners/${editingBanner.value.id}`, {
      method: 'PUT',
      body: form.value
    })
    resetForm()
    await refresh()
  } catch (err: any) {
    formError.value = err?.data?.message || 'Er is een fout opgetreden'
  } finally {
    formSaving.value = false
  }
}

async function toggleActive (banner: any) {
  try {
    togglingId.value = banner.id
    await $fetch(`/api/admin/banners/${banner.id}`, {
      method: 'PUT',
      body: { ...banner, active: !banner.active }
    })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Er is een fout opgetreden')
  } finally {
    togglingId.value = null
  }
}

async function deleteBanner (id: string) {
  if (!confirm('Weet je zeker dat je deze banner wilt verwijderen?')) return
  try {
    deletingId.value = id
    await $fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Er is een fout opgetreden')
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.create-form {
  margin-bottom: 1.5rem;
}

.create-form h3 {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 600px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.error {
  color: #ef4444;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-sm {
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.btn-secondary {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.btn-secondary:hover {
  background: rgba(15, 23, 42, 0.12);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.btn-success:hover {
  background: rgba(34, 197, 94, 0.2);
}

.btn-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.btn-warning:hover {
  background: rgba(245, 158, 11, 0.2);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-active {
  color: #16a34a;
  font-weight: 500;
}

.status-inactive {
  color: rgba(15, 23, 42, 0.4);
  font-weight: 500;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
