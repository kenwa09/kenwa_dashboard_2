import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
    useHead({ title: "Bestellingen \u2014 Kenwa Admin" });
    const { data: ordersData, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-orders", () => $fetch("/api/admin/orders"))), __temp = await __temp, __restore(), __temp);
    const orders = computed(() => {
      var _a;
      return ((_a = ordersData.value) == null ? void 0 : _a.orders) || [];
    });
    const activeTab = ref("");
    const selectedId = ref(null);
    const selectedOrder = ref(null);
    const editStatus = ref("");
    const editPaymentStatus = ref("");
    const saving = ref(false);
    const saveSuccess = ref(false);
    const tabs = [
      { label: "Alle", value: "" },
      { label: "In behandeling", value: "pending" },
      { label: "Betaald", value: "paid" },
      { label: "Verstuurd", value: "shipped" },
      { label: "Geleverd", value: "delivered" },
      { label: "Geannuleerd", value: "cancelled" }
    ];
    const statusOptions = [
      { value: "pending", label: "In behandeling" },
      { value: "paid", label: "Betaald" },
      { value: "processing", label: "In verwerking" },
      { value: "shipped", label: "Verstuurd" },
      { value: "delivered", label: "Geleverd" },
      { value: "cancelled", label: "Geannuleerd" },
      { value: "refunded", label: "Terugbetaald" }
    ];
    const paymentOptions = [
      { value: "open", label: "Open" },
      { value: "paid", label: "Betaald" },
      { value: "failed", label: "Mislukt" },
      { value: "cancelled", label: "Geannuleerd" },
      { value: "expired", label: "Verlopen" }
    ];
    const filteredOrders = computed(
      () => activeTab.value ? orders.value.filter((o) => o.status === activeTab.value) : orders.value
    );
    function countByStatus(status) {
      return orders.value.filter((o) => o.status === status).length;
    }
    function formatDate(d) {
      return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
    }
    function statusLabel(s) {
      return { pending: "In behandeling", paid: "Betaald", processing: "In verwerking", shipped: "Verstuurd", delivered: "Geleverd", cancelled: "Geannuleerd", refunded: "Terugbetaald" }[s] || s;
    }
    function paymentLabel(s) {
      return { open: "Open", paid: "Betaald", failed: "Mislukt", cancelled: "Geannuleerd", expired: "Verlopen" }[s] || s;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "orders-page" }, _attrs))} data-v-cfb0cbcb><div class="page-header" data-v-cfb0cbcb><div data-v-cfb0cbcb><h1 class="page-title" data-v-cfb0cbcb>Bestellingen</h1><p class="page-sub" data-v-cfb0cbcb>${ssrInterpolate(unref(orders).length)} bestellingen totaal</p></div></div><div class="filter-tabs" data-v-cfb0cbcb><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([{ active: unref(activeTab) === tab.value }, "tab"])}" data-v-cfb0cbcb>${ssrInterpolate(tab.label)} `);
        if (tab.value === "" || countByStatus(tab.value) > 0) {
          _push(`<span class="tab-count" data-v-cfb0cbcb>${ssrInterpolate(tab.value === "" ? unref(orders).length : countByStatus(tab.value))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(filteredOrders).length === 0) {
        _push(`<div class="empty-state" data-v-cfb0cbcb><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-cfb0cbcb><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" data-v-cfb0cbcb></path><line x1="3" y1="6" x2="21" y2="6" data-v-cfb0cbcb></line><path d="M16 10a4 4 0 0 1-8 0" data-v-cfb0cbcb></path></svg><p data-v-cfb0cbcb>Geen bestellingen gevonden</p><small data-v-cfb0cbcb>Bestellingen verschijnen hier zodra de shop live is.</small></div>`);
      } else {
        _push(`<div class="table-card" data-v-cfb0cbcb><table class="orders-table" data-v-cfb0cbcb><thead data-v-cfb0cbcb><tr data-v-cfb0cbcb><th data-v-cfb0cbcb>Bestelling</th><th data-v-cfb0cbcb>Klant</th><th data-v-cfb0cbcb>Datum</th><th data-v-cfb0cbcb>Totaal</th><th data-v-cfb0cbcb>Status</th><th data-v-cfb0cbcb>Betaling</th><th data-v-cfb0cbcb></th></tr></thead><tbody data-v-cfb0cbcb><!--[-->`);
        ssrRenderList(unref(filteredOrders), (order) => {
          _push(`<tr class="${ssrRenderClass([{ "row--selected": unref(selectedId) === order.id }, "order-row"])}" data-v-cfb0cbcb><td class="order-num" data-v-cfb0cbcb>#${ssrInterpolate(order.orderNumber)}</td><td data-v-cfb0cbcb><div class="customer-info" data-v-cfb0cbcb><span class="customer-name" data-v-cfb0cbcb>${ssrInterpolate(order.customerName)}</span><span class="customer-email" data-v-cfb0cbcb>${ssrInterpolate(order.customerEmail)}</span></div></td><td class="order-date" data-v-cfb0cbcb>${ssrInterpolate(formatDate(order.createdAt))}</td><td class="order-total" data-v-cfb0cbcb>\u20AC${ssrInterpolate(order.total.toFixed(2))}</td><td data-v-cfb0cbcb><span class="${ssrRenderClass(["badge--" + order.status, "badge"])}" data-v-cfb0cbcb>${ssrInterpolate(statusLabel(order.status))}</span></td><td data-v-cfb0cbcb><span class="${ssrRenderClass(["pay--" + order.paymentStatus, "badge badge--payment"])}" data-v-cfb0cbcb>${ssrInterpolate(paymentLabel(order.paymentStatus))}</span></td><td class="order-actions" data-v-cfb0cbcb><button class="action-btn" data-v-cfb0cbcb><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-cfb0cbcb><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-v-cfb0cbcb></path><circle cx="12" cy="12" r="3" data-v-cfb0cbcb></circle></svg></button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a;
        if (unref(selectedOrder)) {
          _push2(`<div class="drawer-overlay" data-v-cfb0cbcb><div class="drawer" data-v-cfb0cbcb><div class="drawer-header" data-v-cfb0cbcb><div data-v-cfb0cbcb><h2 data-v-cfb0cbcb>Bestelling #${ssrInterpolate(unref(selectedOrder).orderNumber)}</h2><small data-v-cfb0cbcb>${ssrInterpolate(formatDate(unref(selectedOrder).createdAt))}</small></div><button class="close-btn" data-v-cfb0cbcb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-cfb0cbcb><line x1="18" y1="6" x2="6" y2="18" data-v-cfb0cbcb></line><line x1="6" y1="6" x2="18" y2="18" data-v-cfb0cbcb></line></svg></button></div><div class="drawer-body" data-v-cfb0cbcb><div class="drawer-section" data-v-cfb0cbcb><h3 data-v-cfb0cbcb>Klantgegevens</h3><div class="info-grid" data-v-cfb0cbcb><div class="info-row" data-v-cfb0cbcb><span data-v-cfb0cbcb>Naam</span><strong data-v-cfb0cbcb>${ssrInterpolate(unref(selectedOrder).customerName)}</strong></div><div class="info-row" data-v-cfb0cbcb><span data-v-cfb0cbcb>E-mail</span><strong data-v-cfb0cbcb>${ssrInterpolate(unref(selectedOrder).customerEmail)}</strong></div>`);
          if (unref(selectedOrder).customerPhone) {
            _push2(`<div class="info-row" data-v-cfb0cbcb><span data-v-cfb0cbcb>Telefoon</span><strong data-v-cfb0cbcb>${ssrInterpolate(unref(selectedOrder).customerPhone)}</strong></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div><div class="drawer-section" data-v-cfb0cbcb><h3 data-v-cfb0cbcb>Bezorgadres</h3><div class="address-block" data-v-cfb0cbcb>${ssrInterpolate(unref(selectedOrder).shippingAddress.street)}<br data-v-cfb0cbcb> ${ssrInterpolate(unref(selectedOrder).shippingAddress.postcode)} ${ssrInterpolate(unref(selectedOrder).shippingAddress.city)}<br data-v-cfb0cbcb> ${ssrInterpolate(unref(selectedOrder).shippingAddress.country)}</div></div>`);
          if ((_a = unref(selectedOrder).items) == null ? void 0 : _a.length) {
            _push2(`<div class="drawer-section" data-v-cfb0cbcb><h3 data-v-cfb0cbcb>Producten</h3><div class="items-list" data-v-cfb0cbcb><!--[-->`);
            ssrRenderList(unref(selectedOrder).items, (item) => {
              _push2(`<div class="order-item" data-v-cfb0cbcb><span class="item-qty" data-v-cfb0cbcb>${ssrInterpolate(item.quantity)}\xD7</span><span class="item-name" data-v-cfb0cbcb>${ssrInterpolate(item.productName)}</span><span class="item-price" data-v-cfb0cbcb>\u20AC${ssrInterpolate((item.price * item.quantity).toFixed(2))}</span></div>`);
            });
            _push2(`<!--]--></div><div class="totals-block" data-v-cfb0cbcb><div class="total-row" data-v-cfb0cbcb><span data-v-cfb0cbcb>Subtotaal</span><span data-v-cfb0cbcb>\u20AC${ssrInterpolate(unref(selectedOrder).subtotal.toFixed(2))}</span></div><div class="total-row" data-v-cfb0cbcb><span data-v-cfb0cbcb>Verzendkosten</span><span data-v-cfb0cbcb>\u20AC${ssrInterpolate(unref(selectedOrder).shippingCost.toFixed(2))}</span></div><div class="total-row total-final" data-v-cfb0cbcb><span data-v-cfb0cbcb>Totaal</span><span data-v-cfb0cbcb>\u20AC${ssrInterpolate(unref(selectedOrder).total.toFixed(2))}</span></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="drawer-section" data-v-cfb0cbcb><h3 data-v-cfb0cbcb>Status bijwerken</h3><div class="status-form" data-v-cfb0cbcb><div class="field-group" data-v-cfb0cbcb><label data-v-cfb0cbcb>Bestelstatus</label><select data-v-cfb0cbcb><!--[-->`);
          ssrRenderList(statusOptions, (s) => {
            _push2(`<option${ssrRenderAttr("value", s.value)} data-v-cfb0cbcb${ssrIncludeBooleanAttr(Array.isArray(unref(editStatus)) ? ssrLooseContain(unref(editStatus), s.value) : ssrLooseEqual(unref(editStatus), s.value)) ? " selected" : ""}>${ssrInterpolate(s.label)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="field-group" data-v-cfb0cbcb><label data-v-cfb0cbcb>Betaalstatus</label><select data-v-cfb0cbcb><!--[-->`);
          ssrRenderList(paymentOptions, (s) => {
            _push2(`<option${ssrRenderAttr("value", s.value)} data-v-cfb0cbcb${ssrIncludeBooleanAttr(Array.isArray(unref(editPaymentStatus)) ? ssrLooseContain(unref(editPaymentStatus), s.value) : ssrLooseEqual(unref(editPaymentStatus), s.value)) ? " selected" : ""}>${ssrInterpolate(s.label)}</option>`);
          });
          _push2(`<!--]--></select></div><button class="save-btn"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-cfb0cbcb>${ssrInterpolate(unref(saving) ? "Opslaan\u2026" : "Status opslaan")}</button>`);
          if (unref(saveSuccess)) {
            _push2(`<p class="save-ok" data-v-cfb0cbcb>Opgeslagen!</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cfb0cbcb"]]);

export { index as default };
//# sourceMappingURL=index-Dpjjx7Ar.mjs.map
