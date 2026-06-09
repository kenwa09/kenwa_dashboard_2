<template>
  <div>
    <h1>Artikel bewerken</h1>

    <div class="card">
      <form @submit.prevent="updatePost">
        <div class="form-group">
          <label>Titel (NL)</label>
          <input v-model="form.title" type="text" required />
        </div>
        <div class="form-group">
          <label>Samenvatting (NL)</label>
          <input v-model="form.excerpt" type="text" />
        </div>
        <div class="form-group">
          <label>Inhoud (NL)</label>
          <textarea v-model="form.content" rows="12" required />
        </div>
        <p class="translate-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="vertical-align:middle;margin-right:4px"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>
          De Engelse vertaling wordt automatisch bijgewerkt na het opslaan.
        </p>
        <div class="form-group">
          <label>Cover afbeelding</label>
          <div class="image-field">
            <input v-model="form.coverImage" type="url" placeholder="https://... of genereer via AI" />
            <button
              type="button"
              class="btn btn-ai"
              :disabled="generatingImage || !form.title.trim()"
              :title="form.title.trim() ? 'Genereer AI afbeelding op basis van de titel' : 'Vul eerst een titel in'"
              @click="generateImage"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              {{ generatingImage ? 'Genereren...' : 'AI afbeelding' }}
            </button>
          </div>
          <p v-if="imageError" class="field-error">{{ imageError }}</p>
          <div v-if="form.coverImage" class="image-preview">
            <img :src="form.coverImage" alt="Preview" @error="imageLoadError = true" @load="imageLoadError = false" />
            <span v-if="imageLoadError" class="preview-error">Afbeelding kan niet worden geladen</span>
          </div>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="draft">Concept</option>
            <option value="published">Gepubliceerd</option>
          </select>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Opslaan...' : 'Opslaan' }}
          </button>
          <NuxtLink to="/admin/blog" class="btn btn-secondary">Annuleren</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

const route = useRoute()
const router = useRouter()
const postId = route.params.id as string

const saving = ref(false)
const error = ref('')
const generatingImage = ref(false)
const imageError = ref('')
const imageLoadError = ref(false)

async function generateImage () {
  if (!form.value.title.trim()) return
  try {
    generatingImage.value = true
    imageError.value = ''
    const result = await $fetch<{ imageUrl: string }>('/api/admin/blog/generate-image', {
      method: 'POST',
      body: { prompt: form.value.title }
    })
    form.value.coverImage = result.imageUrl
  } catch (err: any) {
    imageError.value = err?.data?.statusMessage || 'Afbeelding genereren mislukt'
  } finally {
    generatingImage.value = false
  }
}

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  status: 'draft'
})

// Load the post data
const { data } = await useAsyncData(`admin-blog-${postId}`, () => $fetch('/api/admin/blog'))
const allPosts = computed(() => (data.value as any)?.posts || data.value || [])
const post = computed(() => allPosts.value.find((p: any) => p.id === postId))

// Populate form when data loads
watchEffect(() => {
  if (post.value) {
    form.value = {
      title: post.value.title || '',
      excerpt: post.value.excerpt || '',
      content: post.value.content || '',
      coverImage: post.value.coverImage || '',
      status: post.value.status || 'draft'
    }
  }
})

async function updatePost () {
  try {
    saving.value = true
    error.value = ''
    await $fetch(`/api/admin/blog/${postId}`, {
      method: 'PUT',
      body: form.value
    })
    await router.push('/admin/blog')
  } catch (err: any) {
    error.value = err?.data?.message || 'Er is een fout opgetreden'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  max-width: 600px;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.image-field {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  max-width: 600px;
}

.image-field input {
  flex: 1;
  max-width: none;
}

.image-preview {
  margin-top: 0.75rem;
  max-width: 600px;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.image-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.field-error {
  color: #ef4444;
  font-size: 0.82rem;
  margin-top: 0.35rem;
}

.preview-error {
  display: block;
  padding: 0.5rem;
  font-size: 0.82rem;
  color: rgba(15, 23, 42, 0.5);
}

.error {
  color: #ef4444;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.btn-secondary:hover {
  background: rgba(15, 23, 42, 0.12);
}

.btn-ai {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  flex-shrink: 0;
}

.btn-ai:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.translate-note {
  font-size: 0.82rem;
  color: #059669;
  background: rgba(16, 185, 129, 0.07);
  border: 1px solid rgba(16, 185, 129, 0.18);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  max-width: 600px;
}
</style>
