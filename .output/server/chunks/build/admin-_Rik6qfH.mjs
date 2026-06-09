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

const admin = defineNuxtRouteMiddleware(async () => {
  var _a;
  let __temp, __restore;
  const authStore = useAuthStore();
  if (!authStore.loggedIn) {
    [__temp, __restore] = executeAsync(() => authStore.fetchProfile()), await __temp, __restore();
  }
  if (!authStore.loggedIn || ((_a = authStore.user) == null ? void 0 : _a.role) !== "admin") {
    return navigateTo("/login");
  }
});

export { admin as default };
//# sourceMappingURL=admin-_Rik6qfH.mjs.map
