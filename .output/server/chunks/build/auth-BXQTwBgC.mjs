import { f as defineStore, b as useNuxtApp } from './server.mjs';
import { ref, computed } from 'vue';
import { F as klona, G as parse, h as getRequestHeader, d as destr, H as isEqual, f as setCookie, g as getCookie, I as deleteCookie } from '../_/nitro.mjs';

function useRequestEvent(nuxtApp) {
  var _a;
  nuxtApp || (nuxtApp = useNuxtApp());
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a, _b, _c;
  const opts = { ...CookieDefaults, ..._opts };
  (_a = opts.filter) != null ? _a : opts.filter = (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : (_c = cookies[name]) != null ? _c : (_b = opts.default) == null ? void 0 : _b.call(opts));
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies || (nuxtApp._cookies = {});
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = useCookie("kenwa_token", { sameSite: "lax" });
  const loading = ref(false);
  const error = ref(null);
  const errorDetail = ref(null);
  const pendingLoginChallenge = ref(null);
  function resetErrorState() {
    error.value = null;
    errorDetail.value = null;
  }
  function extractErrorDetail(err) {
    var _a, _b, _c, _d, _e, _f;
    return ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.message) || ((_b = err == null ? void 0 : err.data) == null ? void 0 : _b.statusMessage) || ((_d = (_c = err == null ? void 0 : err.response) == null ? void 0 : _c._data) == null ? void 0 : _d.message) || ((_f = (_e = err == null ? void 0 : err.response) == null ? void 0 : _e._data) == null ? void 0 : _f.statusMessage) || (err == null ? void 0 : err.message) || null;
  }
  async function login(payload) {
    var _a;
    loading.value = true;
    resetErrorState();
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: payload
      });
      if ("twoFactorRequired" in response && response.twoFactorRequired) {
        pendingLoginChallenge.value = {
          userId: response.userId,
          email: response.email,
          expiresAt: response.expiresAt,
          message: response.message,
          verificationCode: response.verificationCode
        };
        return null;
      }
      if (response.user.role !== "admin") {
        error.value = "Toegang geweigerd. Alleen admins kunnen inloggen op dit dashboard.";
        token.value = null;
        user.value = null;
        pendingLoginChallenge.value = null;
        return null;
      }
      user.value = response.user;
      token.value = response.token;
      pendingLoginChallenge.value = null;
      return user.value;
    } catch (err) {
      pendingLoginChallenge.value = null;
      error.value = ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.statusMessage) || err.message || "Inloggen mislukt";
      const detail = extractErrorDetail(err);
      if (detail && detail !== error.value) {
        errorDetail.value = detail;
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function verifyLoginCode(code) {
    var _a;
    if (!pendingLoginChallenge.value) {
      throw new Error("Er is geen inlogcode aangevraagd");
    }
    loading.value = true;
    resetErrorState();
    try {
      const response = await $fetch("/api/auth/login/verify", {
        method: "POST",
        body: {
          userId: pendingLoginChallenge.value.userId,
          code
        }
      });
      if (response.user.role !== "admin") {
        error.value = "Toegang geweigerd. Alleen admins kunnen inloggen op dit dashboard.";
        pendingLoginChallenge.value = null;
        return null;
      }
      user.value = response.user;
      token.value = response.token;
      pendingLoginChallenge.value = null;
      return user.value;
    } catch (err) {
      error.value = ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.statusMessage) || err.message || "Verifi\xEBren van code mislukt";
      const detail = extractErrorDetail(err);
      if (detail && detail !== error.value) {
        errorDetail.value = detail;
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }
  function cancelLoginChallenge() {
    resetErrorState();
    pendingLoginChallenge.value = null;
  }
  async function fetchProfile() {
    if (!token.value) {
      return null;
    }
    try {
      resetErrorState();
      const response = await $fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      if (response.user.role !== "admin") {
        token.value = null;
        user.value = null;
        return null;
      }
      user.value = response.user;
      return response.user;
    } catch {
      token.value = null;
      user.value = null;
      return null;
    }
  }
  async function logout() {
    await $fetch("/api/auth/logout", { method: "POST" });
    token.value = null;
    user.value = null;
    pendingLoginChallenge.value = null;
  }
  const loggedIn = computed(() => !!user.value && !!token.value && user.value.role === "admin");
  const awaitingTwoFactor = computed(() => !!pendingLoginChallenge.value && !loggedIn.value);
  return {
    user,
    token,
    loading,
    error,
    errorDetail,
    pendingLoginChallenge,
    loggedIn,
    awaitingTwoFactor,
    login,
    verifyLoginCode,
    cancelLoginChallenge,
    fetchProfile,
    logout
  };
});

export { useAuthStore as u };
//# sourceMappingURL=auth-BXQTwBgC.mjs.map
