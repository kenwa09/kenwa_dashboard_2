<template>
  <div class="accounting-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Boekhouding</h1>
        <p class="page-sub">Omzet en financieel overzicht</p>
      </div>
      <a href="/api/admin/accounting/export" class="export-btn" target="_blank">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Exporteren (CSV)
      </a>
    </div>

    <!-- KPI cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-label">Omzet deze maand</span>
        <span class="kpi-value">€{{ fmtCurrency(stats?.thisMonth?.revenue || 0) }}</span>
        <span class="kpi-sub">{{ stats?.thisMonth?.orders || 0 }} bestellingen</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Totale omzet</span>
        <span class="kpi-value">€{{ fmtCurrency(stats?.totals?.revenue || 0) }}</span>
        <span class="kpi-sub">{{ stats?.totals?.orders || 0 }} bestellingen</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">BTW (21%) deze maand</span>
        <span class="kpi-value">€{{ fmtCurrency(vatThisMonth) }}</span>
        <span class="kpi-sub">Over €{{ fmtCurrency((stats?.thisMonth?.revenue || 0) * 100 / 121) }} excl. BTW</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Shop aanmeldingen</span>
        <span class="kpi-value">{{ stats?.shopNotifyCount || 0 }}</span>
        <span class="kpi-sub">Geïnteresseerde bezoekers</span>
      </div>
    </div>

    <!-- Monthly table -->
    <div class="table-card">
      <div class="table-header">
        <h2>Maandoverzicht</h2>
        <span class="table-note">Bedragen incl. BTW (21%)</span>
      </div>

      <div v-if="!stats?.monthly?.length" class="no-data">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <p>Nog geen omzetdata. Bestellingen verschijnen hier zodra de shop live is.</p>
      </div>

      <table v-else class="monthly-table">
        <thead>
          <tr>
            <th>Maand</th>
            <th>Bestellingen</th>
            <th>Subtotaal</th>
            <th>Verzending</th>
            <th>Totaal (incl. BTW)</th>
            <th>BTW (21%)</th>
            <th>Excl. BTW</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in stats.monthly" :key="row.month">
            <td class="month-cell">{{ formatMonth(row.month) }}</td>
            <td>{{ row.orderCount }}</td>
            <td>€{{ fmtCurrency(row.subtotal) }}</td>
            <td>€{{ fmtCurrency(row.shipping) }}</td>
            <td class="total-cell">€{{ fmtCurrency(row.total) }}</td>
            <td class="vat-cell">€{{ fmtCurrency(row.vat) }}</td>
            <td>€{{ fmtCurrency(row.total - row.vat) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Totaal</strong></td>
            <td><strong>{{ stats.totals.orders }}</strong></td>
            <td></td>
            <td></td>
            <td><strong>€{{ fmtCurrency(stats.totals.revenue) }}</strong></td>
            <td><strong>€{{ fmtCurrency(stats.totals.revenue * 0.21 / 1.21) }}</strong></td>
            <td><strong>€{{ fmtCurrency(stats.totals.revenue / 1.21) }}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- BTW info box -->
    <div class="info-box">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <div>
        <strong>BTW-aangifte herinnering</strong>
        <p>Als startende ondernemer doe je BTW-aangifte per kwartaal via Mijn Belastingdienst Zakelijk. Gebruik de CSV-export voor je administratie.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })
useHead({ title: 'Boekhouding — Kenwa Admin' })

interface MonthRow { month: string; orderCount: number; subtotal: number; shipping: number; total: number; vat: number }
interface Stats {
  monthly: MonthRow[]
  totals: { orders: number; revenue: number }
  thisMonth: { orders: number; revenue: number }
  shopNotifyCount: number
}

const { data: stats } = await useAsyncData('admin-accounting', () => $fetch<Stats>('/api/admin/accounting'))

const vatThisMonth = computed(() => (stats.value?.thisMonth?.revenue || 0) * 0.21 / 1.21)

function fmtCurrency (n: number) {
  return n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatMonth (m: string) {
  const [year, month] = m.split('-')
  const d = new Date(Number(year), Number(month) - 1)
  return d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
}
</script>

<style scoped lang="scss">
.accounting-page { max-width: 1100px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.2rem; color: #0f172a; }
.page-sub { margin: 0; font-size: 0.88rem; color: #94a3b8; }

.export-btn {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.1rem; background: white; color: #334155;
  border: 1.5px solid #e2e8f0; border-radius: 0.5rem; font-weight: 700;
  font-size: 0.875rem; text-decoration: none; transition: all 0.2s; white-space: nowrap;
  &:hover { border-color: #6366f1; color: #6366f1; }
}

.kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem; }
.kpi-card {
  background: white; border-radius: 0.85rem; padding: 1.2rem 1.3rem;
  border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.25rem;
}
.kpi-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; }
.kpi-value { font-size: 1.75rem; font-weight: 800; color: #0f172a; line-height: 1.1; }
.kpi-sub { font-size: 0.78rem; color: #94a3b8; }

.table-card { background: white; border-radius: 1rem; border: 1px solid #f1f5f9; overflow: hidden; margin-bottom: 1rem; }
.table-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9;
  h2 { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin: 0; }
}
.table-note { font-size: 0.78rem; color: #94a3b8; }

.no-data {
  display: flex; align-items: center; gap: 0.75rem; padding: 2.5rem 1.25rem;
  color: #94a3b8;
  p { font-size: 0.875rem; margin: 0; }
}

.monthly-table {
  width: 100%; border-collapse: collapse;
  th { padding: 0.65rem 1rem; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; text-align: left; background: #f8fafc; }
  td { padding: 0.75rem 1rem; font-size: 0.875rem; color: #334155; border-top: 1px solid #f1f5f9; }
  tfoot td { border-top: 2px solid #e2e8f0; background: #f8fafc; }
}
.month-cell { font-weight: 600; color: #1e293b; white-space: nowrap; }
.total-cell { font-weight: 700; color: #1e293b; }
.vat-cell { color: #6366f1; font-weight: 600; }

.info-box {
  display: flex; gap: 0.85rem; padding: 1rem 1.25rem;
  background: rgba(99,102,241,0.04); border: 1px solid rgba(99,102,241,0.15); border-radius: 0.85rem;
  align-items: flex-start;
  svg { color: #6366f1; flex-shrink: 0; margin-top: 0.1rem; }
  strong { display: block; font-size: 0.875rem; color: #1e293b; margin-bottom: 0.2rem; }
  p { font-size: 0.82rem; color: #64748b; margin: 0; line-height: 1.5; }
}
</style>
