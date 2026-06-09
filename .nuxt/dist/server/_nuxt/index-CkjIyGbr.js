import { _ as __nuxt_component_0 } from "./nuxt-link-D10Dt-Mp.js";
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
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
    const { data: overview } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-overview", () => $fetch("/api/admin/overview"))), __temp = await __temp, __restore(), __temp);
    const { data: activityData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-activity", () => $fetch("/api/admin/activity"))), __temp = await __temp, __restore(), __temp);
    const { data: auditData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-audit", () => $fetch("/api/admin/audit?limit=10"))), __temp = await __temp, __restore(), __temp);
    const { data: alertsData, refresh: refreshAlerts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-alerts", () => $fetch("/api/admin/alerts?unread=true"))), __temp = await __temp, __restore(), __temp);
    const stats = computed(() => overview.value?.stats);
    const trends = computed(() => overview.value?.trends);
    const activity = computed(() => activityData.value?.activity || []);
    const auditLogs = computed(() => auditData.value?.logs || []);
    const alerts = computed(() => alertsData.value?.alerts || []);
    const statItems = computed(() => [
      {
        label: "Gebruikers",
        value: stats.value?.users ?? 0,
        color: "#6366f1",
        bg: "rgba(99,102,241,0.1)",
        trend: trends.value?.usersThisWeek || 0,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>'
      },
      {
        label: "Locaties",
        value: stats.value?.locations ?? 0,
        color: "#06b6d4",
        bg: "rgba(6,182,212,0.1)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
      },
      {
        label: "Deelverzoeken",
        value: stats.value?.shares ?? 0,
        color: "#8b5cf6",
        bg: "rgba(139,92,246,0.1)",
        trend: trends.value?.sharesThisWeek || 0,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/></svg>'
      },
      {
        label: "Paginaweergaven",
        value: stats.value?.pageViews ?? 0,
        color: "#10b981",
        bg: "rgba(16,185,129,0.1)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
      },
      {
        label: "Deelgebruik",
        value: stats.value?.shareUses ?? 0,
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.1)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg>'
      }
    ]);
    function timeAgo(dateStr) {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 6e4);
      if (mins < 1) return "Zojuist";
      if (mins < 60) return `${mins}m geleden`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}u geleden`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}d geleden`;
      return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-overview" }, _attrs))} data-v-25056f6a><div class="page-header" data-v-25056f6a><h1 class="page-title" data-v-25056f6a>Dashboard</h1><p class="page-sub" data-v-25056f6a>Overzicht van kenwa.nl</p></div><div class="stats-grid" data-v-25056f6a><!--[-->`);
      ssrRenderList(unref(statItems), (stat) => {
        _push(`<div class="stat-card" data-v-25056f6a><div class="stat-top" data-v-25056f6a><span class="stat-label" data-v-25056f6a>${ssrInterpolate(stat.label)}</span><div class="stat-icon" style="${ssrRenderStyle({ color: stat.color, background: stat.bg })}" data-v-25056f6a>${stat.icon ?? ""}</div></div><div class="stat-bottom" data-v-25056f6a><span class="stat-value" data-v-25056f6a>${ssrInterpolate(stat.value)}</span>`);
        if (stat.trend) {
          _push(`<span class="${ssrRenderClass([stat.trend > 0 ? "trend-up" : "trend-neutral", "stat-trend"])}" data-v-25056f6a>${ssrInterpolate(stat.trend > 0 ? "+" : "")}${ssrInterpolate(stat.trend)} deze week </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div><div class="two-col" data-v-25056f6a><div class="feed-card" data-v-25056f6a><div class="card-header" data-v-25056f6a><h2 class="card-title" data-v-25056f6a>Recente activiteit</h2></div>`);
      if (unref(activity).length === 0) {
        _push(`<div class="feed-empty" data-v-25056f6a>Nog geen activiteit</div>`);
      } else {
        _push(`<div class="feed-list" data-v-25056f6a><!--[-->`);
        ssrRenderList(unref(activity).slice(0, 12), (item, i) => {
          _push(`<div class="feed-item" data-v-25056f6a><div class="${ssrRenderClass(["dot-" + item.type, "feed-dot"])}" data-v-25056f6a></div><div class="feed-body" data-v-25056f6a><span class="feed-text" data-v-25056f6a>${ssrInterpolate(item.label)}</span><span class="feed-time" data-v-25056f6a>${ssrInterpolate(timeAgo(item.createdAt))}</span></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="side-col" data-v-25056f6a>`);
      if (unref(alerts).length > 0) {
        _push(`<div class="alerts-card" data-v-25056f6a><div class="card-header" data-v-25056f6a><h2 class="card-title" data-v-25056f6a>Meldingen</h2><button class="link-btn" data-v-25056f6a>Alles gelezen</button></div><!--[-->`);
        ssrRenderList(unref(alerts).slice(0, 5), (alert) => {
          _push(`<div class="${ssrRenderClass(["alert-" + alert.severity, "alert-item"])}" data-v-25056f6a><div class="alert-dot" data-v-25056f6a></div><div class="alert-body" data-v-25056f6a><span class="alert-title" data-v-25056f6a>${ssrInterpolate(alert.title)}</span>`);
          if (alert.message) {
            _push(`<span class="alert-msg" data-v-25056f6a>${ssrInterpolate(alert.message)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="quick-card" data-v-25056f6a><h2 class="card-title" data-v-25056f6a>Snelle acties</h2><div class="quick-list" data-v-25056f6a>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/users",
        class: "quick-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-25056f6a${_scopeId}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" data-v-25056f6a${_scopeId}></path><circle cx="8.5" cy="7" r="4" data-v-25056f6a${_scopeId}></circle><line x1="20" y1="8" x2="20" y2="14" data-v-25056f6a${_scopeId}></line><line x1="23" y1="11" x2="17" y2="11" data-v-25056f6a${_scopeId}></line></svg> Gebruiker toevoegen `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
                createVNode("circle", {
                  cx: "8.5",
                  cy: "7",
                  r: "4"
                }),
                createVNode("line", {
                  x1: "20",
                  y1: "8",
                  x2: "20",
                  y2: "14"
                }),
                createVNode("line", {
                  x1: "23",
                  y1: "11",
                  x2: "17",
                  y2: "11"
                })
              ])),
              createTextVNode(" Gebruiker toevoegen ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/blog/create",
        class: "quick-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-25056f6a${_scopeId}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" data-v-25056f6a${_scopeId}></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" data-v-25056f6a${_scopeId}></path></svg> Blog schrijven `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                createVNode("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
              ])),
              createTextVNode(" Blog schrijven ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/logs",
        class: "quick-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-25056f6a${_scopeId}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-25056f6a${_scopeId}></path><polyline points="14 2 14 8 20 8" data-v-25056f6a${_scopeId}></polyline></svg> Logs bekijken `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
                createVNode("polyline", { points: "14 2 14 8 20 8" })
              ])),
              createTextVNode(" Logs bekijken ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="/api/admin/users/export" class="quick-item" target="_blank" data-v-25056f6a><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-25056f6a><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-25056f6a></path><polyline points="7 10 12 15 17 10" data-v-25056f6a></polyline><line x1="12" y1="15" x2="12" y2="3" data-v-25056f6a></line></svg> Gebruikers exporteren </a></div></div>`);
      if (unref(auditLogs).length > 0) {
        _push(`<div class="audit-card" data-v-25056f6a><div class="card-header" data-v-25056f6a><h2 class="card-title" data-v-25056f6a>Audit log</h2></div><!--[-->`);
        ssrRenderList(unref(auditLogs).slice(0, 5), (log) => {
          _push(`<div class="audit-item" data-v-25056f6a><span class="audit-text" data-v-25056f6a>${ssrInterpolate(log.adminName)}: ${ssrInterpolate(log.action)} `);
          if (log.targetName) {
            _push(`<strong data-v-25056f6a>${ssrInterpolate(log.targetName)}</strong>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span><span class="audit-time" data-v-25056f6a>${ssrInterpolate(timeAgo(log.createdAt))}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-25056f6a"]]);
export {
  index as default
};
//# sourceMappingURL=index-CkjIyGbr.js.map
