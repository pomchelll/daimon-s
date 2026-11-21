import { Link, redirect } from 'react-router'
import { Profile } from '~/components/profile'
import { Toc } from '~/components/toc'
import { buildToc, formatDate, imgUrl } from '~/lib/format'
import { CACHE_HEADERS, pageMeta } from '~/lib/meta'
import { cms } from '~/lib/microcms.server'
import { findCategory } from '~/site'

import type { Route } from './+types/article'

export const headers = () => CACHE_HEADERS

export async function loader({ params, context }: Route.LoaderArgs) {
  const post = await cms(context.cloudflare.env).getBlog(params.contentId)
  if (!post) throw new Response('Not Found', { status: 404 })

  // カテゴリが変わった記事は正しいURLへ転送
  if (post.category.slug !== params.categorySlug) {
    throw redirect(`/${post.category.slug}/${post.id}`, 301)
  }

  const { html, toc } = buildToc(post.content)
  const { content: _omit, ...rest } = post
  return { post: rest, html, toc }
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) return []
  const { post } = data
  const image = post.ogp?.url ?? post.eyecatch?.url
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/${post.category.slug}/${post.id}`,
    image: image ? `${image}?w=1200&h=630&fit=crop` : undefined,
    type: 'article',
  })
}

export default function ArticlePage({ loaderData }: Route.ComponentProps) {
  const { post, html, toc } = loaderData
  const cat = findCategory(post.category.slug)
  const published = formatDate(post.publishedAt)
  const revised = formatDate(post.revisedAt)

  return (
    <article className='mx-auto max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16'>
      <header className='max-w-3xl'>
        <Link to={`/${post.category.slug}`} className='text-sm font-bold text-moss underline-offset-4 hover:underline'>
          {cat?.name ?? post.category.name}
        </Link>
        <h1 className='mt-3 text-3xl leading-snug font-bold sm:text-4xl'>{post.title}</h1>
        <p className='mt-4 flex flex-wrap gap-x-4 text-sm text-muted'>
          <span>
            <time dateTime={post.publishedAt}>{published}</time> 公開
          </span>
          {revised && revised !== published && (
            <span>
              <time dateTime={post.revisedAt}>{revised}</time> 更新
            </span>
          )}
        </p>
        {post.tags && post.tags.length > 0 && (
          <ul className='mt-2 flex flex-wrap gap-x-3 text-sm text-muted'>
            {post.tags.map((t) => (
              <li key={t.id}>#{t.name}</li>
            ))}
          </ul>
        )}
      </header>

      {post.eyecatch && (
        <img
          src={imgUrl(post.eyecatch.url, 1600)}
          alt=''
          width={post.eyecatch.width}
          height={post.eyecatch.height}
          className='mt-10 aspect-[1200/630] w-full max-w-4xl rounded-md bg-surface object-cover'
        />
      )}

      <div className='mt-10 grid gap-12 lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-between'>
        <div className='min-w-0'>
          {toc.length > 0 && (
            <details className='mb-10 rounded-md border border-line px-4 py-3 lg:hidden'>
              <summary className='cursor-pointer font-bold'>目次</summary>
              <div className='mt-3'>
                <Toc items={toc} />
              </div>
            </details>
          )}
          <div className='article' dangerouslySetInnerHTML={{ __html: html }} />

          <aside className='mt-16 border-t border-line pt-8' aria-label='書いた人'>
            <Profile compact />
          </aside>
        </div>

        {toc.length > 0 && (
          <aside className='hidden lg:block' aria-label='目次'>
            <div className='sticky top-8'>
              <p className='mb-3 text-sm font-bold text-muted'>目次</p>
              <Toc items={toc} trackActive />
            </div>
          </aside>
        )}
      </div>
    </article>
  )
}
