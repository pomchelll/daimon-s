import { SITE } from '~/site'

export function pageMeta(opts: {
  title?: string
  description?: string
  path: string
  image?: string
  type?: 'website' | 'article'
}) {
  const title = opts.title ? `${opts.title} | ${SITE.name}` : `${SITE.name} | ダイモン シュウの個人サイト`
  const description = opts.description || SITE.description
  const url = `${SITE.url}${opts.path}`
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: opts.type ?? 'website' },
    ...(opts.image ? [{ property: 'og:image', content: opts.image }] : []),
    { name: 'twitter:card', content: opts.image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:site', content: `@${SITE.x.handle}` },
  ]
}

export const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
}
