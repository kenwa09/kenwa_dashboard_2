import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/hookable/dist/index.mjs";
import { _ as _export_sfc } from "../server.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/unctx/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/defu/dist/defu.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ufo/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "logs",
  __ssrInlineRender: true,
  setup(__props) {
    const logs2 = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const expandedLogs = ref(/* @__PURE__ */ new Set());
    const searchQuery = ref("");
    const filters = reactive({ errorsOnly: false, category: "", days: 7 });
    const filteredLogs = computed(() => {
      if (!searchQuery.value.trim()) return logs2.value;
      const q = searchQuery.value.toLowerCase();
      return logs2.value.filter(
        (l) => l.message?.toLowerCase().includes(q) || l.category?.toLowerCase().includes(q)
      );
    });
    function formatTime(timestamp) {
      return new Date(timestamp).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "logs-page" }, _attrs))} data-v-bcff8b88><div class="page-header" data-v-bcff8b88><div data-v-bcff8b88><h1 class="page-title" data-v-bcff8b88>Systeem Logs</h1><p class="page-sub" data-v-bcff8b88>E-mail en systeem logs voor debugging</p></div><button class="btn btn-ghost" data-v-bcff8b88><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-bcff8b88><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" data-v-bcff8b88></path><path d="M21 3v5h-5" data-v-bcff8b88></path></svg> Vernieuwen </button></div><div class="toolbar" data-v-bcff8b88><div class="search-bar" data-v-bcff8b88><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" data-v-bcff8b88><circle cx="11" cy="11" r="8" data-v-bcff8b88></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-v-bcff8b88></line></svg><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Zoek in logs..." data-v-bcff8b88></div><div class="filter-row" data-v-bcff8b88><div class="filter-chips" data-v-bcff8b88><button class="${ssrRenderClass([{ active: !unref(filters).errorsOnly }, "chip"])}" data-v-bcff8b88>Alle</button><button class="${ssrRenderClass([{ active: unref(filters).errorsOnly }, "chip"])}" data-v-bcff8b88>Alleen errors</button></div><select class="filter-select" data-v-bcff8b88><option value="" data-v-bcff8b88${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "") : ssrLooseEqual(unref(filters).category, "")) ? " selected" : ""}>Alle categorieën</option><option value="mail" data-v-bcff8b88${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "mail") : ssrLooseEqual(unref(filters).category, "mail")) ? " selected" : ""}>E-mail</option><option value="auth" data-v-bcff8b88${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "auth") : ssrLooseEqual(unref(filters).category, "auth")) ? " selected" : ""}>Authenticatie</option><option value="db" data-v-bcff8b88${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "db") : ssrLooseEqual(unref(filters).category, "db")) ? " selected" : ""}>Database</option></select><select class="filter-select" data-v-bcff8b88><option${ssrRenderAttr("value", 1)} data-v-bcff8b88${ssrIncludeBooleanAttr(Array.isArray(unref(filters).days) ? ssrLooseContain(unref(filters).days, 1) : ssrLooseEqual(unref(filters).days, 1)) ? " selected" : ""}>Vandaag</option><option${ssrRenderAttr("value", 3)} data-v-bcff8b88${ssrIncludeBooleanAttr(Array.isArray(unref(filters).days) ? ssrLooseContain(unref(filters).days, 3) : ssrLooseEqual(unref(filters).days, 3)) ? " selected" : ""}>3 dagen</option><option${ssrRenderAttr("value", 7)} data-v-bcff8b88${ssrIncludeBooleanAttr(Array.isArray(unref(filters).days) ? ssrLooseContain(unref(filters).days, 7) : ssrLooseEqual(unref(filters).days, 7)) ? " selected" : ""}>7 dagen</option><option${ssrRenderAttr("value", 14)} data-v-bcff8b88${ssrIncludeBooleanAttr(Array.isArray(unref(filters).days) ? ssrLooseContain(unref(filters).days, 14) : ssrLooseEqual(unref(filters).days, 14)) ? " selected" : ""}>14 dagen</option></select></div></div>`);
      if (unref(loading)) {
        _push(`<div class="status-msg" data-v-bcff8b88>Logs laden...</div>`);
      } else if (unref(error)) {
        _push(`<div class="error-box" data-v-bcff8b88>${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(filteredLogs).length === 0) {
        _push(`<div class="status-msg" data-v-bcff8b88>Geen logs gevonden</div>`);
      } else {
        _push(`<div class="logs-list" data-v-bcff8b88><!--[-->`);
        ssrRenderList(unref(filteredLogs), (log, index) => {
          _push(`<div class="${ssrRenderClass([log.level, "log-entry"])}" data-v-bcff8b88><div class="log-header" data-v-bcff8b88><span class="${ssrRenderClass([log.level, "log-level"])}" data-v-bcff8b88>${ssrInterpolate(log.level.toUpperCase())}</span><span class="log-category" data-v-bcff8b88>${ssrInterpolate(log.category)}</span><span class="log-time" data-v-bcff8b88>${ssrInterpolate(formatTime(log.timestamp))}</span></div><div class="log-message" data-v-bcff8b88>${ssrInterpolate(log.message)}</div>`);
          if (log.details) {
            _push(`<div class="log-details" data-v-bcff8b88><button class="toggle-btn" data-v-bcff8b88>${ssrInterpolate(unref(expandedLogs).has(index) ? "Details verbergen" : "Details tonen")}</button>`);
            if (unref(expandedLogs).has(index)) {
              _push(`<pre data-v-bcff8b88>${ssrInterpolate(JSON.stringify(log.details, null, 2))}</pre>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (log.error) {
            _push(`<div class="log-error" data-v-bcff8b88><strong data-v-bcff8b88>${ssrInterpolate(log.error.name)}:</strong> ${ssrInterpolate(log.error.message)} `);
            if (log.error.stack && unref(expandedLogs).has(index)) {
              _push(`<pre data-v-bcff8b88>${ssrInterpolate(log.error.stack)}</pre>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/logs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const logs = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bcff8b88"]]);
export {
  logs as default
};
//# sourceMappingURL=logs-RoMTwXSJ.js.map
