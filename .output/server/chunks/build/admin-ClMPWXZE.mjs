import { _ as __nuxt_component_0 } from './nuxt-link-D10Dt-Mp.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, openBlock, createBlock, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-BXQTwBgC.mjs';
import { _ as _export_sfc, u as useRoute } from './server.mjs';
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
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const route = useRoute();
    const loggingOut = ref(false);
    const collapsed = ref(false);
    const mobileOpen = ref(false);
    const userInitial = computed(() => {
      var _a, _b;
      const name = ((_a = authStore.user) == null ? void 0 : _a.name) || ((_b = authStore.user) == null ? void 0 : _b.email) || "A";
      return name.charAt(0).toUpperCase();
    });
    const pageTitles = {
      "/admin": "Dashboard",
      "/admin/users": "Gebruikers",
      "/admin/logs": "Systeemlogboek",
      "/admin/shares": "Shares",
      "/admin/blog": "Blog",
      "/admin/blog/create": "Nieuw bericht",
      "/admin/ai-blog": "AI Blog",
      "/admin/banners": "Banners",
      "/admin/orders": "Bestellingen",
      "/admin/products": "Producten",
      "/admin/invoices": "Facturen",
      "/admin/accounting": "Boekhouding"
    };
    const pageTitle = computed(() => {
      const path = route.path;
      if (pageTitles[path]) return pageTitles[path];
      if (path.startsWith("/admin/blog/")) return "Bericht bewerken";
      if (path.startsWith("/admin/orders/")) return "Bestelling details";
      return "Admin";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["admin-shell", { "sidebar-collapsed": collapsed.value }]
      }, _attrs))} data-v-5207d2cb><aside class="sidebar" data-v-5207d2cb><div class="sidebar-header" data-v-5207d2cb><div class="sidebar-brand" data-v-5207d2cb><svg width="28" height="28" viewBox="0 0 40 40" fill="none" data-v-5207d2cb><circle cx="20" cy="20" r="20" fill="url(#sb-grad)" data-v-5207d2cb></circle><path d="M20 10C15.58 10 12 13.58 12 18C12 24.5 20 32 20 32C20 32 28 24.5 28 18C28 13.58 24.42 10 20 10ZM20 21C18.34 21 17 19.66 17 18C17 16.34 18.34 15 20 15C21.66 15 23 16.34 23 18C23 19.66 21.66 21 20 21Z" fill="white" data-v-5207d2cb></path><defs data-v-5207d2cb><linearGradient id="sb-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse" data-v-5207d2cb><stop stop-color="#6366f1" data-v-5207d2cb></stop><stop offset="1" stop-color="#2563eb" data-v-5207d2cb></stop></linearGradient></defs></svg><span class="brand-text" data-v-5207d2cb><span class="brand-name" data-v-5207d2cb>Kenwa</span><span class="brand-tag" data-v-5207d2cb>Admin</span></span></div><button class="collapse-btn"${ssrRenderAttr("title", collapsed.value ? "Uitklappen" : "Inklappen")} data-v-5207d2cb><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb><polyline${ssrRenderAttr("points", collapsed.value ? "9 18 15 12 9 6" : "15 18 9 12 15 6")} data-v-5207d2cb></polyline></svg></button></div><nav class="sidebar-nav" data-v-5207d2cb><div class="nav-section" data-v-5207d2cb><span class="nav-label" data-v-5207d2cb>Overzicht</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "nav-item",
        exact: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><rect x="3" y="3" width="7" height="7" rx="1" data-v-5207d2cb${_scopeId}></rect><rect x="14" y="3" width="7" height="7" rx="1" data-v-5207d2cb${_scopeId}></rect><rect x="3" y="14" width="7" height="7" rx="1" data-v-5207d2cb${_scopeId}></rect><rect x="14" y="14" width="7" height="7" rx="1" data-v-5207d2cb${_scopeId}></rect></svg><span data-v-5207d2cb${_scopeId}>Dashboard</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("rect", {
                  x: "3",
                  y: "3",
                  width: "7",
                  height: "7",
                  rx: "1"
                }),
                createVNode("rect", {
                  x: "14",
                  y: "3",
                  width: "7",
                  height: "7",
                  rx: "1"
                }),
                createVNode("rect", {
                  x: "3",
                  y: "14",
                  width: "7",
                  height: "7",
                  rx: "1"
                }),
                createVNode("rect", {
                  x: "14",
                  y: "14",
                  width: "7",
                  height: "7",
                  rx: "1"
                })
              ])),
              createVNode("span", null, "Dashboard")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/logs",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-5207d2cb${_scopeId}></path><polyline points="14 2 14 8 20 8" data-v-5207d2cb${_scopeId}></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-5207d2cb${_scopeId}></line><line x1="16" y1="17" x2="8" y2="17" data-v-5207d2cb${_scopeId}></line></svg><span data-v-5207d2cb${_scopeId}>Logs</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
                createVNode("polyline", { points: "14 2 14 8 20 8" }),
                createVNode("line", {
                  x1: "16",
                  y1: "13",
                  x2: "8",
                  y2: "13"
                }),
                createVNode("line", {
                  x1: "16",
                  y1: "17",
                  x2: "8",
                  y2: "17"
                })
              ])),
              createVNode("span", null, "Logs")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="nav-section" data-v-5207d2cb><span class="nav-label" data-v-5207d2cb>Gebruikers</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/users",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" data-v-5207d2cb${_scopeId}></path><circle cx="9" cy="7" r="4" data-v-5207d2cb${_scopeId}></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87" data-v-5207d2cb${_scopeId}></path><path d="M16 3.13a4 4 0 0 1 0 7.75" data-v-5207d2cb${_scopeId}></path></svg><span data-v-5207d2cb${_scopeId}>Gebruikers</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
                createVNode("circle", {
                  cx: "9",
                  cy: "7",
                  r: "4"
                }),
                createVNode("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
                createVNode("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
              ])),
              createVNode("span", null, "Gebruikers")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/shares",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><circle cx="18" cy="5" r="3" data-v-5207d2cb${_scopeId}></circle><circle cx="6" cy="12" r="3" data-v-5207d2cb${_scopeId}></circle><circle cx="18" cy="19" r="3" data-v-5207d2cb${_scopeId}></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" data-v-5207d2cb${_scopeId}></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" data-v-5207d2cb${_scopeId}></line></svg><span data-v-5207d2cb${_scopeId}>Shares</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("circle", {
                  cx: "18",
                  cy: "5",
                  r: "3"
                }),
                createVNode("circle", {
                  cx: "6",
                  cy: "12",
                  r: "3"
                }),
                createVNode("circle", {
                  cx: "18",
                  cy: "19",
                  r: "3"
                }),
                createVNode("line", {
                  x1: "8.59",
                  y1: "13.51",
                  x2: "15.42",
                  y2: "17.49"
                }),
                createVNode("line", {
                  x1: "15.41",
                  y1: "6.51",
                  x2: "8.59",
                  y2: "10.49"
                })
              ])),
              createVNode("span", null, "Shares")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="nav-section" data-v-5207d2cb><span class="nav-label" data-v-5207d2cb>Content</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/blog",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" data-v-5207d2cb${_scopeId}></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" data-v-5207d2cb${_scopeId}></path></svg><span data-v-5207d2cb${_scopeId}>Blog</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                createVNode("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
              ])),
              createVNode("span", null, "Blog")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/ai-blog",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" data-v-5207d2cb${_scopeId}></path><path d="M8.5 8.5a5 5 0 0 1 7.07 0" data-v-5207d2cb${_scopeId}></path><path d="M15.5 15.5a5 5 0 0 1-7.07 0" data-v-5207d2cb${_scopeId}></path><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0" data-v-5207d2cb${_scopeId}></path></svg><span data-v-5207d2cb${_scopeId}>AI Blog</span><span class="nav-badge" data-v-5207d2cb${_scopeId}>AI</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" }),
                createVNode("path", { d: "M8.5 8.5a5 5 0 0 1 7.07 0" }),
                createVNode("path", { d: "M15.5 15.5a5 5 0 0 1-7.07 0" }),
                createVNode("path", { d: "M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0" })
              ])),
              createVNode("span", null, "AI Blog"),
              createVNode("span", { class: "nav-badge" }, "AI")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/banners",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><rect x="3" y="3" width="18" height="18" rx="2" data-v-5207d2cb${_scopeId}></rect><path d="M3 9h18" data-v-5207d2cb${_scopeId}></path></svg><span data-v-5207d2cb${_scopeId}>Banners</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("rect", {
                  x: "3",
                  y: "3",
                  width: "18",
                  height: "18",
                  rx: "2"
                }),
                createVNode("path", { d: "M3 9h18" })
              ])),
              createVNode("span", null, "Banners")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="nav-section" data-v-5207d2cb><span class="nav-label" data-v-5207d2cb>Commerce</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/orders",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" data-v-5207d2cb${_scopeId}></path><line x1="3" y1="6" x2="21" y2="6" data-v-5207d2cb${_scopeId}></line><path d="M16 10a4 4 0 0 1-8 0" data-v-5207d2cb${_scopeId}></path></svg><span data-v-5207d2cb${_scopeId}>Bestellingen</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
                createVNode("line", {
                  x1: "3",
                  y1: "6",
                  x2: "21",
                  y2: "6"
                }),
                createVNode("path", { d: "M16 10a4 4 0 0 1-8 0" })
              ])),
              createVNode("span", null, "Bestellingen")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/products",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" data-v-5207d2cb${_scopeId}></path></svg><span data-v-5207d2cb${_scopeId}>Producten</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" })
              ])),
              createVNode("span", null, "Producten")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/invoices",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-5207d2cb${_scopeId}></path><polyline points="14 2 14 8 20 8" data-v-5207d2cb${_scopeId}></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-5207d2cb${_scopeId}></line><line x1="16" y1="17" x2="8" y2="17" data-v-5207d2cb${_scopeId}></line><polyline points="10 9 9 9 8 9" data-v-5207d2cb${_scopeId}></polyline></svg><span data-v-5207d2cb${_scopeId}>Facturen</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
                createVNode("polyline", { points: "14 2 14 8 20 8" }),
                createVNode("line", {
                  x1: "16",
                  y1: "13",
                  x2: "8",
                  y2: "13"
                }),
                createVNode("line", {
                  x1: "16",
                  y1: "17",
                  x2: "8",
                  y2: "17"
                }),
                createVNode("polyline", { points: "10 9 9 9 8 9" })
              ])),
              createVNode("span", null, "Facturen")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/accounting",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb${_scopeId}><line x1="12" y1="1" x2="12" y2="23" data-v-5207d2cb${_scopeId}></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" data-v-5207d2cb${_scopeId}></path></svg><span data-v-5207d2cb${_scopeId}>Boekhouding</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("line", {
                  x1: "12",
                  y1: "1",
                  x2: "12",
                  y2: "23"
                }),
                createVNode("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
              ])),
              createVNode("span", null, "Boekhouding")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></nav><div class="sidebar-user" data-v-5207d2cb><div class="user-avatar" data-v-5207d2cb>${ssrInterpolate(userInitial.value)}</div><div class="user-info" data-v-5207d2cb><span class="user-name" data-v-5207d2cb>${ssrInterpolate(((_a = unref(authStore).user) == null ? void 0 : _a.name) || "Admin")}</span><span class="user-role" data-v-5207d2cb>Beheerder</span></div><button class="logout-btn" title="Uitloggen"${ssrIncludeBooleanAttr(loggingOut.value) ? " disabled" : ""} data-v-5207d2cb><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" data-v-5207d2cb></path><polyline points="16 17 21 12 16 7" data-v-5207d2cb></polyline><line x1="21" y1="12" x2="9" y2="12" data-v-5207d2cb></line></svg></button></div></aside><div class="main-area" data-v-5207d2cb><header class="topbar" data-v-5207d2cb><button class="mobile-menu-btn" data-v-5207d2cb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5207d2cb><line x1="3" y1="12" x2="21" y2="12" data-v-5207d2cb></line><line x1="3" y1="6" x2="21" y2="6" data-v-5207d2cb></line><line x1="3" y1="18" x2="21" y2="18" data-v-5207d2cb></line></svg></button><div class="topbar-breadcrumb" data-v-5207d2cb><span class="topbar-title" data-v-5207d2cb>${ssrInterpolate(pageTitle.value)}</span></div><div class="topbar-actions" data-v-5207d2cb><span class="topbar-user" data-v-5207d2cb>${ssrInterpolate((_b = unref(authStore).user) == null ? void 0 : _b.email)}</span></div></header><main class="page-content" data-v-5207d2cb>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
      if (mobileOpen.value) {
        _push(`<div class="mobile-overlay" data-v-5207d2cb></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5207d2cb"]]);

export { admin as default };
//# sourceMappingURL=admin-ClMPWXZE.mjs.map
