<template>
  <div class="products-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Producten</h1>
        <p class="page-sub">{{ products.length }} producten • {{ activeCount }} actief</p>
      </div>
      <button class="add-btn" @click="openAdd">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nieuw product
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="products.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
      <p>Nog geen producten</p>
      <small>Voeg je eerste product toe om te beginnen.</small>
      <button class="add-btn" @click="openAdd">Product toevoegen</button>
    </div>

    <!-- Products grid -->
    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-img">
          <img v-if="product.images[0]" :src="product.images[0]" :alt="product.name" />
          <div v-else class="img-placeholder">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <span class="active-badge" :class="product.active ? 'badge--active' : 'badge--inactive'">
            {{ product.active ? 'Actief' : 'Inactief' }}
          </span>
        </div>
        <div class="product-info">
          <div class="product-header">
            <h3>{{ product.name }}</h3>
            <div class="product-price">
              <span class="price-main">€{{ product.price.toFixed(2) }}</span>
              <span v-if="product.comparePrice" class="price-compare">€{{ product.comparePrice.toFixed(2) }}</span>
            </div>
          </div>
          <div class="product-meta">
            <span v-if="product.category" class="meta-chip">{{ product.category }}</span>
            <span class="meta-chip" :class="product.stock > 0 ? 'chip--ok' : 'chip--warn'">
              Voorraad: {{ product.stock }}
            </span>
            <span v-if="product.sku" class="meta-chip">SKU: {{ product.sku }}</span>
          </div>
        </div>
        <div class="product-actions">
          <button class="toggle-btn" :class="product.active ? 'toggle--deactivate' : 'toggle--activate'" @click="toggleActive(product)">
            {{ product.active ? 'Deactiveren' : 'Activeren' }}
          </button>
          <button class="edit-btn" @click="openEdit(product)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: add / edit product -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ editProduct ? 'Product bewerken' : 'Nieuw product' }}</h2>
            <button class="close-btn" @click="showModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form class="modal-form" @submit.prevent="submitForm">
            <div class="form-row">
              <div class="field">
                <label>Naam *</label>
                <input v-model="form.name" type="text" placeholder="Productnaam" required />
              </div>
              <div class="field">
                <label>Categorie</label>
                <input v-model="form.category" type="text" placeholder="bijv. GPS-trackers" />
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Prijs (€) *</label>
                <input v-model="form.price" type="number" step="0.01" min="0" placeholder="0.00" required />
              </div>
              <div class="field">
                <label>Vergelijkprijs (€)</label>
                <input v-model="form.comparePrice" type="number" step="0.01" min="0" placeholder="0.00" />
              </div>
              <div class="field">
                <label>Voorraad</label>
                <input v-model="form.stock" type="number" min="0" placeholder="0" />
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>SKU</label>
                <input v-model="form.sku" type="text" placeholder="Artikelnummer" />
              </div>
            </div>
            <div class="field">
              <label>Omschrijving</label>
              <textarea v-model="form.description" rows="3" placeholder="Productomschrijving…" />
            </div>
            <div class="field">
              <label>Leverancier URL</label>
              <input v-model="form.supplierUrl" type="url" placeholder="https://..." />
            </div>
            <div class="field">
              <label>Afbeelding URL's (één per regel)</label>
              <textarea v-model="form.imagesRaw" rows="2" placeholder="https://..." />
            </div>
            <div class="field field--checkbox">
              <label>
                <input v-model="form.active" type="checkbox" />
                Product activeren (zichtbaar in shop)
              </label>
            </div>
            <p v-if="formError" class="form-error">{{ formError }}</p>
            <div class="modal-footer">
              <button type="button" class="cancel-btn" @click="showModal = false">Annuleren</button>
              <button type="submit" class="submit-btn" :disabled="submitting">
                {{ submitting ? 'Opslaan…' : (editProduct ? 'Wijzigingen opslaan' : 'Product toevoegen') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })
useHead({ title: 'Producten — Kenwa Admin' })

interface Product {
  id: string; name: string; slug: string; description?: string; price: number; comparePrice?: number
  images: string[]; category?: string; stock: number; sku?: string; supplierUrl?: string; active: boolean
}

const { data: productsData, refresh } = await useAsyncData('admin-products', () => $fetch<{ products: Product[] }>('/api/admin/products'))
const products = computed(() => productsData.value?.products || [])
const activeCount = computed(() => products.value.filter(p => p.active).length)

const showModal = ref(false)
const editProduct = ref<Product | null>(null)
const submitting = ref(false)
const formError = ref('')

const form = reactive({
  name: '', category: '', price: '', comparePrice: '', stock: '0',
  sku: '', description: '', supplierUrl: '', imagesRaw: '', active: false
})

function openAdd () {
  editProduct.value = null
  Object.assign(form, { name: '', category: '', price: '', comparePrice: '', stock: '0', sku: '', description: '', supplierUrl: '', imagesRaw: '', active: false })
  formError.value = ''
  showModal.value = true
}

