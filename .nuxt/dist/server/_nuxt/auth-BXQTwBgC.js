import { b as useNuxtApp, f as defineStore } from "../server.mjs";
import { ref, computed } from "vue";
import { parse } from "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/cookie-es/dist/index.mjs";
import { getRequestHeader, setCookie, getCookie, deleteCookie } from "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/h3/dist/index.mjs";
import destr from "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/destr/dist/index.mjs";
import { isEqual } from "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ohash/dist/index.mjs";
import { klona } from "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/klona/dist/index.mjs";
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
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
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
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
    return err?.data?.message || err?.data?.statusMessage || err?.response?._data?.message || err?.response?._data?.statusMessage || err?.message || null;
  }
  async function login(payload) {
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
      error.value = err?.data?.statusMessage || err.message || "Inloggen mislukt";
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
      error.value = err?.data?.statusMessage || err.message || "Verifiëren van code mislukt";
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
export {
  useAuthStore as u
};
//# sourceMappingURL=auth-BXQTwBgC.js.map
