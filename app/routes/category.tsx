import { PostList } from '~/components/post-list'
import { Pagination } from '~/components/pagination'
import { CACHE_HEADERS, pageMeta } from '~/lib/meta'
import { cms } from '~/lib/microcms.server'
import { PER_PAGE, findCategory } from '~/site'

import type { Route } from './+types/category'

export const headers = () => CACHE_HEADERS

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const category = findCategory(params.categorySlug)
  if (!category) throw new Response('Not Found', { status: 404 })

  const page = Math.max(1, Number(new URL(request.url).searchParams.get('page')) || 1)
  const { contents, totalCount } = await cms(context.cloudflare.env).listBlogs({
    limit: PER_PAGE,
    page,
    categoryId: category.id,
  })
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE))
  if (page > totalPages) throw new Response('Not Found', { status: 404 })

  return { category, posts: contents, page, totalPages, totalCount }
}

export const meta: Route.MetaFunction = ({ data }) =>
  data
    ? pageMeta({
        title: data.category.name,
        description: data.category.description,
        path: `/${data.category.slug}${data.page > 1 ? `?page=${data.page}` : ''}`,
      })
    : []

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  const { category, posts, page, totalPages, totalCount } = loaderData
  return (
    <div className='mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-20'>
      <header className='mb-10'>
        <h1 className='text-3xl font-bold sm:text-4xl'>{category.name}</h1>
        <p className='mt-3 text-muted'>
          {category.description}
          <span className='ml-3 text-sm'>{totalCount}件</span>
        </p>
      </header>
      <PostList posts={posts} showCategory={false} />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  )
}