function openEdit (product: Product) {
  editProduct.value = product
  Object.assign(form, {
    name: product.name, category: product.category || '',
    price: String(product.price), comparePrice: product.comparePrice ? String(product.comparePrice) : '',
    stock: String(product.stock), sku: product.sku || '', description: product.description || '',
    supplierUrl: product.supplierUrl || '', imagesRaw: product.images.join('\n'), active: product.active
  })
  formError.value = ''
  showModal.value = true
}

async function submitForm () {
  formError.value = ''
  if (!form.name.trim()) { formError.value = 'Naam is verplicht'; return }
  if (!form.price) { formError.value = 'Prijs is verplicht'; return }

  submitting.value = true
  try {
    const images = form.imagesRaw.split('\n').map(s => s.trim()).filter(Boolean)
    const body = {
      name: form.name.trim(), category: form.category.trim() || undefined,
      price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      stock: Number(form.stock || 0), sku: form.sku.trim() || undefined,
      description: form.description.trim() || undefined, supplierUrl: form.supplierUrl.trim() || undefined,
      images, active: form.active
    }
    if (editProduct.value) {
      await $fetch(`/api/admin/products/${editProduct.value.id}`, { method: 'PATCH', body })
    } else {
      await $fetch('/api/admin/products', { method: 'POST', body })
    }
    showModal.value = false
    await refresh()
  } catch (e: any) {
    formError.value = e?.data?.statusMessage || 'Er is iets misgegaan'
  } finally {
    submitting.value = false
  }
}

async function toggleActive (product: Product) {
  await $fetch(`/api/admin/products/${product.id}`, { method: 'PATCH', body: { active: !product.active } })
  await refresh()
}
</script>

<style scoped lang="scss">
.products-page { max-width: 1100px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

.add-btn {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.1rem; background: #6366f1; color: white;
  border: none; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem;
  cursor: pointer; transition: background 0.2s; white-space: nowrap;
  &:hover { background: #4f46e5; }
}

.empty-state {
  text-align: center; padding: 4rem 2rem; background: white; border-radius: 1rem; border: 1.5px dashed #e2e8f0;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  svg { color: #94a3b8; }
  p { font-size: 1rem; font-weight: 600; color: #64748b; margin: 0; }
  small { color: #94a3b8; font-size: 0.85rem; }
}

.products-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;
}

.product-card {
  background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden;
  display: flex; flex-direction: column;
}

.product-img {
  position: relative; height: 160px; background: #f8fafc; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
}
.img-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #cbd5e1; }

.active-badge {
  position: absolute; top: 0.6rem; right: 0.6rem;
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  padding: 0.2rem 0.55rem; border-radius: 999px;
  &.badge--active { background: rgba(16,185,129,0.15); color: #059669; }
  &.badge--inactive { background: rgba(148,163,184,0.15); color: #64748b; }
}

.product-info { padding: 1rem; flex: 1; }
.product-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem; }
.product-header h3 { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0; flex: 1; margin-right: 0.75rem; }
.product-price { display: flex; flex-direction: column; align-items: flex-end; }
.price-main { font-weight: 700; color: #1e293b; }
.price-compare { font-size: 0.75rem; color: #94a3b8; text-decoration: line-through; }

.product-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.meta-chip {
  font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 999px;
  background: #f1f5f9; color: #64748b;
  &.chip--ok { background: rgba(16,185,129,0.1); color: #059669; }
  &.chip--warn { background: rgba(239,68,68,0.1); color: #dc2626; }
}

.product-actions {
  display: flex; gap: 0.5rem; padding: 0.75rem 1rem;
  border-top: 1px solid #f1f5f9;
}
.toggle-btn {
  flex: 1; padding: 0.5rem; border-radius: 0.45rem; border: 1.5px solid;
  font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  &.toggle--activate { border-color: #059669; color: #059669; background: transparent; &:hover { background: rgba(16,185,129,0.08); } }
  &.toggle--deactivate { border-color: #dc2626; color: #dc2626; background: transparent; &:hover { background: rgba(239,68,68,0.08); } }
}
.edit-btn {
  padding: 0.5rem; background: #f1f5f9; border: none; border-radius: 0.45rem; cursor: pointer; color: #64748b;
  &:hover { background: #e2e8f0; color: #6366f1; }
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.modal {
  background: white; border-radius: 1rem; width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9;
  h2 { font-size: 1rem; font-weight: 700; margin: 0; }
}
.close-btn {
  background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0.25rem;
  &:hover { color: #475569; }
}
.modal-form { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.85rem; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; }
.field { display: flex; flex-direction: column; gap: 0.3rem; }
.field label { font-size: 0.78rem; font-weight: 600; color: #64748b; }
.field input, .field textarea, .field select {
  padding: 0.55rem 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem;
  color: #1e293b; background: white; resize: vertical;
  &:focus { outline: none; border-color: #6366f1; }
}
.field--checkbox label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #334155; input { width: auto; } }
.form-error { color: #dc2626; font-size: 0.82rem; margin: 0; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 0.5rem; }
.cancel-btn {
  padding: 0.6rem 1.25rem; background: #f1f5f9; color: #64748b; border: none;
  border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;
  &:hover { background: #e2e8f0; }
}
.submit-btn {
  padding: 0.6rem 1.25rem; background: #6366f1; color: white; border: none;
  border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer;
  &:hover:not(:disabled) { background: #4f46e5; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
</style>
