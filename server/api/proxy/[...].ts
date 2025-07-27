export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { method, url } = event.node.req

  // Extract the path after /api/proxy/
  const proxyPath = Array.isArray(event.context.params?._)
    ? event.context.params._.join('/')
    : event.context.params?._ || ''

  // Build the target URL
  const targetUrl = `${config.backendUrl}/${proxyPath}/`

  try {
    // Get the request body if it exists
    let body = undefined
    if (method !== 'GET' && method !== 'HEAD') {
      body = await readBody(event)
    }

    // Forward the request to the backend
    const response = await $fetch(targetUrl, {
      method: method as any,
      body,
      headers: {
        // Forward relevant headers
        'content-type': getHeader(event, 'content-type') || 'application/json',
        'authorization': getHeader(event, 'authorization') || '',
      },
    })

    return response
  } catch (error: any) {
    // Handle errors appropriately
    if (error.response) {
      setResponseStatus(event, error.response.status)
      return error.response._data || error.response.data || { error: 'Backend error' }
    }

    setResponseStatus(event, 500)
    return { error: 'Internal server error' }
  }
})
