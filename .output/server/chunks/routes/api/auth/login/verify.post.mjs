import { c as defineEventHandler, r as readBody, u as useRuntimeConfig, e as createError } from '../../../../_/nitro.mjs';
import { a as attachTokenCookie } from '../../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const verify_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  const { kenwaApiUrl } = useRuntimeConfig();
  try {
    const response = await $fetch(
      `${kenwaApiUrl}/api/auth/login/verify`,
      { method: "POST", body }
    );
    if (((_a = response.user) == null ? void 0 : _a.role) !== "admin") {
      throw createError({
        statusCode: 403,
        statusMessage: "Toegang geweigerd. Alleen admins kunnen inloggen op dit dashboard."
      });
    }
    attachTokenCookie(event, response.token);
    return response;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({
      statusCode: ((_b = err == null ? void 0 : err.response) == null ? void 0 : _b.status) || (err == null ? void 0 : err.statusCode) || 500,
      statusMessage: ((_c = err == null ? void 0 : err.data) == null ? void 0 : _c.statusMessage) || (err == null ? void 0 : err.message) || "Verificatie mislukt"
    });
  }
});

export { verify_post as default };
//# sourceMappingURL=verify.post.mjs.map
