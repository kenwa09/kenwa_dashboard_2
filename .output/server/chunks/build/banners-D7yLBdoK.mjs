import { defineComponent, withAsyncContext, computed, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useAsyncData } from './asyncData-1o0-ILe1.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "banners",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-banners", () => $fetch("/api/admin/banners"))), __temp = await __temp, __restore(), __temp);
    const banners2 = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.banners) || data.value || [];
    });
    const formSaving = ref(false);
    const formError = ref("");
    const editingBanner = ref(null);
    const togglingId = ref(null);
    const deletingId = ref(null);
    const form = ref({
      title: "",
      position: "",
      imageUrl: "",
      linkUrl: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-e7dc10ef><h1 data-v-e7dc10ef>Bannerbeheer</h1><div class="card create-form" data-v-e7dc10ef><h3 data-v-e7dc10ef>${ssrInterpolate(unref(editingBanner) ? "Banner bewerken" : "Nieuwe banner")}</h3><form data-v-e7dc10ef><div class="form-row" data-v-e7dc10ef><div class="form-group" data-v-e7dc10ef><label data-v-e7dc10ef>Titel</label><input${ssrRenderAttr("value", unref(form).title)} type="text" required data-v-e7dc10ef></div><div class="form-group" data-v-e7dc10ef><label data-v-e7dc10ef>Positie</label><input${ssrRenderAttr("value", unref(form).position)} type="text" placeholder="bijv. homepage-top" required data-v-e7dc10ef></div><div class="form-group" data-v-e7dc10ef><label data-v-e7dc10ef>Afbeelding URL</label><input${ssrRenderAttr("value", unref(form).imageUrl)} type="url" data-v-e7dc10ef></div><div class="form-group" data-v-e7dc10ef><label data-v-e7dc10ef>Link URL</label><input${ssrRenderAttr("value", unref(form).linkUrl)} type="url" data-v-e7dc10ef></div></div>`);
      if (unref(formError)) {
        _push(`<p class="error" data-v-e7dc10ef>${ssrInterpolate(unref(formError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="form-actions" data-v-e7dc10ef><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(formSaving)) ? " disabled" : ""} data-v-e7dc10ef>${ssrInterpolate(unref(formSaving) ? "Opslaan..." : unref(editingBanner) ? "Bijwerken" : "Toevoegen")}</button>`);
      if (unref(editingBanner)) {
        _push(`<button type="button" class="btn btn-secondary" data-v-e7dc10ef> Annuleren </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></div><div class="card" data-v-e7dc10ef><table data-v-e7dc10ef><thead data-v-e7dc10ef><tr data-v-e7dc10ef><th data-v-e7dc10ef>Titel</th><th data-v-e7dc10ef>Positie</th><th data-v-e7dc10ef>Status</th><th data-v-e7dc10ef>Acties</th></tr></thead><tbody data-v-e7dc10ef><!--[-->`);
      ssrRenderList(unref(banners2), (banner) => {
        _push(`<tr data-v-e7dc10ef><td data-v-e7dc10ef>${ssrInterpolate(banner.title)}</td><td data-v-e7dc10ef>${ssrInterpolate(banner.position)}</td><td data-v-e7dc10ef><span class="${ssrRenderClass(banner.active ? "status-active" : "status-inactive")}" data-v-e7dc10ef>${ssrInterpolate(banner.active ? "Actief" : "Inactief")}</span></td><td data-v-e7dc10ef><button class="btn btn-sm btn-primary" data-v-e7dc10ef>Bewerken</button><button class="${ssrRenderClass([banner.active ? "btn-warning" : "btn-success", "btn btn-sm"])}"${ssrIncludeBooleanAttr(unref(togglingId) === banner.id) ? " disabled" : ""} data-v-e7dc10ef>${ssrInterpolate(banner.active ? "Deactiveren" : "Activeren")}</button><button class="btn btn-sm btn-danger"${ssrIncludeBooleanAttr(unref(deletingId) === banner.id) ? " disabled" : ""} data-v-e7dc10ef> Verwijderen </button></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(banners2).length === 0) {
        _push(`<tr data-v-e7dc10ef><td colspan="4" data-v-e7dc10ef>Geen banners gevonden.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/banners.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const banners = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e7dc10ef"]]);

export { banners as default };
//# sourceMappingURL=banners-D7yLBdoK.mjs.map
