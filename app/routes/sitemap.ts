import { cms } from '~/lib/microcms.server'
import { SECTIONS, SITE } from '~/site'
import { WORKS } from '~/works'

import type { Route } from './+types/sitemap'

export async function loader({ context }: Route.LoaderArgs) {
  const posts = await cms(context.cloudflare.env).allBlogsForSitemap()
  const urls = [
    `<url><loc>${SITE.url}/</loc></url>`,
    `<url><loc>${SITE.url}/about</loc></url>`,
    ...SECTIONS.map((s) => `<url><loc>${SITE.url}/${s.slug}</loc></url>`),
    ...WORKS.map((w) => `<url><loc>${SITE.url}/${w.section}/${w.id}</loc></url>`),
    ...posts.map(
      (p) =>
        `<url><loc>${SITE.url}/${p.category.slug}/${p.id}</loc><lastmod>${p.revisedAt}</lastmod></url>`,
    ),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
