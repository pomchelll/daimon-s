import { ShelfScreen } from '~/components/shelf-screen'
import { CACHE_HEADERS, pageMeta } from '~/lib/meta'
import { loadShelf } from '~/lib/shelf.server'
import { findCategory } from '~/site'

import type { Route } from './+types/category'

export const headers = () => CACHE_HEADERS

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const category = findCategory(params.categorySlug)
  if (!category) throw new Response('Not Found', { status: 404 })
  const shelf = await loadShelf(context.cloudflare.env, request, category.id)
  return { ...shelf, category: { name: category.name, slug: category.slug, description: category.description } }
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
  const { category, ...shelf } = loaderData
  return <ShelfScreen heading={category.name} active={`/${category.slug}`} {...shelf} />
}
