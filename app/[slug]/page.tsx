import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const WORDPRESS_ORIGIN: any = process.env.WORDPRESS_ORIGIN

const WORDPRESS_HOST = new URL(WORDPRESS_ORIGIN).hostname

const SITE_NAME = process.env.SITE_NAME || 'Redirect'

type PostMeta = {
  title: string
  description: string | null
  image: string | null
  imageWidth: number | null
  imageHeight: number | null
  imageAlt: string | null
  siteName: string | null
  publishedTime: string | null
  modifiedTime: string | null
  author: string | null
  locale: string | null
}

function maskUpstreamUrl(raw: string | null): string | null {
  if (!raw) return null

  try {
    const url = new URL(raw)

    if (
      url.hostname === WORDPRESS_HOST ||
      url.hostname.endsWith(`.${WORDPRESS_HOST}`)
    ) {
      return `${url.pathname}${url.search}`
    }

    return raw
  } catch {
    return raw
  }
}

function pickMeta(html: string, property: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    'i',
  )

  const reversed = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    'i',
  )

  return html.match(pattern)?.[1] ?? html.match(reversed)?.[1] ?? null
}

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

async function fetchPostMeta(slug: string): Promise<PostMeta | null> {
  const res = await fetch(`${WORDPRESS_ORIGIN}/${slug}`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    next: { revalidate: 300 },
  })

  if (!res.ok) return null

  const html = await res.text()

  const ogTitle = pickMeta(html, 'og:title')
  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? null
  const ogImage = pickMeta(html, 'og:image')

  const title = decodeEntities((ogTitle ?? titleTag ?? '').trim())

  if (!title) return null

  return {
    title,
    image: maskUpstreamUrl(ogImage),
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const meta = await fetchPostMeta(slug)

  if (!meta) return {}

  return {
    title: meta.title,
    openGraph: {
      title: meta.title,
      images: meta.image ? [{ url: meta.image }] : [],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const meta = await fetchPostMeta(slug)

  if (!meta) notFound()

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
        {meta.title}
      </h1>

      {meta.image && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={meta.image}
            alt={meta.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}
    </main>
  )
}