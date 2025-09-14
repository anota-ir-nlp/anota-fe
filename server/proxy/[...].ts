export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { method } = event.node.req

  const proxyPath = Array.isArray(event.context.params?._)
    ? event.context.params._.join('/')
    : event.context.params?._ || ''

  const query = getQuery(event)
  const queryString = Object.keys(query).length
    ? '?' + new URLSearchParams(query as Record<string, string>).toString()
    : ''

  const targetUrl = `${config.backendUrl}/${proxyPath}${queryString}`

  console.log(`Proxying ${method} request to: ${targetUrl}`)

  try {
    let body = undefined
    if (method !== 'GET' && method !== 'HEAD') {
      body = await readBody(event)
    }

    // Forward the request to the backend
    const response = await $fetch(targetUrl, {
      method: method as any,
      body,
      headers: {
        'content-type': getHeader(event, 'content-type') || 'application/json',
        'authorization': getHeader(event, 'authorization') || '',
        'user-agent': 'Anota-Frontend-Proxy/1.0',
      },
      redirect: 'follow',
      retry: 1,
      onRequest({ request, options }) {
        console.log(`Making request to: ${request}`)
      },
      onResponse({ response }) {
        console.log(`Backend responded with: ${response.status} ${response.statusText}`)
        if (response.status === 302) {
          console.log(`Redirect location: ${response.headers.get('location')}`)
        }
      },
      onResponseError({ response }) {
        console.error(`Backend API Error: ${response.status} ${response.statusText}`)
        console.error(`Target URL: ${targetUrl}`)
        console.error(`Response headers:`, response.headers)
        if (response.status === 302) {
          console.error(`Redirect detected - Location: ${response.headers.get('location')}`)
        }
      }
    })

    return response
  } catch (error: any) {
    console.error(`Proxy error for ${targetUrl}:`, error)
    
    if (error.response) {
      setResponseStatus(event, error.response.status)
      return error.response._data || error.response.data || { error: 'Backend error' }
    }

    setResponseStatus(event, 500)
    return { error: 'Internal server error' }
  }
})
