import { c as defineEventHandler, e as createError, u as useRuntimeConfig } from '../../../_/nitro.mjs';
import { g as getTokenFromRequest } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const profile_get = defineEventHandler(async (event) => {
  var _a;
  const token = getTokenFromRequest(event);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Niet geautoriseerd" });
  }
  const { kenwaApiUrl } = useRuntimeConfig();
  try {
    const response = await $fetch(
      `${kenwaApiUrl}/api/auth/profile`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (((_a = response.user) == null ? void 0 : _a.role) !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Geen admin toegang" });
    }
    return response;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 401, statusMessage: "Sessie verlopen" });
  }
});

export { profile_get as default };
//# sourceMappingURL=profile.get.mjs.map
