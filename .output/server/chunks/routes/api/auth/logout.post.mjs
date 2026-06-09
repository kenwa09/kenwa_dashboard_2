import { c as defineEventHandler, u as useRuntimeConfig } from '../../../_/nitro.mjs';
import { g as getTokenFromRequest, c as clearTokenCookie } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const logout_post = defineEventHandler(async (event) => {
  const { kenwaApiUrl } = useRuntimeConfig();
  const token = getTokenFromRequest(event);
  if (token) {
    await $fetch(`${kenwaApiUrl}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {
    });
  }
  clearTokenCookie(event);
  return { ok: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
