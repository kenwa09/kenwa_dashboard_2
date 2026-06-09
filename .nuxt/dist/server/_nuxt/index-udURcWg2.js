import { _ as __nuxt_component_0 } from "./nuxt-link-D10Dt-Mp.js";
import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/hookable/dist/index.mjs";
import { u as useAsyncData } from "./asyncData-1o0-ILe1.js";
import { _ as _export_sfc } from "../server.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ufo/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/defu/dist/defu.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/perfect-debounce/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/unctx/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-blog", () => $fetch("/api/admin/blog"))), __temp = await __temp, __restore(), __temp);
    const posts = computed(() => data.value?.posts || data.value || []);
    const deletingId = ref(null);
    const translating = ref(false);
    const search = ref("");
    const statusFilter = ref("all");
    const filteredPosts = computed(() => {
      let result = posts.value;
      if (statusFilter.value !== "all") {
        result = result.filter((p) => p.status === statusFilter.value);
      }
      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        result = result.filter((p) => p.title?.toLowerCase().includes(q));
      }
      return result;
    });
    function formatDate(date) {
      return new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-page" }, _attrs))} data-v-e5621428><div class="page-header" data-v-e5621428><div data-v-e5621428><h1 class="page-title" data-v-e5621428>Blogbeheer</h1><p class="page-sub" data-v-e5621428>${ssrInterpolate(unref(posts).length)} artikelen</p></div><div class="header-btns" data-v-e5621428><button class="btn btn-translate"${ssrIncludeBooleanAttr(unref(translating)) ? " disabled" : ""} data-v-e5621428><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" data-v-e5621428><path d="M5 8l6 6" data-v-e5621428></path><path d="M4 14l6-6 2-3" data-v-e5621428></path><path d="M2 5h12" data-v-e5621428></path><path d="M7 2h1" data-v-e5621428></path><path d="M22 22l-5-10-5 10" data-v-e5621428></path><path d="M14 18h6" data-v-e5621428></path></svg> ${ssrInterpolate(unref(translating) ? "Vertalen..." : "Vertaal alle blogs")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/blog/create",
        class: "btn btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" data-v-e5621428${_scopeId}><line x1="12" y1="5" x2="12" y2="19" data-v-e5621428${_scopeId}></line><line x1="5" y1="12" x2="19" y2="12" data-v-e5621428${_scopeId}></line></svg> Nieuw artikel `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                width: "16",
                height: "16"
              }, [
                createVNode("line", {
                  x1: "12",
                  y1: "5",
                  x2: "12",
                  y2: "19"
                }),
                createVNode("line", {
                  x1: "5",
                  y1: "12",
                  x2: "19",
                  y2: "12"
                })
              ])),
              createTextVNode(" Nieuw artikel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="toolbar" data-v-e5621428><div class="search-bar" data-v-e5621428><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" data-v-e5621428><circle cx="11" cy="11" r="8" data-v-e5621428></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-v-e5621428></line></svg><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Zoek op titel..." data-v-e5621428></div><div class="filter-chips" data-v-e5621428><!--[-->`);
      ssrRenderList(["all", "published", "draft"], (s) => {
        _push(`<button class="${ssrRenderClass([{ active: unref(statusFilter) === s }, "chip"])}" data-v-e5621428>${ssrInterpolate(s === "all" ? "Alle" : s === "published" ? "Gepubliceerd" : "Concept")}</button>`);
      });
      _push(`<!--]--></div></div><div class="table-card" data-v-e5621428><div class="table-wrapper" data-v-e5621428><table data-v-e5621428><thead data-v-e5621428><tr data-v-e5621428><th data-v-e5621428>Titel</th><th data-v-e5621428>Status</th><th data-v-e5621428>Datum</th><th class="th-actions" data-v-e5621428>Acties</th></tr></thead><tbody data-v-e5621428><!--[-->`);
      ssrRenderList(unref(filteredPosts), (post) => {
        _push(`<tr data-v-e5621428><td data-v-e5621428>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/admin/blog/${post.id}`,
          class: "post-title"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(post.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(post.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td data-v-e5621428><span class="${ssrRenderClass([post.status === "published" ? "status-published" : "status-draft", "status-badge"])}" data-v-e5621428>${ssrInterpolate(post.status === "published" ? "Gepubliceerd" : "Concept")}</span></td><td class="td-date" data-v-e5621428>${ssrInterpolate(formatDate(post.createdAt))}</td><td data-v-e5621428><div class="action-btns" data-v-e5621428>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/admin/blog/${post.id}`,
          class: "action-btn action-edit",
          title: "Bewerken"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" data-v-e5621428${_scopeId}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" data-v-e5621428${_scopeId}></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" data-v-e5621428${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  width: "14",
                  height: "14"
                }, [
                  createVNode("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                  createVNode("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                ]))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<button class="action-btn action-delete"${ssrIncludeBooleanAttr(unref(deletingId) === post.id) ? " disabled" : ""} title="Verwijderen" data-v-e5621428><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" data-v-e5621428><polyline points="3 6 5 6 21 6" data-v-e5621428></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-e5621428></path></svg></button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredPosts).length === 0) {
        _push(`<tr data-v-e5621428><td colspan="4" class="empty-row" data-v-e5621428>Geen artikelen gevonden</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="table-footer" data-v-e5621428>${ssrInterpolate(unref(filteredPosts).length)} van ${ssrInterpolate(unref(posts).length)} artikelen</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/blog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e5621428"]]);
export {
  index as default
};
//# sourceMappingURL=index-udURcWg2.js.map
