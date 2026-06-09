import { _ as __nuxt_component_0 } from './nuxt-link-D10Dt-Mp.mjs';
import { defineComponent, ref, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRouter } from './server.mjs';
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
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const saving = ref(false);
    const error = ref("");
    const generatingImage = ref(false);
    const imageError = ref("");
    const imageLoadError = ref(false);
    const form = ref({
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      status: "draft"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-8a09b9ec><h1 data-v-8a09b9ec>Nieuw artikel</h1><div class="card" data-v-8a09b9ec><form data-v-8a09b9ec><div class="form-group" data-v-8a09b9ec><label data-v-8a09b9ec>Titel (NL)</label><input${ssrRenderAttr("value", unref(form).title)} type="text" required data-v-8a09b9ec></div><div class="form-group" data-v-8a09b9ec><label data-v-8a09b9ec>Samenvatting (NL)</label><input${ssrRenderAttr("value", unref(form).excerpt)} type="text" data-v-8a09b9ec></div><div class="form-group" data-v-8a09b9ec><label data-v-8a09b9ec>Inhoud (NL)</label><textarea rows="12" required data-v-8a09b9ec>${ssrInterpolate(unref(form).content)}</textarea></div><p class="translate-note" data-v-8a09b9ec><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="${ssrRenderStyle({ "vertical-align": "middle", "margin-right": "4px" })}" data-v-8a09b9ec><path d="M5 8l6 6" data-v-8a09b9ec></path><path d="M4 14l6-6 2-3" data-v-8a09b9ec></path><path d="M2 5h12" data-v-8a09b9ec></path><path d="M7 2h1" data-v-8a09b9ec></path><path d="M22 22l-5-10-5 10" data-v-8a09b9ec></path><path d="M14 18h6" data-v-8a09b9ec></path></svg> De Engelse vertaling wordt automatisch gegenereerd na het opslaan. </p><div class="form-group" data-v-8a09b9ec><label data-v-8a09b9ec>Cover afbeelding</label><div class="image-field" data-v-8a09b9ec><input${ssrRenderAttr("value", unref(form).coverImage)} type="url" placeholder="https://... of genereer via AI" data-v-8a09b9ec><button type="button" class="btn btn-ai"${ssrIncludeBooleanAttr(unref(generatingImage) || !unref(form).title.trim()) ? " disabled" : ""}${ssrRenderAttr("title", unref(form).title.trim() ? "Genereer AI afbeelding op basis van de titel" : "Vul eerst een titel in")} data-v-8a09b9ec><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" data-v-8a09b9ec><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" data-v-8a09b9ec></polygon></svg> ${ssrInterpolate(unref(generatingImage) ? "Genereren..." : "AI afbeelding")}</button></div>`);
      if (unref(imageError)) {
        _push(`<p class="field-error" data-v-8a09b9ec>${ssrInterpolate(unref(imageError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).coverImage) {
        _push(`<div class="image-preview" data-v-8a09b9ec><img${ssrRenderAttr("src", unref(form).coverImage)} alt="Preview" data-v-8a09b9ec>`);
        if (unref(imageLoadError)) {
          _push(`<span class="preview-error" data-v-8a09b9ec>Afbeelding kan niet worden geladen</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-8a09b9ec><label data-v-8a09b9ec>Status</label><select data-v-8a09b9ec><option value="draft" data-v-8a09b9ec${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "draft") : ssrLooseEqual(unref(form).status, "draft")) ? " selected" : ""}>Concept</option><option value="published" data-v-8a09b9ec${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}>Gepubliceerd</option></select></div>`);
      if (unref(error)) {
        _push(`<p class="error" data-v-8a09b9ec>${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="form-actions" data-v-8a09b9ec><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-8a09b9ec>${ssrInterpolate(unref(saving) ? "Opslaan..." : "Opslaan")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/blog",
        class: "btn btn-secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Annuleren`);
          } else {
            return [
              createTextVNode("Annuleren")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/blog/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8a09b9ec"]]);

export { create as default };
//# sourceMappingURL=create-QSboEEuc.mjs.map
