import { defineComponent, reactive, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderDynamicModel, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useRoute();
    const form = reactive({ email: "", password: "" });
    const loginCode = ref("");
    const showPassword = ref(false);
    const awaitingTwoFactor = computed(() => authStore.awaitingTwoFactor);
    const challenge = computed(() => authStore.pendingLoginChallenge);
    watch(awaitingTwoFactor, (val) => {
      if (val) loginCode.value = "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-db713ac8><div class="bg-pattern" aria-hidden="true" data-v-db713ac8><div class="grid-lines" data-v-db713ac8></div><div class="glow glow-1" data-v-db713ac8></div><div class="glow glow-2" data-v-db713ac8></div></div><div class="login-wrapper" data-v-db713ac8><div class="brand" data-v-db713ac8><div class="brand-logo" data-v-db713ac8><svg width="36" height="36" viewBox="0 0 40 40" fill="none" data-v-db713ac8><circle cx="20" cy="20" r="20" fill="url(#logo-grad)" data-v-db713ac8></circle><path d="M20 10C15.58 10 12 13.58 12 18C12 24.5 20 32 20 32C20 32 28 24.5 28 18C28 13.58 24.42 10 20 10ZM20 21C18.34 21 17 19.66 17 18C17 16.34 18.34 15 20 15C21.66 15 23 16.34 23 18C23 19.66 21.66 21 20 21Z" fill="white" data-v-db713ac8></path><defs data-v-db713ac8><linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse" data-v-db713ac8><stop stop-color="#6366f1" data-v-db713ac8></stop><stop offset="1" stop-color="#2563eb" data-v-db713ac8></stop></linearGradient></defs></svg><span class="brand-name" data-v-db713ac8>Kenwa</span><span class="brand-tag" data-v-db713ac8>Admin</span></div><p class="brand-sub" data-v-db713ac8>Beveiligd beheerportaal</p></div><div class="login-card" data-v-db713ac8>`);
      if (!awaitingTwoFactor.value) {
        _push(`<div class="card-body" data-v-db713ac8><div class="card-header" data-v-db713ac8><div class="lock-icon" data-v-db713ac8><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><rect x="3" y="11" width="18" height="11" rx="2" ry="2" data-v-db713ac8></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" data-v-db713ac8></path></svg></div><h1 data-v-db713ac8>Inloggen</h1><p data-v-db713ac8>Vul je admingegevens in om door te gaan</p></div><form class="form" data-v-db713ac8><div class="field" data-v-db713ac8><label for="email" data-v-db713ac8>E-mailadres</label><div class="input-wrap" data-v-db713ac8><svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><rect x="2" y="4" width="20" height="16" rx="2" data-v-db713ac8></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" data-v-db713ac8></path></svg><input id="email"${ssrRenderAttr("value", form.email)} type="email" placeholder="admin@kenwa.nl" autocomplete="email" required data-v-db713ac8></div></div><div class="field" data-v-db713ac8><label for="password" data-v-db713ac8>Wachtwoord</label><div class="input-wrap" data-v-db713ac8><svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><rect x="3" y="11" width="18" height="11" rx="2" ry="2" data-v-db713ac8></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" data-v-db713ac8></path></svg><input id="password"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" autocomplete="current-password" required data-v-db713ac8><button type="button" class="eye-btn"${ssrRenderAttr("aria-label", showPassword.value ? "Verberg wachtwoord" : "Toon wachtwoord")} data-v-db713ac8>`);
        if (!showPassword.value) {
          _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-v-db713ac8></path><circle cx="12" cy="12" r="3" data-v-db713ac8></circle></svg>`);
        } else {
          _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" data-v-db713ac8></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" data-v-db713ac8></path><line x1="1" y1="1" x2="23" y2="23" data-v-db713ac8></line></svg>`);
        }
        _push(`</button></div></div>`);
        if (unref(authStore).error) {
          _push(`<div class="error-box" data-v-db713ac8><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><circle cx="12" cy="12" r="10" data-v-db713ac8></circle><line x1="12" y1="8" x2="12" y2="12" data-v-db713ac8></line><line x1="12" y1="16" x2="12.01" y2="16" data-v-db713ac8></line></svg><span data-v-db713ac8>${ssrInterpolate(unref(authStore).error)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="btn-submit"${ssrIncludeBooleanAttr(unref(authStore).loading) ? " disabled" : ""} data-v-db713ac8>`);
        if (unref(authStore).loading) {
          _push(`<span class="spinner" data-v-db713ac8></span>`);
        } else {
          _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" data-v-db713ac8></path><polyline points="10 17 15 12 10 7" data-v-db713ac8></polyline><line x1="15" y1="12" x2="3" y2="12" data-v-db713ac8></line></svg>`);
        }
        _push(` ${ssrInterpolate(unref(authStore).loading ? "Even geduld..." : "Inloggen")}</button></form></div>`);
      } else {
        _push(`<div class="card-body twofa-body" data-v-db713ac8><div class="card-header" data-v-db713ac8><div class="lock-icon twofa-icon-wrap" data-v-db713ac8><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><rect x="2" y="4" width="20" height="16" rx="2" data-v-db713ac8></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" data-v-db713ac8></path></svg></div><h1 data-v-db713ac8>Verificatie vereist</h1><p data-v-db713ac8> Een 6-cijferige code is verstuurd naar<br data-v-db713ac8><strong class="email-highlight" data-v-db713ac8>${ssrInterpolate(((_a = challenge.value) == null ? void 0 : _a.email) || form.email)}</strong></p></div><div class="info-banner" data-v-db713ac8><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><circle cx="12" cy="12" r="10" data-v-db713ac8></circle><path d="M12 16v-4M12 8h.01" data-v-db713ac8></path></svg> Check ook je spam/ongewenste e-mail map. </div>`);
        if ((_b = challenge.value) == null ? void 0 : _b.verificationCode) {
          _push(`<div class="fallback-code" data-v-db713ac8><p data-v-db713ac8>E-mail kon niet worden verstuurd. Gebruik deze code:</p><div class="code-value" data-v-db713ac8>${ssrInterpolate(challenge.value.verificationCode)}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="form" data-v-db713ac8><div class="field" data-v-db713ac8><label for="code" data-v-db713ac8>Verificatiecode</label><input id="code"${ssrRenderAttr("value", loginCode.value)} type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" class="code-input" required data-v-db713ac8></div>`);
        if (unref(authStore).error) {
          _push(`<div class="error-box" data-v-db713ac8><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><circle cx="12" cy="12" r="10" data-v-db713ac8></circle><line x1="12" y1="8" x2="12" y2="12" data-v-db713ac8></line><line x1="12" y1="16" x2="12.01" y2="16" data-v-db713ac8></line></svg><span data-v-db713ac8>${ssrInterpolate(unref(authStore).error)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="btn-submit"${ssrIncludeBooleanAttr(unref(authStore).loading) ? " disabled" : ""} data-v-db713ac8>`);
        if (unref(authStore).loading) {
          _push(`<span class="spinner" data-v-db713ac8></span>`);
        } else {
          _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><polyline points="20 6 9 17 4 12" data-v-db713ac8></polyline></svg>`);
        }
        _push(` ${ssrInterpolate(unref(authStore).loading ? "Verifi\xEBren..." : "Verifi\xEBren")}</button><button type="button" class="btn-back" data-v-db713ac8><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><polyline points="15 18 9 12 15 6" data-v-db713ac8></polyline></svg> Terug naar inloggen </button></form></div>`);
      }
      _push(`</div><div class="login-footer" data-v-db713ac8><div class="security-badges" data-v-db713ac8><span class="badge" data-v-db713ac8><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" data-v-db713ac8></path></svg> SSL beveiligd </span><span class="badge" data-v-db713ac8><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><rect x="3" y="11" width="18" height="11" rx="2" data-v-db713ac8></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" data-v-db713ac8></path></svg> JWT versleuteld </span><span class="badge" data-v-db713ac8><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-db713ac8><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-v-db713ac8></path><polyline points="22,4 12,14.01 9,11.01" data-v-db713ac8></polyline></svg> 2FA vereist </span></div><p class="footer-text" data-v-db713ac8>Kenwa Admin \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} \u2014 Alleen geautoriseerde admins</p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-db713ac8"]]);

export { login as default };
//# sourceMappingURL=login-CltHzqi6.mjs.map
