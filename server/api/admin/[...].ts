import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const { kenwaApiUrl } = useRuntimeConfig()
  const path = event.path || event.node.req.url || ''
  return proxyRequest(event, `${kenwaApiUrl}${path}`)
})
