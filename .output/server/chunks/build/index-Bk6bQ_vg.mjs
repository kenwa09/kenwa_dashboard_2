import { defineComponent, withAsyncContext, computed, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
    useHead({ title: "Producten \u2014 Kenwa Admin" });
    const { data: productsData, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-products", () => $fetch("/api/admin/products"))), __temp = await __temp, __restore(), __temp);
    const products = computed(() => {
      var _a;
      return ((_a = productsData.value) == null ? void 0 : _a.products) || [];
    });
    const activeCount = computed(() => products.value.filter((p) => p.active).length);
    const showModal = ref(false);
    const editProduct = ref(null);
    const submitting = ref(false);
    const formError = ref("");
    const form = reactive({
      name: "",
      category: "",
      price: "",
      comparePrice: "",
      stock: "0",
      sku: "",
      description: "",
      supplierUrl: "",
      imagesRaw: "",
      active: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "products-page" }, _attrs))} data-v-e8831560><div class="page-header" data-v-e8831560><div data-v-e8831560><h1 class="page-title" data-v-e8831560>Producten</h1><p class="page-sub" data-v-e8831560>${ssrInterpolate(unref(products).length)} producten \u2022 ${ssrInterpolate(unref(activeCount))} actief</p></div><button class="add-btn" data-v-e8831560><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-v-e8831560><line x1="12" y1="5" x2="12" y2="19" data-v-e8831560></line><line x1="5" y1="12" x2="19" y2="12" data-v-e8831560></line></svg> Nieuw product </button></div>`);
      if (unref(products).length === 0) {
        _push(`<div class="empty-state" data-v-e8831560><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-e8831560><rect x="2" y="7" width="20" height="14" rx="2" data-v-e8831560></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" data-v-e8831560></path></svg><p data-v-e8831560>Nog geen producten</p><small data-v-e8831560>Voeg je eerste product toe om te beginnen.</small><button class="add-btn" data-v-e8831560>Product toevoegen</button></div>`);
      } else {
        _push(`<div class="products-grid" data-v-e8831560><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(`<div class="product-card" data-v-e8831560><div class="product-img" data-v-e8831560>`);
          if (product.images[0]) {
            _push(`<img${ssrRenderAttr("src", product.images[0])}${ssrRenderAttr("alt", product.name)} data-v-e8831560>`);
          } else {
            _push(`<div class="img-placeholder" data-v-e8831560><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-e8831560><rect x="3" y="3" width="18" height="18" rx="2" data-v-e8831560></rect><circle cx="8.5" cy="8.5" r="1.5" data-v-e8831560></circle><polyline points="21 15 16 10 5 21" data-v-e8831560></polyline></svg></div>`);
          }
          _push(`<span class="${ssrRenderClass([product.active ? "badge--active" : "badge--inactive", "active-badge"])}" data-v-e8831560>${ssrInterpolate(product.active ? "Actief" : "Inactief")}</span></div><div class="product-info" data-v-e8831560><div class="product-header" data-v-e8831560><h3 data-v-e8831560>${ssrInterpolate(product.name)}</h3><div class="product-price" data-v-e8831560><span class="price-main" data-v-e8831560>\u20AC${ssrInterpolate(product.price.toFixed(2))}</span>`);
          if (product.comparePrice) {
            _push(`<span class="price-compare" data-v-e8831560>\u20AC${ssrInterpolate(product.comparePrice.toFixed(2))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="product-meta" data-v-e8831560>`);
          if (product.category) {
            _push(`<span class="meta-chip" data-v-e8831560>${ssrInterpolate(product.category)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="${ssrRenderClass([product.stock > 0 ? "chip--ok" : "chip--warn", "meta-chip"])}" data-v-e8831560> Voorraad: ${ssrInterpolate(product.stock)}</span>`);
          if (product.sku) {
            _push(`<span class="meta-chip" data-v-e8831560>SKU: ${ssrInterpolate(product.sku)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="product-actions" data-v-e8831560><button class="${ssrRenderClass([product.active ? "toggle--deactivate" : "toggle--activate", "toggle-btn"])}" data-v-e8831560>${ssrInterpolate(product.active ? "Deactiveren" : "Activeren")}</button><button class="edit-btn" data-v-e8831560><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e8831560><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" data-v-e8831560></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" data-v-e8831560></path></svg></button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="modal-overlay" data-v-e8831560><div class="modal" data-v-e8831560><div class="modal-header" data-v-e8831560><h2 data-v-e8831560>${ssrInterpolate(unref(editProduct) ? "Product bewerken" : "Nieuw product")}</h2><button class="close-btn" data-v-e8831560><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e8831560><line x1="18" y1="6" x2="6" y2="18" data-v-e8831560></line><line x1="6" y1="6" x2="18" y2="18" data-v-e8831560></line></svg></button></div><form class="modal-form" data-v-e8831560><div class="form-row" data-v-e8831560><div class="field" data-v-e8831560><label data-v-e8831560>Naam *</label><input${ssrRenderAttr("value", unref(form).name)} type="text" placeholder="Productnaam" required data-v-e8831560></div><div class="field" data-v-e8831560><label data-v-e8831560>Categorie</label><input${ssrRenderAttr("value", unref(form).category)} type="text" placeholder="bijv. GPS-trackers" data-v-e8831560></div></div><div class="form-row" data-v-e8831560><div class="field" data-v-e8831560><label data-v-e8831560>Prijs (\u20AC) *</label><input${ssrRenderAttr("value", unref(form).price)} type="number" step="0.01" min="0" placeholder="0.00" required data-v-e8831560></div><div class="field" data-v-e8831560><label data-v-e8831560>Vergelijkprijs (\u20AC)</label><input${ssrRenderAttr("value", unref(form).comparePrice)} type="number" step="0.01" min="0" placeholder="0.00" data-v-e8831560></div><div class="field" data-v-e8831560><label data-v-e8831560>Voorraad</label><input${ssrRenderAttr("value", unref(form).stock)} type="number" min="0" placeholder="0" data-v-e8831560></div></div><div class="form-row" data-v-e8831560><div class="field" data-v-e8831560><label data-v-e8831560>SKU</label><input${ssrRenderAttr("value", unref(form).sku)} type="text" placeholder="Artikelnummer" data-v-e8831560></div></div><div class="field" data-v-e8831560><label data-v-e8831560>Omschrijving</label><textarea rows="3" placeholder="Productomschrijving\u2026" data-v-e8831560>${ssrInterpolate(unref(form).description)}</textarea></div><div class="field" data-v-e8831560><label data-v-e8831560>Leverancier URL</label><input${ssrRenderAttr("value", unref(form).supplierUrl)} type="url" placeholder="https://..." data-v-e8831560></div><div class="field" data-v-e8831560><label data-v-e8831560>Afbeelding URL&#39;s (\xE9\xE9n per regel)</label><textarea rows="2" placeholder="https://..." data-v-e8831560>${ssrInterpolate(unref(form).imagesRaw)}</textarea></div><div class="field field--checkbox" data-v-e8831560><label data-v-e8831560><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).active) ? ssrLooseContain(unref(form).active, null) : unref(form).active) ? " checked" : ""} type="checkbox" data-v-e8831560> Product activeren (zichtbaar in shop) </label></div>`);
          if (unref(formError)) {
            _push2(`<p class="form-error" data-v-e8831560>${ssrInterpolate(unref(formError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="modal-footer" data-v-e8831560><button type="button" class="cancel-btn" data-v-e8831560>Annuleren</button><button type="submit" class="submit-btn"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} data-v-e8831560>${ssrInterpolate(unref(submitting) ? "Opslaan\u2026" : unref(editProduct) ? "Wijzigingen opslaan" : "Product toevoegen")}</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/products/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e8831560"]]);

export { index as default };
//# sourceMappingURL=index-Bk6bQ_vg.mjs.map
