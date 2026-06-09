import { _ as __nuxt_component_0 } from "./nuxt-link-D10Dt-Mp.js";
import { defineComponent, ref, withAsyncContext, computed, watchEffect, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent } from "vue/server-renderer";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/hookable/dist/index.mjs";
import { u as useRoute, a as useRouter, _ as _export_sfc } from "../server.mjs";
import { u as useAsyncData } from "./asyncData-1o0-ILe1.js";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ufo/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/defu/dist/defu.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/unctx/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/klona/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const postId = route.params.id;
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
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(`admin-blog-${postId}`, () => $fetch("/api/admin/blog"))), __temp = await __temp, __restore(), __temp);
    const allPosts = computed(() => data.value?.posts || data.value || []);
    const post = computed(() => allPosts.value.find((p) => p.id === postId));
    watchEffect(() => {
      if (post.value) {
        form.value = {
          title: post.value.title || "",
          excerpt: post.value.excerpt || "",
          content: post.value.content || "",
          coverImage: post.value.coverImage || "",
          status: post.value.status || "draft"
        };
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-c0a5e7f9><h1 data-v-c0a5e7f9>Artikel bewerken</h1><div class="card" data-v-c0a5e7f9><form data-v-c0a5e7f9><div class="form-group" data-v-c0a5e7f9><label data-v-c0a5e7f9>Titel (NL)</label><input${ssrRenderAttr("value", unref(form).title)} type="text" required data-v-c0a5e7f9></div><div class="form-group" data-v-c0a5e7f9><label data-v-c0a5e7f9>Samenvatting (NL)</label><input${ssrRenderAttr("value", unref(form).excerpt)} type="text" data-v-c0a5e7f9></div><div class="form-group" data-v-c0a5e7f9><label data-v-c0a5e7f9>Inhoud (NL)</label><textarea rows="12" required data-v-c0a5e7f9>${ssrInterpolate(unref(form).content)}</textarea></div><p class="translate-note" data-v-c0a5e7f9><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="${ssrRenderStyle({ "vertical-align": "middle", "margin-right": "4px" })}" data-v-c0a5e7f9><path d="M5 8l6 6" data-v-c0a5e7f9></path><path d="M4 14l6-6 2-3" data-v-c0a5e7f9></path><path d="M2 5h12" data-v-c0a5e7f9></path><path d="M7 2h1" data-v-c0a5e7f9></path><path d="M22 22l-5-10-5 10" data-v-c0a5e7f9></path><path d="M14 18h6" data-v-c0a5e7f9></path></svg> De Engelse vertaling wordt automatisch bijgewerkt na het opslaan. </p><div class="form-group" data-v-c0a5e7f9><label data-v-c0a5e7f9>Cover afbeelding</label><div class="image-field" data-v-c0a5e7f9><input${ssrRenderAttr("value", unref(form).coverImage)} type="url" placeholder="https://... of genereer via AI" data-v-c0a5e7f9><button type="button" class="btn btn-ai"${ssrIncludeBooleanAttr(unref(generatingImage) || !unref(form).title.trim()) ? " disabled" : ""}${ssrRenderAttr("title", unref(form).title.trim() ? "Genereer AI afbeelding op basis van de titel" : "Vul eerst een titel in")} data-v-c0a5e7f9><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" data-v-c0a5e7f9><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" data-v-c0a5e7f9></polygon></svg> ${ssrInterpolate(unref(generatingImage) ? "Genereren..." : "AI afbeelding")}</button></div>`);
      if (unref(imageError)) {
        _push(`<p class="field-error" data-v-c0a5e7f9>${ssrInterpolate(unref(imageError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).coverImage) {
        _push(`<div class="image-preview" data-v-c0a5e7f9><img${ssrRenderAttr("src", unref(form).coverImage)} alt="Preview" data-v-c0a5e7f9>`);
        if (unref(imageLoadError)) {
          _push(`<span class="preview-error" data-v-c0a5e7f9>Afbeelding kan niet worden geladen</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-c0a5e7f9><label data-v-c0a5e7f9>Status</label><select data-v-c0a5e7f9><option value="draft" data-v-c0a5e7f9${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "draft") : ssrLooseEqual(unref(form).status, "draft")) ? " selected" : ""}>Concept</option><option value="published" data-v-c0a5e7f9${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}>Gepubliceerd</option></select></div>`);
      if (unref(error)) {
        _push(`<p class="error" data-v-c0a5e7f9>${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="form-actions" data-v-c0a5e7f9><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-c0a5e7f9>${ssrInterpolate(unref(saving) ? "Opslaan..." : "Opslaan")}</button>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/blog/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c0a5e7f9"]]);
export {
  _id_ as default
};
//# sourceMappingURL=_id_-eihxBpFC.js.map
