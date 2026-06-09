import { c as defineEventHandler, r as readBody, u as useRuntimeConfig, e as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const login_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const { kenwaApiUrl } = useRuntimeConfig();
  try {
    const response = await $fetch(`${kenwaApiUrl}/api/auth/login`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" }
    });
    return response;
  } catch (err) {
    throw createError({
      statusCode: ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status) || (err == null ? void 0 : err.statusCode) || 500,
      statusMessage: ((_b = err == null ? void 0 : err.data) == null ? void 0 : _b.statusMessage) || (err == null ? void 0 : err.message) || "Inloggen mislukt"
    });
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
