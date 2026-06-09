import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { u as useHead } from './v3-CbE34IEh.mjs';
import { u as useAsyncData } from './asyncData-1o0-ILe1.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Facturen \u2014 Kenwa Admin" });
    const { data: ordersData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-invoices",
      () => $fetch("/api/admin/orders?status=paid")
    )), __temp = await __temp, __restore(), __temp);
    const invoices = computed(() => {
      var _a;
      return ((_a = ordersData.value) == null ? void 0 : _a.orders) || [];
    });
    const printOrder = ref(null);
    function formatDate(d) {
      return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
    }
    function statusLabel(s) {
      return { pending: "In behandeling", paid: "Betaald", processing: "In verwerking", shipped: "Verstuurd", delivered: "Geleverd", cancelled: "Geannuleerd", refunded: "Terugbetaald" }[s] || s;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "invoices-page" }, _attrs))} data-v-f1d4850f><div class="page-header" data-v-f1d4850f><div data-v-f1d4850f><h1 class="page-title" data-v-f1d4850f>Facturen</h1><p class="page-sub" data-v-f1d4850f>${ssrInterpolate(unref(invoices).length)} betaalde bestellingen</p></div></div>`);
      if (unref(invoices).length === 0) {
        _push(`<div class="empty-state" data-v-f1d4850f><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-f1d4850f><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-f1d4850f></path><polyline points="14 2 14 8 20 8" data-v-f1d4850f></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-f1d4850f></line><line x1="16" y1="17" x2="8" y2="17" data-v-f1d4850f></line></svg><p data-v-f1d4850f>Nog geen facturen</p><small data-v-f1d4850f>Facturen verschijnen hier zodra bestellingen zijn betaald.</small></div>`);
      } else {
        _push(`<div class="table-card" data-v-f1d4850f><table class="invoices-table" data-v-f1d4850f><thead data-v-f1d4850f><tr data-v-f1d4850f><th data-v-f1d4850f>Factuurnr.</th><th data-v-f1d4850f>Datum</th><th data-v-f1d4850f>Klant</th><th data-v-f1d4850f>E-mail</th><th data-v-f1d4850f>Totaal</th><th data-v-f1d4850f>BTW (21%)</th><th data-v-f1d4850f>Status</th><th data-v-f1d4850f></th></tr></thead><tbody data-v-f1d4850f><!--[-->`);
        ssrRenderList(unref(invoices), (order) => {
          _push(`<tr data-v-f1d4850f><td class="inv-num" data-v-f1d4850f>#${ssrInterpolate(order.orderNumber)}</td><td class="inv-date" data-v-f1d4850f>${ssrInterpolate(formatDate(order.createdAt))}</td><td class="inv-name" data-v-f1d4850f>${ssrInterpolate(order.customerName)}</td><td class="inv-email" data-v-f1d4850f>${ssrInterpolate(order.customerEmail)}</td><td class="inv-total" data-v-f1d4850f>\u20AC${ssrInterpolate(order.total.toFixed(2))}</td><td class="inv-vat" data-v-f1d4850f>\u20AC${ssrInterpolate((order.total * 0.21 / 1.21).toFixed(2))}</td><td data-v-f1d4850f><span class="${ssrRenderClass(["badge--" + order.status, "badge"])}" data-v-f1d4850f>${ssrInterpolate(statusLabel(order.status))}</span></td><td class="inv-actions" data-v-f1d4850f><button class="print-btn" title="Afdrukken / PDF" data-v-f1d4850f><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-f1d4850f><polyline points="6 9 6 2 18 2 18 9" data-v-f1d4850f></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" data-v-f1d4850f></path><rect x="6" y="14" width="12" height="8" data-v-f1d4850f></rect></svg> Afdrukken </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b, _c, _d, _e;
        if (unref(printOrder)) {
          _push2(`<div class="print-overlay" data-v-f1d4850f><div class="print-modal" data-v-f1d4850f><div class="print-toolbar no-print" data-v-f1d4850f><button class="print-action" data-v-f1d4850f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-f1d4850f><polyline points="6 9 6 2 18 2 18 9" data-v-f1d4850f></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" data-v-f1d4850f></path><rect x="6" y="14" width="12" height="8" data-v-f1d4850f></rect></svg> Afdrukken / Opslaan als PDF </button><button class="close-btn" data-v-f1d4850f>Sluiten</button></div><div class="invoice-doc" id="invoice-print" data-v-f1d4850f><div class="inv-header" data-v-f1d4850f><div class="inv-brand" data-v-f1d4850f><svg width="36" height="36" viewBox="0 0 40 40" fill="none" data-v-f1d4850f><circle cx="20" cy="20" r="20" fill="#6741ff" data-v-f1d4850f></circle><path d="M20 10C15.58 10 12 13.58 12 18C12 24.5 20 32 20 32C20 32 28 24.5 28 18C28 13.58 24.42 10 20 10ZM20 21C18.34 21 17 19.66 17 18C17 16.34 18.34 15 20 15C21.66 15 23 16.34 23 18C23 19.66 21.66 21 20 21Z" fill="white" data-v-f1d4850f></path></svg><div data-v-f1d4850f><strong data-v-f1d4850f>Kenwa</strong><span data-v-f1d4850f>kenwa.nl</span></div></div><div class="inv-meta" data-v-f1d4850f><h1 data-v-f1d4850f>FACTUUR</h1><table class="meta-table" data-v-f1d4850f><tr data-v-f1d4850f><td data-v-f1d4850f>Factuurnummer</td><td data-v-f1d4850f><strong data-v-f1d4850f>#${ssrInterpolate(unref(printOrder).orderNumber)}</strong></td></tr><tr data-v-f1d4850f><td data-v-f1d4850f>Datum</td><td data-v-f1d4850f>${ssrInterpolate(formatDate(unref(printOrder).createdAt))}</td></tr><tr data-v-f1d4850f><td data-v-f1d4850f>Status</td><td data-v-f1d4850f>${ssrInterpolate(statusLabel(unref(printOrder).status))}</td></tr></table></div></div><div class="inv-parties" data-v-f1d4850f><div class="inv-from" data-v-f1d4850f><h4 data-v-f1d4850f>Van</h4><p data-v-f1d4850f>Kenwa<br data-v-f1d4850f>kenwa.nl<br data-v-f1d4850f>Nederland</p></div><div class="inv-to" data-v-f1d4850f><h4 data-v-f1d4850f>Aan</h4><p data-v-f1d4850f>${ssrInterpolate(unref(printOrder).customerName)}<br data-v-f1d4850f> ${ssrInterpolate((_a = unref(printOrder).shippingAddress) == null ? void 0 : _a.street)}<br data-v-f1d4850f> ${ssrInterpolate((_b = unref(printOrder).shippingAddress) == null ? void 0 : _b.postcode)} ${ssrInterpolate((_c = unref(printOrder).shippingAddress) == null ? void 0 : _c.city)}<br data-v-f1d4850f> ${ssrInterpolate((_d = unref(printOrder).shippingAddress) == null ? void 0 : _d.country)}<br data-v-f1d4850f> ${ssrInterpolate(unref(printOrder).customerEmail)}</p></div></div>`);
          if ((_e = unref(printOrder).items) == null ? void 0 : _e.length) {
            _push2(`<table class="inv-items-table" data-v-f1d4850f><thead data-v-f1d4850f><tr data-v-f1d4850f><th data-v-f1d4850f>Product</th><th data-v-f1d4850f>Aantal</th><th data-v-f1d4850f>Stukprijs</th><th data-v-f1d4850f>Totaal</th></tr></thead><tbody data-v-f1d4850f><!--[-->`);
            ssrRenderList(unref(printOrder).items, (item) => {
              _push2(`<tr data-v-f1d4850f><td data-v-f1d4850f>${ssrInterpolate(item.productName)}</td><td data-v-f1d4850f>${ssrInterpolate(item.quantity)}</td><td data-v-f1d4850f>\u20AC${ssrInterpolate(item.price.toFixed(2))}</td><td data-v-f1d4850f>\u20AC${ssrInterpolate((item.price * item.quantity).toFixed(2))}</td></tr>`);
            });
            _push2(`<!--]--></tbody></table>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="inv-totals" data-v-f1d4850f><table data-v-f1d4850f><tr data-v-f1d4850f><td data-v-f1d4850f>Subtotaal</td><td data-v-f1d4850f>\u20AC${ssrInterpolate(unref(printOrder).subtotal.toFixed(2))}</td></tr><tr data-v-f1d4850f><td data-v-f1d4850f>Verzendkosten</td><td data-v-f1d4850f>\u20AC${ssrInterpolate(unref(printOrder).shippingCost.toFixed(2))}</td></tr><tr class="tr-vat" data-v-f1d4850f><td data-v-f1d4850f>BTW (21%)</td><td data-v-f1d4850f>\u20AC${ssrInterpolate((unref(printOrder).total * 0.21 / 1.21).toFixed(2))}</td></tr><tr class="tr-total" data-v-f1d4850f><td data-v-f1d4850f><strong data-v-f1d4850f>Totaal incl. BTW</strong></td><td data-v-f1d4850f><strong data-v-f1d4850f>\u20AC${ssrInterpolate(unref(printOrder).total.toFixed(2))}</strong></td></tr></table></div><div class="inv-footer" data-v-f1d4850f><p data-v-f1d4850f>Bedankt voor uw bestelling bij Kenwa!</p></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/invoices/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f1d4850f"]]);

export { index as default };
//# sourceMappingURL=index-C5susxZq.mjs.map
