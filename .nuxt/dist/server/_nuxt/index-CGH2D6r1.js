import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/hookable/dist/index.mjs";
import { u as useHead } from "./v3-CbE34IEh.js";
import { u as useAsyncData } from "./asyncData-1o0-ILe1.js";
import { _ as _export_sfc } from "../server.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/@unhead/vue/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/perfect-debounce/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/unctx/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/defu/dist/defu.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ufo/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Boekhouding — Kenwa Admin" });
    const { data: stats } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-accounting", () => $fetch("/api/admin/accounting"))), __temp = await __temp, __restore(), __temp);
    const vatThisMonth = computed(() => (stats.value?.thisMonth?.revenue || 0) * 0.21 / 1.21);
    function fmtCurrency(n) {
      return n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function formatMonth(m) {
      const [year, month] = m.split("-");
      const d = new Date(Number(year), Number(month) - 1);
      return d.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "accounting-page" }, _attrs))} data-v-310e0790><div class="page-header" data-v-310e0790><div data-v-310e0790><h1 class="page-title" data-v-310e0790>Boekhouding</h1><p class="page-sub" data-v-310e0790>Omzet en financieel overzicht</p></div><a href="/api/admin/accounting/export" class="export-btn" target="_blank" data-v-310e0790><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-310e0790><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-310e0790></path><polyline points="7 10 12 15 17 10" data-v-310e0790></polyline><line x1="12" y1="15" x2="12" y2="3" data-v-310e0790></line></svg> Exporteren (CSV) </a></div><div class="kpi-grid" data-v-310e0790><div class="kpi-card" data-v-310e0790><span class="kpi-label" data-v-310e0790>Omzet deze maand</span><span class="kpi-value" data-v-310e0790>€${ssrInterpolate(fmtCurrency(unref(stats)?.thisMonth?.revenue || 0))}</span><span class="kpi-sub" data-v-310e0790>${ssrInterpolate(unref(stats)?.thisMonth?.orders || 0)} bestellingen</span></div><div class="kpi-card" data-v-310e0790><span class="kpi-label" data-v-310e0790>Totale omzet</span><span class="kpi-value" data-v-310e0790>€${ssrInterpolate(fmtCurrency(unref(stats)?.totals?.revenue || 0))}</span><span class="kpi-sub" data-v-310e0790>${ssrInterpolate(unref(stats)?.totals?.orders || 0)} bestellingen</span></div><div class="kpi-card" data-v-310e0790><span class="kpi-label" data-v-310e0790>BTW (21%) deze maand</span><span class="kpi-value" data-v-310e0790>€${ssrInterpolate(fmtCurrency(unref(vatThisMonth)))}</span><span class="kpi-sub" data-v-310e0790>Over €${ssrInterpolate(fmtCurrency((unref(stats)?.thisMonth?.revenue || 0) * 100 / 121))} excl. BTW</span></div><div class="kpi-card" data-v-310e0790><span class="kpi-label" data-v-310e0790>Shop aanmeldingen</span><span class="kpi-value" data-v-310e0790>${ssrInterpolate(unref(stats)?.shopNotifyCount || 0)}</span><span class="kpi-sub" data-v-310e0790>Geïnteresseerde bezoekers</span></div></div><div class="table-card" data-v-310e0790><div class="table-header" data-v-310e0790><h2 data-v-310e0790>Maandoverzicht</h2><span class="table-note" data-v-310e0790>Bedragen incl. BTW (21%)</span></div>`);
      if (!unref(stats)?.monthly?.length) {
        _push(`<div class="no-data" data-v-310e0790><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-310e0790><line x1="18" y1="20" x2="18" y2="10" data-v-310e0790></line><line x1="12" y1="20" x2="12" y2="4" data-v-310e0790></line><line x1="6" y1="20" x2="6" y2="14" data-v-310e0790></line></svg><p data-v-310e0790>Nog geen omzetdata. Bestellingen verschijnen hier zodra de shop live is.</p></div>`);
      } else {
        _push(`<table class="monthly-table" data-v-310e0790><thead data-v-310e0790><tr data-v-310e0790><th data-v-310e0790>Maand</th><th data-v-310e0790>Bestellingen</th><th data-v-310e0790>Subtotaal</th><th data-v-310e0790>Verzending</th><th data-v-310e0790>Totaal (incl. BTW)</th><th data-v-310e0790>BTW (21%)</th><th data-v-310e0790>Excl. BTW</th></tr></thead><tbody data-v-310e0790><!--[-->`);
        ssrRenderList(unref(stats).monthly, (row) => {
          _push(`<tr data-v-310e0790><td class="month-cell" data-v-310e0790>${ssrInterpolate(formatMonth(row.month))}</td><td data-v-310e0790>${ssrInterpolate(row.orderCount)}</td><td data-v-310e0790>€${ssrInterpolate(fmtCurrency(row.subtotal))}</td><td data-v-310e0790>€${ssrInterpolate(fmtCurrency(row.shipping))}</td><td class="total-cell" data-v-310e0790>€${ssrInterpolate(fmtCurrency(row.total))}</td><td class="vat-cell" data-v-310e0790>€${ssrInterpolate(fmtCurrency(row.vat))}</td><td data-v-310e0790>€${ssrInterpolate(fmtCurrency(row.total - row.vat))}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot data-v-310e0790><tr data-v-310e0790><td data-v-310e0790><strong data-v-310e0790>Totaal</strong></td><td data-v-310e0790><strong data-v-310e0790>${ssrInterpolate(unref(stats).totals.orders)}</strong></td><td data-v-310e0790></td><td data-v-310e0790></td><td data-v-310e0790><strong data-v-310e0790>€${ssrInterpolate(fmtCurrency(unref(stats).totals.revenue))}</strong></td><td data-v-310e0790><strong data-v-310e0790>€${ssrInterpolate(fmtCurrency(unref(stats).totals.revenue * 0.21 / 1.21))}</strong></td><td data-v-310e0790><strong data-v-310e0790>€${ssrInterpolate(fmtCurrency(unref(stats).totals.revenue / 1.21))}</strong></td></tr></tfoot></table>`);
      }
      _push(`</div><div class="info-box" data-v-310e0790><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-310e0790><circle cx="12" cy="12" r="10" data-v-310e0790></circle><line x1="12" y1="8" x2="12" y2="12" data-v-310e0790></line><line x1="12" y1="16" x2="12.01" y2="16" data-v-310e0790></line></svg><div data-v-310e0790><strong data-v-310e0790>BTW-aangifte herinnering</strong><p data-v-310e0790>Als startende ondernemer doe je BTW-aangifte per kwartaal via Mijn Belastingdienst Zakelijk. Gebruik de CSV-export voor je administratie.</p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/accounting/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-310e0790"]]);
export {
  index as default
};
//# sourceMappingURL=index-CGH2D6r1.js.map
