<template>
  <div>
    <div class="page-header">
      <h1>AI Blog Automatisering</h1>
      <p class="subtitle">Laat Claude automatisch blogartikelen schrijven op basis van uw onderwerpen.</p>
    </div>

    <!-- Instellingen -->
    <div class="card section">
      <h2>Instellingen</h2>
      <form @submit.prevent="saveSettings">
        <div class="form-row">
          <div class="form-group">
            <label>Status</label>
            <div class="toggle-wrap">
              <label class="toggle">
                <input v-model="form.enabled" type="checkbox" />
                <span class="slider" />
              </label>
              <span>{{ form.enabled ? 'Ingeschakeld' : 'Uitgeschakeld' }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Frequentie</label>
            <select v-model="form.frequency">
              <option value="daily">Dagelijks</option>
              <option value="weekly">Wekelijks</option>
              <option value="biweekly">Tweewekelijks</option>
              <option value="monthly">Maandelijks</option>
            </select>
          </div>

          <div class="form-group">
            <label>Taal</label>
            <select v-model="form.language">
              <option value="nl">Nederlands</option>
              <option value="en">Engels</option>
              <option value="de">Duits</option>
              <option value="fr">Frans</option>
            </select>
          </div>
        </div>

        <div class="img-section">
          <h3 class="img-section-title">Afbeeldingen</h3>
          <div class="img-badge-row">
            <span :class="['img-badge', form.openaiApiKey ? 'img-badge--active' : 'img-badge--off']">
              DALL-E 3 {{ form.openaiApiKey ? '✓ Actief' : '— Niet ingesteld' }}
            </span>
            <span v-if="!form.openaiApiKey" :class="['img-badge', form.pexelsApiKey ? 'img-badge--active' : 'img-badge--off']">
              Pexels {{ form.pexelsApiKey ? '✓ Fallback' : '— Niet ingesteld' }}
            </span>
            <span v-if="!form.openaiApiKey && !form.pexelsApiKey" class="img-badge img-badge--none">
              Geen afbeeldingen
            </span>
          </div>

          <div class="form-group">
            <label>
              OpenAI API-sleutel (DALL-E 3)
              <span class="hint">— AI genereert unieke afbeeldingen per blog · platform.openai.com/api-keys</span>
            </label>
            <input v-model="form.openaiApiKey" type="password" placeholder="sk-... (aanbevolen)" autocomplete="off" />
          </div>

          <div class="form-group">
            <label>
              Pexels API-sleutel
              <span class="hint">— Gratis stockfoto's als fallback · pexels.com/api</span>
            </label>
            <input v-model="form.pexelsApiKey" type="password" placeholder="Optioneel" autocomplete="off" />
          </div>
        </div>

        <div v-if="settings" class="info-row">
          <span v-if="settings.lastRun">Laatste generatie: <strong>{{ formatDate(settings.lastRun) }}</strong></span>
          <span v-if="settings.nextRun">Volgende generatie: <strong>{{ formatDate(settings.nextRun) }}</strong></span>
        </div>

        <p v-if="settingsError" class="error">{{ settingsError }}</p>
        <p v-if="settingsSuccess" class="success">{{ settingsSuccess }}</p>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="savingSettings">
            {{ savingSettings ? 'Opslaan...' : 'Instellingen opslaan' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Onderwerpen -->
    <div class="card section">
      <h2>Onderwerpen</h2>
      <p class="hint-text">Voeg onderwerpen toe waarover Claude blogs moet schrijven. Het minst gebruikte onderwerp wordt als eerste gekozen.</p>

      <form class="topic-form" @submit.prevent="addTopic">
        <input
          v-model="newTopic"
          type="text"
          placeholder="Bijv. Digitale veiligheid voor bedrijven"
          :disabled="addingTopic"
        />
        <button type="submit" class="btn btn-primary" :disabled="addingTopic || !newTopic.trim()">
          {{ addingTopic ? 'Toevoegen...' : 'Toevoegen' }}
        </button>
      </form>

      <p v-if="topicError" class="error">{{ topicError }}</p>

      <div v-if="topics.length" class="topic-list">
        <div v-for="topic in topics" :key="topic.id" class="topic-item">
          <div class="topic-info">
            <span class="topic-name">{{ topic.topic }}</span>
            <span class="topic-meta">
              {{ topic.usedCount }}x gebruikt
              <template v-if="topic.lastUsed"> · Laatst: {{ formatDate(topic.lastUsed) }}</template>
            </span>
          </div>
          <div class="topic-actions">
            <button
              class="btn btn-sm btn-secondary"
              :disabled="generating"
              @click="generateNow(topic.id)"
            >
              Nu genereren
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="removeTopic(topic.id)"
            >
              Verwijderen
            </button>
          </div>
        </div>
      </div>
      <p v-else class="empty">Nog geen onderwerpen toegevoegd.</p>
    </div>

    <!-- Handmatig genereren -->
    <div class="card section">
      <h2>Handmatig genereren</h2>
      <p class="hint-text">Genereer direct een blog op basis van het minst gebruikte onderwerp.</p>

      <p v-if="generateError" class="error">{{ generateError }}</p>
      <p v-if="generateSuccess" class="success">{{ generateSuccess }}</p>

      <button class="btn btn-primary" :disabled="generating || !topics.length" @click="generateNow()">
        {{ generating ? 'Genereren... (kan even duren)' : 'Genereer blog nu' }}
      </button>
      <span v-if="!topics.length" class="hint"> — Voeg eerst onderwerpen toe</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

interface AiBlogSettings {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  language: string
  lastRun?: string
  nextRun?: string
  pexelsApiKey?: string
  openaiApiKey?: string
}

interface AiBlogTopic {
  id: string
  topic: string
  usedCount: number
  lastUsed?: string
  createdAt: string
}

const { data: settingsData, refresh: refreshSettings } = await useAsyncData('ai-blog-settings', () =>
  $fetch<AiBlogSettings>('/api/admin/ai-blog/settings')
)
const { data: topicsData, refresh: refreshTopics } = await useAsyncData('ai-blog-topics', () =>
  $fetch<{ topics: AiBlogTopic[] }>('/api/admin/ai-blog/topics')
)

const settings = computed(() => settingsData.value)
const topics = computed(() => topicsData.value?.topics || [])

const form = ref({
  enabled: settings.value?.enabled ?? false,
  frequency: settings.value?.frequency ?? 'weekly',
  language: settings.value?.language ?? 'nl',
  openaiApiKey: '',
  pexelsApiKey: ''
})

watch(settingsData, (val) => {
  if (val) {
    form.value.enabled = val.enabled
    form.value.frequency = val.frequency
    form.value.language = val.language
  }
})

const savingSettings = ref(false)
const settingsError = ref('')
const settingsSuccess = ref('')

async function saveSettings () {
  try {
    savingSettings.value = true
    settingsError.value = ''
    settingsSuccess.value = ''
    await $fetch('/api/admin/ai-blog/settings', {
      method: 'PUT',
      body: {
        enabled: form.value.enabled,
        frequency: form.value.frequency,
        language: form.value.language,
        openaiApiKey: form.value.openaiApiKey || undefined,
        pexelsApiKey: form.value.pexelsApiKey || undefined
      }
    })
    settingsSuccess.value = 'Instellingen opgeslagen!'
    await refreshSettings()
    setTimeout(() => { settingsSuccess.value = '' }, 3000)
  } catch (err: any) {
    settingsError.value = err?.data?.statusMessage || 'Opslaan mislukt'
  } finally {
    savingSettings.value = false
  }
}

const newTopic = ref('')
const addingTopic = ref(false)
const topicError = ref('')

async function addTopic () {
  if (!newTopic.value.trim()) { return }
  try {
    addingTopic.value = true
    topicError.value = ''
    await $fetch('/api/admin/ai-blog/topics', {
      method: 'POST',
      body: { topic: newTopic.value }
    })
    newTopic.value = ''
    await refreshTopics()
  } catch (err: any) {
    topicError.value = err?.data?.statusMessage || 'Toevoegen mislukt'
  } finally {
    addingTopic.value = false
  }
}

async function removeTopic (id: string) {
  try {
    await $fetch(`/api/admin/ai-blog/topics/${id}`, { method: 'DELETE' })
    await refreshTopics()
  } catch (err: any) {
    topicError.value = err?.data?.statusMessage || 'Verwijderen mislukt'
  }
}

const generating = ref(false)
const generateError = ref('')
const generateSuccess = ref('')

async function generateNow (topicId?: string) {
  try {
    generating.value = true
    generateError.value = ''
    generateSuccess.value = ''
    const result = await $fetch<{ ok: boolean; post: { title: string; slug: string } }>('/api/admin/ai-blog/generate', {
      method: 'POST',
      body: topicId ? { topicId } : {}
    })
    generateSuccess.value = `Blog gegenereerd: "${result.post.title}"`
    await refreshTopics()
    await refreshSettings()
    setTimeout(() => { generateSuccess.value = '' }, 8000)
  } catch (err: any) {
    generateError.value = err?.data?.statusMessage || err?.message || 'Genereren mislukt'
  } finally {
    generating.value = false
  }
}

function formatDate (value: string) {
  try {
    return new Date(value).toLocaleString('nl-NL', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  } catch { return value }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  margin-bottom: 0.25rem;
}
.subtitle {
  color: rgba(15, 23, 42, 0.6);
  font-size: 0.95rem;
}

.section {
  margin-bottom: 1.5rem;
}
.section h2 {
  margin-bottom: 1rem;
}

.img-section {
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(59, 130, 246, 0.03);
  margin-bottom: 1rem;
}
.img-section-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.img-badge-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.img-badge {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}
.img-badge--active {
  background: rgba(22, 163, 74, 0.12);
  color: #16a34a;
}
.img-badge--off {
  background: rgba(15, 23, 42, 0.07);
  color: rgba(15, 23, 42, 0.5);
}
.img-badge--none {
  background: rgba(234, 179, 8, 0.1);
  color: #ca8a04;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  flex: 1;
  min-width: 180px;
}
.form-group label {
  display: block;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-family: inherit;
  background: white;
}

.toggle-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.2);
  border-radius: 24px;
  transition: background 0.2s;
}
.slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}
.toggle input:checked + .slider {
  background: #3b82f6;
}
.toggle input:checked + .slider::before {
  transform: translateX(20px);
}

.hint {
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.5);
  font-weight: 400;
}
.hint-text {
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.6);
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.6);
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.topic-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.topic-form input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-family: inherit;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.topic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 0.5rem;
  gap: 1rem;
}
.topic-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.topic-name {
  font-weight: 500;
  font-size: 0.95rem;
}
.topic-meta {
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.5);
}
.topic-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.empty {
  color: rgba(15, 23, 42, 0.5);
  font-size: 0.9rem;
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
  white-space: nowrap;
}
.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
}
.btn-primary {
  background: #3b82f6;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}
.btn-secondary {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}
.btn-secondary:hover:not(:disabled) {
  background: rgba(15, 23, 42, 0.14);
}
.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}
.btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}
.success {
  color: #16a34a;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
}
</style>
