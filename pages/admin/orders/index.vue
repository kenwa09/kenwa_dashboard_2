<template>
  <div class="orders-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Bestellingen</h1>
        <p class="page-sub">{{ orders.length }} bestellingen totaal</p>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="filter-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.value === '' || countByStatus(tab.value) > 0" class="tab-count">
          {{ tab.value === '' ? orders.length : countByStatus(tab.value) }}
        </span>
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="filteredOrders.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <p>Geen bestellingen gevonden</p>
      <small>Bestellingen verschijnen hier zodra de shop live is.</small>
    </div>

    <!-- Orders table -->
    <div v-else class="table-card">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Bestelling</th>
            <th>Klant</th>
            <th>Datum</th>
            <th>Totaal</th>
            <th>Status</th>
            <th>Betaling</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="order-row"
            :class="{ 'row--selected': selectedId === order.id }"
            @click="selectOrder(order)"
          >
            <td class="order-num">#{{ order.orderNumber }}</td>
            <td>
              <div class="customer-info">
                <span class="customer-name">{{ order.customerName }}</span>
                <span class="customer-email">{{ order.customerEmail }}</span>
              </div>
            </td>
            <td class="order-date">{{ formatDate(order.createdAt) }}</td>
            <td class="order-total">€{{ order.total.toFixed(2) }}</td>
            <td><span class="badge" :class="'badge--' + order.status">{{ statusLabel(order.status) }}</span></td>
            <td><span class="badge badge--payment" :class="'pay--' + order.paymentStatus">{{ paymentLabel(order.paymentStatus) }}</span></td>
            <td class="order-actions">
              <button class="action-btn" @click.stop="selectOrder(order)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail drawer -->
    <Teleport to="body">
      <div v-if="selectedOrder" class="drawer-overlay" @click.self="selectedOrder = null">
        <div class="drawer">
          <div class="drawer-header">
            <div>
              <h2>Bestelling #{{ selectedOrder.orderNumber }}</h2>
              <small>{{ formatDate(selectedOrder.createdAt) }}</small>
            </div>
            <button class="close-btn" @click="selectedOrder = null">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="drawer-body">
            <!-- Customer -->
            <div class="drawer-section">
              <h3>Klantgegevens</h3>
              <div class="info-grid">
                <div class="info-row"><span>Naam</span><strong>{{ selectedOrder.customerName }}</strong></div>
                <div class="info-row"><span>E-mail</span><strong>{{ selectedOrder.customerEmail }}</strong></div>
                <div v-if="selectedOrder.customerPhone" class="info-row"><span>Telefoon</span><strong>{{ selectedOrder.customerPhone }}</strong></div>
              </div>
            </div>

            <!-- Shipping address -->
            <div class="drawer-section">
              <h3>Bezorgadres</h3>
              <div class="address-block">
                {{ selectedOrder.shippingAddress.street }}<br>
                {{ selectedOrder.shippingAddress.postcode }} {{ selectedOrder.shippingAddress.city }}<br>
                {{ selectedOrder.shippingAddress.country }}
              </div>
            </div>

            <!-- Items -->
            <div v-if="selectedOrder.items?.length" class="drawer-section">
              <h3>Producten</h3>
              <div class="items-list">
                <div v-for="item in selectedOrder.items" :key="item.id" class="order-item">
                  <span class="item-qty">{{ item.quantity }}×</span>
                  <span class="item-name">{{ item.productName }}</span>
                  <span class="item-price">€{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              <div class="totals-block">
                <div class="total-row"><span>Subtotaal</span><span>€{{ selectedOrder.subtotal.toFixed(2) }}</span></div>
                <div class="total-row"><span>Verzendkosten</span><span>€{{ selectedOrder.shippingCost.toFixed(2) }}</span></div>
                <div class="total-row total-final"><span>Totaal</span><span>€{{ selectedOrder.total.toFixed(2) }}</span></div>
              </div>
            </div>

            <!-- Status update -->
            <div class="drawer-section">
              <h3>Status bijwerken</h3>
              <div class="status-form">
                <div class="field-group">
                  <label>Bestelstatus</label>
                  <select v-model="editStatus">
                    <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                  </select>
                </div>
                <div class="field-group">
                  <label>Betaalstatus</label>
                  <select v-model="editPaymentStatus">
                    <option v-for="s in paymentOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                  </select>
                </div>
                <button class="save-btn" :disabled="saving" @click="saveStatus">
                  {{ saving ? 'Opslaan…' : 'Status opslaan' }}
                </button>
                <p v-if="saveSuccess" class="save-ok">Opgeslagen!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })
