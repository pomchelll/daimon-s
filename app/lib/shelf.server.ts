import { imgUrl } from '~/lib/format'
import { PER_SHELF, findBlogCategory } from '~/site'
import type { BlogSummary, ShelfItem } from '~/types'
import { WORKS, type Work, workStyle, worksIn } from '~/works'
import { cms } from './microcms.server'

const blogToItem = (post: BlogSummary): ShelfItem => ({
  key: `blog-${post.id}`,
  href: `/${post.category.slug}/${post.id}`,
  title: post.title,
  date: post.publishedAt ?? post.createdAt,
  label: 'ブログ',
  color: findBlogCategory(post.category.slug)?.color ?? 'blue',
  image: post.eyecatch ? imgUrl(post.eyecatch.url, 800) : undefined,
})

const workToItem = (w: Work): ShelfItem => {
  const { label, color } = workStyle(w)
  return {
    key: `${w.section}-${w.id}`,
    href: `/${w.section}/${w.id}`,
    title: w.title,
    date: w.date,
    label,
    color,
    image: w.image,
  }
}

const time = (iso: string) => Date.parse(iso)

/**
 * microCMS の記事をページ送りで棚に並べる。
 * withWorks のときは、そのページの日付の範囲に入るプロダクト・プロジェクトも混ぜる（ホーム用）。
 */
export async function loadShelf(env: Env, request: Request, { withWorks = false } = {}) {
  const page = Math.max(1, Number(new URL(request.url).searchParams.get('page')) || 1)
  const offset = (page - 1) * PER_SHELF
  const client = cms(env)
  const { contents, totalCount } = await client.listBlogs({ limit: PER_SHELF, offset })
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_SHELF))
  if (page > totalPages) throw new Response('Not Found', { status: 404 })
  const hasNext = page < totalPages

  let items = contents.map(blogToItem)
  if (withWorks) {
    // このページの範囲： (このページ最後の記事, 前ページ最後の記事]
    const lower = hasNext ? time(items[items.length - 1].date) : -Infinity
    let upper = Infinity
    if (page > 1) {
      const prev = await client.listBlogs({ limit: 1, offset: offset - 1 })
      if (prev.contents[0]) upper = time(blogToItem(prev.contents[0]).date)
    }
    const works = WORKS.filter((w) => time(w.date) > lower && time(w.date) <= upper).map(workToItem)
    items = [...items, ...works].sort((a, b) => time(b.date) - time(a.date))
  }

  return {
    items,
    offset,
    page,
    prev: page > 1 ? (page === 2 ? '?' : `?page=${page - 1}`) : undefined,
    next: hasNext ? `?page=${page + 1}` : undefined,
  }
}

/** プロダクト作成・プロジェクトの棚（件数が少ないので1ページにまとめる） */
export function loadWorksShelf(section: Work['section']) {
  return { items: worksIn(section).map(workToItem), offset: 0, page: 1, prev: undefined, next: undefined }
}
