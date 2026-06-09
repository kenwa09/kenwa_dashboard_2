<template>
  <div class="invoices-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Facturen</h1>
        <p class="page-sub">{{ invoices.length }} betaalde bestellingen</p>
      </div>
    </div>

    <div v-if="invoices.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
      <p>Nog geen facturen</p>
      <small>Facturen verschijnen hier zodra bestellingen zijn betaald.</small>
    </div>

    <div v-else class="table-card">
      <table class="invoices-table">
        <thead>
          <tr>
            <th>Factuurnr.</th>
            <th>Datum</th>
            <th>Klant</th>
            <th>E-mail</th>
            <th>Totaal</th>
            <th>BTW (21%)</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in invoices" :key="order.id">
            <td class="inv-num">#{{ order.orderNumber }}</td>
            <td class="inv-date">{{ formatDate(order.createdAt) }}</td>
            <td class="inv-name">{{ order.customerName }}</td>
            <td class="inv-email">{{ order.customerEmail }}</td>
            <td class="inv-total">€{{ order.total.toFixed(2) }}</td>
            <td class="inv-vat">€{{ (order.total * 0.21 / 1.21).toFixed(2) }}</td>
            <td><span class="badge" :class="'badge--' + order.status">{{ statusLabel(order.status) }}</span></td>
            <td class="inv-actions">
              <button class="print-btn" @click="printInvoice(order)" title="Afdrukken / PDF">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Afdrukken
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Print preview modal -->
    <Teleport to="body">
      <div v-if="printOrder" class="print-overlay" @click.self="printOrder = null">
        <div class="print-modal">
          <div class="print-toolbar no-print">
            <button class="print-action" @click="doPrint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Afdrukken / Opslaan als PDF
            </button>
            <button class="close-btn" @click="printOrder = null">Sluiten</button>
          </div>

          <!-- Invoice document -->
          <div class="invoice-doc" id="invoice-print">
            <div class="inv-header">
              <div class="inv-brand">
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#6741ff"/>
                  <path d="M20 10C15.58 10 12 13.58 12 18C12 24.5 20 32 20 32C20 32 28 24.5 28 18C28 13.58 24.42 10 20 10ZM20 21C18.34 21 17 19.66 17 18C17 16.34 18.34 15 20 15C21.66 15 23 16.34 23 18C23 19.66 21.66 21 20 21Z" fill="white"/>
                </svg>
                <div>
                  <strong>Kenwa</strong>
                  <span>kenwa.nl</span>
                </div>
              </div>
              <div class="inv-meta">
                <h1>FACTUUR</h1>
                <table class="meta-table">
                  <tr><td>Factuurnummer</td><td><strong>#{{ printOrder.orderNumber }}</strong></td></tr>
                  <tr><td>Datum</td><td>{{ formatDate(printOrder.createdAt) }}</td></tr>
                  <tr><td>Status</td><td>{{ statusLabel(printOrder.status) }}</td></tr>
                </table>
              </div>
            </div>

            <div class="inv-parties">
              <div class="inv-from">
                <h4>Van</h4>
                <p>Kenwa<br>kenwa.nl<br>Nederland</p>
              </div>
              <div class="inv-to">
                <h4>Aan</h4>
                <p>
                  {{ printOrder.customerName }}<br>
                  {{ printOrder.shippingAddress?.street }}<br>
                  {{ printOrder.shippingAddress?.postcode }} {{ printOrder.shippingAddress?.city }}<br>
                  {{ printOrder.shippingAddress?.country }}<br>
                  {{ printOrder.customerEmail }}
                </p>
              </div>
            </div>

            <table class="inv-items-table" v-if="printOrder.items?.length">
              <thead>
                <tr><th>Product</th><th>Aantal</th><th>Stukprijs</th><th>Totaal</th></tr>
              </thead>
              <tbody>
                <tr v-for="item in printOrder.items" :key="item.id">
                  <td>{{ item.productName }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>€{{ item.price.toFixed(2) }}</td>
                  <td>€{{ (item.price * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>

            <div class="inv-totals">
              <table>
                <tr><td>Subtotaal</td><td>€{{ printOrder.subtotal.toFixed(2) }}</td></tr>
                <tr><td>Verzendkosten</td><td>€{{ printOrder.shippingCost.toFixed(2) }}</td></tr>
                <tr class="tr-vat"><td>BTW (21%)</td><td>€{{ (printOrder.total * 0.21 / 1.21).toFixed(2) }}</td></tr>
                <tr class="tr-total"><td><strong>Totaal incl. BTW</strong></td><td><strong>€{{ printOrder.total.toFixed(2) }}</strong></td></tr>
              </table>
            </div>

            <div class="inv-footer">
              <p>Bedankt voor uw bestelling bij Kenwa!</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })
useHead({ title: 'Facturen — Kenwa Admin' })

interface OrderItem { id: string; productName: string; quantity: number; price: number }
interface Order {
  id: string; orderNumber: string; customerName: string; customerEmail: string
  shippingAddress: { street: string; city: string; postcode: string; country: string }
  status: string; paymentStatus: string; subtotal: number; shippingCost: number; total: number
  createdAt: string; items?: OrderItem[]
}

const { data: ordersData } = await useAsyncData('admin-invoices', () =>
  $fetch<{ orders: Order[] }>('/api/admin/orders?status=paid')
)
const invoices = computed(() => ordersData.value?.orders || [])
const printOrder = ref<Order | null>(null)

function doPrint () {
  if (import.meta.client) (globalThis as unknown as { print(): void }).print()
}

async function printInvoice (order: Order) {
  const data = await $fetch<{ order: Order }>(`/api/admin/orders/${order.id}`)
  printOrder.value = data.order
}

function formatDate (d: string) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function statusLabel (s: string): string {
  return ({ pending: 'In behandeling', paid: 'Betaald', processing: 'In verwerking', shipped: 'Verstuurd', delivered: 'Geleverd', cancelled: 'Geannuleerd', refunded: 'Terugbetaald' } as Record<string, string>)[s] || s
}
</script>

<style scoped lang="scss">
.invoices-page { max-width: 1100px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

.empty-state {
  text-align: center; padding: 4rem 2rem; background: white; border-radius: 1rem; border: 1.5px dashed #e2e8f0;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  svg { color: #94a3b8; }
  p { font-size: 1rem; font-weight: 600; color: #64748b; margin: 0; }
  small { color: #94a3b8; font-size: 0.85rem; }
}

.table-card { background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden; }
.invoices-table {
  width: 100%; border-collapse: collapse;
  thead tr { background: #f8fafc; }
  th { padding: 0.65rem 1rem; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; text-align: left; }
  td { padding: 0.8rem 1rem; font-size: 0.875rem; color: #334155; border-top: 1px solid #f1f5f9; }
  tr:hover td { background: #f8fafc; }
}
.inv-num { font-weight: 700; color: #1e293b; }
.inv-date, .inv-email { color: #64748b; }
.inv-name { font-weight: 600; }
.inv-total { font-weight: 700; color: #1e293b; }
.inv-vat { color: #6366f1; font-weight: 600; }
.inv-actions { text-align: right; }

.badge {
  display: inline-flex; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700;
  &--paid { background: rgba(16,185,129,0.1); color: #059669; }
  &--delivered { background: rgba(34,197,94,0.1); color: #16a34a; }
  &--shipped { background: rgba(6,182,212,0.1); color: #0891b2; }
  &--cancelled { background: rgba(239,68,68,0.1); color: #dc2626; }
}

.print-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 0.4rem;
  background: white; color: #64748b; font-size: 0.78rem; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  &:hover { border-color: #6366f1; color: #6366f1; }
}

/* Print modal */
.print-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;
  display: flex; align-items: flex-start; justify-content: center; padding: 2rem;
  overflow-y: auto;
}
.print-modal {
  background: #f1f5f9; border-radius: 0.75rem; width: 100%; max-width: 760px;
}
.print-toolbar {
  display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem;
  padding: 0.75rem 1rem;
}
.print-action {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 1rem; background: #6366f1; color: white; border: none;
  border-radius: 0.45rem; font-weight: 700; font-size: 0.875rem; cursor: pointer;
  &:hover { background: #4f46e5; }
}
.close-btn {
  padding: 0.55rem 1rem; background: white; color: #64748b; border: 1.5px solid #e2e8f0;
  border-radius: 0.45rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;
  &:hover { border-color: #94a3b8; }
}

/* Invoice document */
.invoice-doc {
  background: white; padding: 2.5rem; margin: 0 1rem 1rem;
  border-radius: 0.5rem; box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.inv-header {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;
}
.inv-brand {
  display: flex; align-items: center; gap: 0.75rem;
  strong { display: block; font-size: 1.1rem; font-weight: 800; color: #0f172a; }
  span { font-size: 0.82rem; color: #64748b; }
}
.inv-meta { text-align: right; }
.inv-meta h1 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 0.75rem; letter-spacing: 0.05em; }
.meta-table { margin-left: auto; }
.meta-table td { font-size: 0.82rem; padding: 0.15rem 0.5rem; color: #475569; }
.meta-table td:first-child { color: #94a3b8; padding-left: 0; }

.inv-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
.inv-parties h4 { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin: 0 0 0.5rem; }
.inv-parties p { font-size: 0.875rem; color: #334155; margin: 0; line-height: 1.7; }

.inv-items-table {
  width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;
  thead { background: #f8fafc; }
  th { padding: 0.6rem 0.75rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; text-align: left; border-bottom: 2px solid #e2e8f0; }
  td { padding: 0.6rem 0.75rem; font-size: 0.875rem; color: #334155; border-bottom: 1px solid #f1f5f9; }
  td:last-child, th:last-child { text-align: right; }
}

.inv-totals {
  display: flex; justify-content: flex-end; margin-bottom: 2rem;
  table { min-width: 260px; }
  td { padding: 0.35rem 0.5rem; font-size: 0.875rem; color: #475569; }
  td:last-child { text-align: right; font-weight: 600; color: #1e293b; }
}
.tr-vat td { color: #6366f1; }
.tr-total td { border-top: 2px solid #e2e8f0; font-size: 1rem; padding-top: 0.6rem; }

.inv-footer {
  border-top: 1px solid #f1f5f9; padding-top: 1rem; text-align: center;
  p { font-size: 0.85rem; color: #94a3b8; margin: 0; }
}

@media print {
  .no-print { display: none !important; }
  .print-overlay { position: static; background: none; padding: 0; }
  .print-modal { background: white; border-radius: 0; }
  .invoice-doc { margin: 0; box-shadow: none; padding: 1.5rem; }
}
</style>
