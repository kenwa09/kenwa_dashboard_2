import { c as defineEventHandler, u as useRuntimeConfig, p as proxyRequest } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _____ = defineEventHandler(async (event) => {
  const { kenwaApiUrl } = useRuntimeConfig();
  const path = event.path || event.node.req.url || "";
  return proxyRequest(event, `${kenwaApiUrl}${path}`);
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