useHead({ title: 'Bestellingen — Kenwa Admin' })

interface OrderItem { id: string; productName: string; quantity: number; price: number }
interface Order {
  id: string; orderNumber: string; customerName: string; customerEmail: string
  customerPhone?: string; shippingAddress: { street: string; city: string; postcode: string; country: string }
  status: string; paymentStatus: string; subtotal: number; shippingCost: number; total: number
  createdAt: string; items?: OrderItem[]
}

const { data: ordersData, refresh } = await useAsyncData('admin-orders', () => $fetch<{ orders: Order[] }>('/api/admin/orders'))
const orders = computed(() => ordersData.value?.orders || [])

const activeTab = ref('')
const selectedId = ref<string | null>(null)
const selectedOrder = ref<Order | null>(null)
const editStatus = ref('')
const editPaymentStatus = ref('')
const saving = ref(false)
const saveSuccess = ref(false)

const tabs = [
  { label: 'Alle', value: '' },
  { label: 'In behandeling', value: 'pending' },
  { label: 'Betaald', value: 'paid' },
  { label: 'Verstuurd', value: 'shipped' },
  { label: 'Geleverd', value: 'delivered' },
  { label: 'Geannuleerd', value: 'cancelled' }
]

const statusOptions = [
  { value: 'pending', label: 'In behandeling' },
  { value: 'paid', label: 'Betaald' },
  { value: 'processing', label: 'In verwerking' },
  { value: 'shipped', label: 'Verstuurd' },
  { value: 'delivered', label: 'Geleverd' },
  { value: 'cancelled', label: 'Geannuleerd' },
  { value: 'refunded', label: 'Terugbetaald' }
]

const paymentOptions = [
  { value: 'open', label: 'Open' },
  { value: 'paid', label: 'Betaald' },
  { value: 'failed', label: 'Mislukt' },
  { value: 'cancelled', label: 'Geannuleerd' },
  { value: 'expired', label: 'Verlopen' }
]

const filteredOrders = computed(() =>
  activeTab.value ? orders.value.filter(o => o.status === activeTab.value) : orders.value
)

function countByStatus (status: string) {
  return orders.value.filter(o => o.status === status).length
}

async function selectOrder (order: Order) {
  selectedId.value = order.id
  const data = await $fetch<{ order: Order }>(`/api/admin/orders/${order.id}`)
  selectedOrder.value = data.order
  editStatus.value = data.order.status
  editPaymentStatus.value = data.order.paymentStatus
  saveSuccess.value = false
}

async function saveStatus () {
  if (!selectedOrder.value) return
  saving.value = true
  saveSuccess.value = false
  try {
    const data = await $fetch<{ order: Order }>(`/api/admin/orders/${selectedOrder.value.id}`, {
      method: 'PATCH',
      body: { status: editStatus.value, paymentStatus: editPaymentStatus.value }
    })
    selectedOrder.value = data.order
    saveSuccess.value = true
    await refresh()
  } finally {
    saving.value = false
  }
}

function formatDate (d: string) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusLabel (s: string) {
  return { pending: 'In behandeling', paid: 'Betaald', processing: 'In verwerking', shipped: 'Verstuurd', delivered: 'Geleverd', cancelled: 'Geannuleerd', refunded: 'Terugbetaald' }[s] || s
}

function paymentLabel (s: string) {
  return { open: 'Open', paid: 'Betaald', failed: 'Mislukt', cancelled: 'Geannuleerd', expired: 'Verlopen' }[s] || s
}
</script>

