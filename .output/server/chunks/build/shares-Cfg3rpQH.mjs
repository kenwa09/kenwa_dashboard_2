import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "shares",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-shares", () => $fetch("/api/admin/shares"))), __temp = await __temp, __restore(), __temp);
    const shares2 = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.shares) || [];
    });
    const locations = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.locations) || [];
    });
    const users = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.users) || [];
    });
    const search = ref("");
    const statusFilter = ref("all");
    const filteredShares = computed(() => {
      let result = shares2.value;
      if (statusFilter.value !== "all") {
        result = result.filter((s) => s.status === statusFilter.value);
      }
      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        result = result.filter((s) => {
          var _a, _b, _c, _d, _e;
          const owner = findUser(s.ownerId);
          const target = findUser(s.targetUserId);
          const loc = findLocation(s.locationId);
          return ((_a = owner == null ? void 0 : owner.name) == null ? void 0 : _a.toLowerCase().includes(q)) || ((_b = target == null ? void 0 : target.name) == null ? void 0 : _b.toLowerCase().includes(q)) || ((_c = loc == null ? void 0 : loc.label) == null ? void 0 : _c.toLowerCase().includes(q)) || ((_e = (_d = s.targetContactName) == null ? void 0 : _d.toLowerCase()) == null ? void 0 : _e.includes(q));
        });
      }
      return result;
    });
    function findUser(id) {
      return users.value.find((u) => u.id === id);
    }
    function findLocation(id) {
      return locations.value.find((l) => l.id === id);
    }
    function formatDate(date) {
      return new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "shares-page" }, _attrs))} data-v-e39ed8b7><div class="page-header" data-v-e39ed8b7><div data-v-e39ed8b7><h1 class="page-title" data-v-e39ed8b7>Deelverzoeken</h1><p class="page-sub" data-v-e39ed8b7>${ssrInterpolate(unref(shares2).length)} totale verzoeken</p></div></div><div class="toolbar" data-v-e39ed8b7><div class="search-bar" data-v-e39ed8b7><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" data-v-e39ed8b7><circle cx="11" cy="11" r="8" data-v-e39ed8b7></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-v-e39ed8b7></line></svg><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Zoek op naam of locatie..." data-v-e39ed8b7></div><div class="filter-chips" data-v-e39ed8b7><!--[-->`);
      ssrRenderList(["all", "pending", "accepted", "declined"], (s) => {
        _push(`<button class="${ssrRenderClass([{ active: unref(statusFilter) === s }, "chip"])}" data-v-e39ed8b7>${ssrInterpolate(s === "all" ? "Alle" : s === "pending" ? "In afwachting" : s === "accepted" ? "Geaccepteerd" : "Afgewezen")}</button>`);
      });
      _push(`<!--]--></div></div><div class="table-card" data-v-e39ed8b7><div class="table-wrapper" data-v-e39ed8b7><table data-v-e39ed8b7><thead data-v-e39ed8b7><tr data-v-e39ed8b7><th data-v-e39ed8b7>Eigenaar</th><th data-v-e39ed8b7>Ontvanger</th><th data-v-e39ed8b7>Locatie</th><th data-v-e39ed8b7>Status</th><th data-v-e39ed8b7>Aangemaakt</th></tr></thead><tbody data-v-e39ed8b7><!--[-->`);
      ssrRenderList(unref(filteredShares), (share) => {
        var _a, _b, _c;
        _push(`<tr data-v-e39ed8b7><td data-v-e39ed8b7><span class="name-cell" data-v-e39ed8b7>${ssrInterpolate(((_a = findUser(share.ownerId)) == null ? void 0 : _a.name) || "Onbekend")}</span></td><td data-v-e39ed8b7>${ssrInterpolate(((_b = findUser(share.targetUserId)) == null ? void 0 : _b.name) || share.targetContactName || "Onbekend")}</td><td class="td-muted" data-v-e39ed8b7>${ssrInterpolate(((_c = findLocation(share.locationId)) == null ? void 0 : _c.label) || "\u2014")}</td><td data-v-e39ed8b7><span class="${ssrRenderClass(["status-" + share.status, "status-badge"])}" data-v-e39ed8b7>${ssrInterpolate(share.status === "pending" ? "In afwachting" : share.status === "accepted" ? "Geaccepteerd" : "Afgewezen")}</span></td><td class="td-date" data-v-e39ed8b7>${ssrInterpolate(formatDate(share.createdAt))}</td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredShares).length === 0) {
        _push(`<tr data-v-e39ed8b7><td colspan="5" class="empty-row" data-v-e39ed8b7>Geen deelverzoeken gevonden</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="table-footer" data-v-e39ed8b7>${ssrInterpolate(unref(filteredShares).length)} van ${ssrInterpolate(unref(shares2).length)} verzoeken</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/shares.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const shares = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e39ed8b7"]]);

export { shares as default };
//# sourceMappingURL=shares-Cfg3rpQH.mjs.map
