import { PER_SHELF } from '~/site'
import { cms } from './microcms.server'

export async function loadShelf(env: Env, request: Request, categoryId?: string) {
  const page = Math.max(1, Number(new URL(request.url).searchParams.get('page')) || 1)
  const { contents, totalCount } = await cms(env).listBlogs({
    limit: PER_SHELF,
    page,
    categoryId,
  })
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_SHELF))
  if (page > totalPages) throw new Response('Not Found', { status: 404 })
  return {
    posts: contents,
    page,
    offset: (page - 1) * PER_SHELF,
    prev: page > 1 ? (page === 2 ? '?' : `?page=${page - 1}`) : undefined,
    next: page < totalPages ? `?page=${page + 1}` : undefined,
  }
}
