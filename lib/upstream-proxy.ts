const WORDPRESS_ORIGIN =
  process.env.WORDPRESS_ORIGIN || 'https://kisiselgelisimforum.com'

const PASSTHROUGH_HEADERS = [
  'content-type',
  'cache-control',
  'last-modified',
  'etag',
  'expires',
  'date',
  'vary',
]

export async function proxyUpstream(
  request: Request,
  path: string,
): Promise<Response> {
  const { search } = new URL(request.url)
  const upstreamUrl = `${WORDPRESS_ORIGIN}${path}${search}`

  const outgoing: Record<string, string> = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: request.headers.get('accept') ?? '*/*',
    'Accept-Language':
      request.headers.get('accept-language') ?? 'en-US,en;q=0.5',
  }

  const authHeaderName = process.env.UPSTREAM_AUTH_HEADER
  const authHeaderValue = process.env.UPSTREAM_AUTH_SECRET
  if (authHeaderName && authHeaderValue) {
    outgoing[authHeaderName] = authHeaderValue
  }

  let upstream: Response
  try {
    upstream = await fetch(upstreamUrl, {
      method: request.method === 'HEAD' ? 'HEAD' : 'GET',
      headers: outgoing,
      redirect: 'follow',
    })
  } catch (err) {
    return new Response(`Upstream fetch failed: ${(err as Error).message}`, {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  const headers = new Headers()
  for (const name of PASSTHROUGH_HEADERS) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }
  if (!headers.has('cache-control')) {
    headers.set('cache-control', 'public, max-age=86400')
  }

  if (request.method === 'HEAD') {
    return new Response(null, { status: upstream.status, headers })
  }

  const body = await upstream.arrayBuffer()
  return new Response(body, { status: upstream.status, headers })
}
