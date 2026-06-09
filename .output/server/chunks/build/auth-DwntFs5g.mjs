import { E as executeAsync } from '../_/nitro.mjs';
import { i as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useAuthStore } from './auth-BXQTwBgC.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

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

export { auth as default };
//# sourceMappingURL=auth-DwntFs5g.mjs.map