<style scoped lang="scss">
.orders-page { max-width: 1100px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

.filter-tabs { display: flex; gap: 0.25rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.tab {
  padding: 0.5rem 0.9rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;
  background: white; font-size: 0.82rem; font-weight: 500; color: #64748b;
  cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: all 0.15s;
  &:hover { border-color: #6366f1; color: #6366f1; }
  &.active { background: #6366f1; color: white; border-color: #6366f1; }
}
.tab-count {
  background: rgba(0,0,0,0.1); padding: 0.1rem 0.4rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700;
  .active & { background: rgba(255,255,255,0.25); }
}

.empty-state {
  text-align: center; padding: 4rem 2rem; background: white; border-radius: 1rem; border: 1.5px dashed #e2e8f0;
  svg { color: #94a3b8; margin-bottom: 1rem; }
  p { font-size: 1rem; font-weight: 600; color: #64748b; margin: 0 0 0.3rem; }
  small { color: #94a3b8; font-size: 0.85rem; }
}

.table-card { background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden; }

.orders-table {
  width: 100%; border-collapse: collapse;
  thead tr { background: #f8fafc; }
  th { padding: 0.75rem 1rem; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; text-align: left; white-space: nowrap; }
  td { padding: 0.85rem 1rem; border-top: 1px solid #f1f5f9; font-size: 0.875rem; }
}

.order-row { cursor: pointer; transition: background 0.1s; &:hover { background: #f8fafc; } &.row--selected { background: rgba(99,102,241,0.04); } }
.order-num { font-weight: 700; color: #1e293b; font-size: 0.82rem; }
.customer-info { display: flex; flex-direction: column; }
.customer-name { font-weight: 600; color: #1e293b; }
.customer-email { font-size: 0.78rem; color: #94a3b8; }
.order-date { color: #64748b; white-space: nowrap; }
.order-total { font-weight: 700; color: #1e293b; }

.badge {
  display: inline-flex; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700;
  &--pending { background: rgba(245,158,11,0.1); color: #d97706; }
  &--paid { background: rgba(16,185,129,0.1); color: #059669; }
  &--processing { background: rgba(99,102,241,0.1); color: #4f46e5; }
  &--shipped { background: rgba(6,182,212,0.1); color: #0891b2; }
  &--delivered { background: rgba(34,197,94,0.1); color: #16a34a; }
  &--cancelled { background: rgba(239,68,68,0.1); color: #dc2626; }
  &--refunded { background: rgba(148,163,184,0.1); color: #64748b; }
}
.badge--payment {
  &.pay--open { background: rgba(245,158,11,0.1); color: #d97706; }
  &.pay--paid { background: rgba(16,185,129,0.1); color: #059669; }
  &.pay--failed { background: rgba(239,68,68,0.1); color: #dc2626; }
  &.pay--cancelled, &.pay--expired { background: rgba(148,163,184,0.1); color: #64748b; }
}
.order-actions { text-align: right; }
.action-btn {
  background: none; border: none; padding: 0.35rem; cursor: pointer; color: #94a3b8; border-radius: 0.35rem;
  &:hover { background: #f1f5f9; color: #6366f1; }
}

/* Drawer */
.drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200;
  display: flex; align-items: flex-start; justify-content: flex-end;
}
.drawer {
  width: 460px; max-width: 100vw; background: white; height: 100vh;
  overflow-y: auto; display: flex; flex-direction: column; box-shadow: -8px 0 40px rgba(0,0,0,0.15);
}
.drawer-header {
  display: flex; align-items: flex-start; justify-content: space-between; padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; background: white; z-index: 1;
  h2 { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.2rem; }
  small { color: #94a3b8; font-size: 0.82rem; }
}
.close-btn {
  background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0.25rem;
  border-radius: 0.35rem; flex-shrink: 0; &:hover { color: #475569; background: #f1f5f9; }
}
.drawer-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
.drawer-section h3 { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin: 0 0 0.75rem; }

.info-grid { display: flex; flex-direction: column; gap: 0.5rem; }
.info-row { display: flex; justify-content: space-between; font-size: 0.875rem; span { color: #64748b; } strong { color: #1e293b; } }
.address-block { font-size: 0.875rem; color: #334155; line-height: 1.7; background: #f8fafc; padding: 0.75rem 1rem; border-radius: 0.5rem; }

.items-list { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem; }
.order-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.875rem; }
.item-qty { color: #94a3b8; min-width: 1.5rem; }
.item-name { flex: 1; color: #334155; }
.item-price { font-weight: 700; color: #1e293b; }

.totals-block { border-top: 1px solid #f1f5f9; padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.35rem; }
.total-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: #64748b; }
.total-final { font-weight: 700; color: #1e293b; font-size: 1rem; }

.status-form { display: flex; flex-direction: column; gap: 0.75rem; }
.field-group { display: flex; flex-direction: column; gap: 0.3rem; }
.field-group label { font-size: 0.78rem; font-weight: 600; color: #64748b; }
.field-group select {
  padding: 0.55rem 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 0.5rem;
  font-size: 0.875rem; color: #1e293b; background: white;
  &:focus { outline: none; border-color: #6366f1; }
}
.save-btn {
  padding: 0.65rem 1.25rem; background: #6366f1; color: white; border: none; border-radius: 0.5rem;
  font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: background 0.2s;
  &:hover:not(:disabled) { background: #4f46e5; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
.save-ok { color: #059669; font-size: 0.82rem; font-weight: 600; margin: 0; }

@media (max-width: 720px) {
  .drawer { width: 100vw; }
  .orders-table th:nth-child(3), .orders-table td:nth-child(3),
  .orders-table th:nth-child(6), .orders-table td:nth-child(6) { display: none; }
}
</style>
