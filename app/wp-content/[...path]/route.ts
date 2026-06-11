import { proxyUpstream } from '@/lib/upstream-proxy'

export const runtime = 'edge'

type Ctx = { params: Promise<{ path: string[] }> }

async function handle(request: Request, { params }: Ctx) {
  const { path } = await params
  return proxyUpstream(request, `/wp-content/${path.join('/')}`)
}

export { handle as GET, handle as HEAD }
