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
const auth = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const authStore = useAuthStore();
  if (!authStore.loggedIn) {
    const profile = ([__temp, __restore] = executeAsync(() => authStore.fetchProfile()), __temp = await __temp, __restore(), __temp);
    if (!profile) {
      const redirect = encodeURIComponent(to.fullPath);
      return navigateTo(`/login?redirect=${redirect}`);
    }
  }
});
export {
  auth as default
};
//# sourceMappingURL=auth-DwntFs5g.js.map
