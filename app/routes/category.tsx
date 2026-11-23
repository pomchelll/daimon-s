import { redirect } from 'react-router'
import { ShelfScreen } from '~/components/shelf-screen'
import { CACHE_HEADERS, pageMeta } from '~/lib/meta'
import { loadShelf, loadWorksShelf } from '~/lib/shelf.server'
import { findBlogCategory, findSection } from '~/site'

import type { Route } from './+types/category'

export const headers = () => CACHE_HEADERS

export async function loader({ params, request, context }: Route.LoaderArgs) {
  // 旧カテゴリ（/learning など）の一覧は「ブログ」へ
  if (findBlogCategory(params.categorySlug)) throw redirect('/blog', 301)

  const section = findSection(params.categorySlug)
  if (!section) throw new Response('Not Found', { status: 404 })
  const shelf =
    section.slug === 'blog'
      ? await loadShelf(context.cloudflare.env, request)
      : loadWorksShelf(section.slug)
  return { ...shelf, section }
}

export const meta: Route.MetaFunction = ({ data }) =>
  data
    ? pageMeta({
        title: data.section.name,
        description: data.section.description,
        path: `/${data.section.slug}${data.page > 1 ? `?page=${data.page}` : ''}`,
      })
    : []

export default function SectionPage({ loaderData }: Route.ComponentProps) {
  const { section, ...shelf } = loaderData
  return (
    <ShelfScreen heading={section.name} active={`/${section.slug}`} empty={section.empty} {...shelf} />
  )
}
