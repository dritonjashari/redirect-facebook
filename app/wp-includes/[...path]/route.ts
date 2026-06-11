import { proxyUpstream } from '@/lib/upstream-proxy'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyUpstream(request, `/wp-includes/${path.join('/')}`)
}

export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyUpstream(request, `/wp-includes/${path.join('/')}`)
}
