import { executeAsync } from "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/unctx/dist/index.mjs";
import { i as defineNuxtRouteMiddleware, n as navigateTo } from "../server.mjs";
import { u as useAuthStore } from "./auth-BXQTwBgC.js";
import "vue";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/hookable/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/defu/dist/defu.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ufo/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/klona/dist/index.mjs";
import "vue/server-renderer";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/cookie-es/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/destr/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ohash/dist/index.mjs";
const guest = defineNuxtRouteMiddleware(async () => {
  let __temp, __restore;
  const authStore = useAuthStore();
  if (!authStore.loggedIn) {
    [__temp, __restore] = executeAsync(() => authStore.fetchProfile()), await __temp, __restore();
  }
  if (authStore.loggedIn) {
    return navigateTo("/admin");
  }
});
export {
  guest as default
};
//# sourceMappingURL=guest-LuOjPULZ.js.map
