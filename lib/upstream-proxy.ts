const WORDPRESS_ORIGIN =
  process.env.WORDPRESS_ORIGIN || 'https://kisiselgelisimforum.com'

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'content-encoding',
  'content-length',
])

export async function proxyUpstream(
  request: Request,
  path: string,
): Promise<Response> {
  const { search } = new URL(request.url)
  const upstreamUrl = `${WORDPRESS_ORIGIN}${path}${search}`

  const upstream = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: request.headers.get('accept') ?? '*/*',
      'Accept-Language':
        request.headers.get('accept-language') ?? 'en-US,en;q=0.5',
    },
    redirect: 'follow',
  })

  const headers = new Headers()
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value)
  })

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  })
}
