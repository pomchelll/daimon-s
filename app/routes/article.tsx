import { Link, redirect } from 'react-router'
import { Cover } from '~/components/cover'
import { HintBar, TopBar } from '~/components/screen'
import { Toc } from '~/components/toc'
import avatar from '~/image/daimon-avatar.webp'
import { buildToc, formatDate } from '~/lib/format'
import { CACHE_HEADERS, pageMeta } from '~/lib/meta'
import { cms } from '~/lib/microcms.server'
import { SITE, findCategory } from '~/site'

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
    <div className='hs-screen'>
      <TopBar back={{ to: `/${post.category.slug}`, label: 'ホーム' }} />

      <main className='mx-auto w-full max-w-6xl flex-1 px-[var(--gutter)] pt-[var(--space-6)] pb-[var(--space-6)]'>
        <header className='grid items-center gap-[var(--space-5)] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]'>
          <Cover image={post.eyecatch} color={cat?.tiles[0] ?? 'ink'} caption={cat?.name} />
          <div>
            <div className='flex flex-wrap gap-[var(--space-2)]'>
              <Link to={`/${post.category.slug}`} className='hs-chip' prefetch='intent'>
                {cat?.name ?? post.category.name}
              </Link>
              <span className='hs-chip'>
                <time dateTime={post.publishedAt}>{published}</time>
              </span>
              {revised && revised !== published && (
                <span className='hs-chip text-[var(--ink-muted)]'>
                  <time dateTime={post.revisedAt}>{revised}</time> 更新
                </span>
              )}
            </div>
            <h1 className='t-display mt-[var(--space-4)] text-[26px] sm:text-[34px]'>{post.title}</h1>
            {post.description && (
              <p className='t-body mt-[var(--space-3)] text-[var(--ink-muted)]'>{post.description}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <ul className='mt-[var(--space-3)] flex flex-wrap gap-x-3 t-label text-[var(--ink-muted)]'>
                {post.tags.map((t) => (
                  <li key={t.id}>#{t.name}</li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className='mt-[var(--space-6)] grid gap-[var(--space-5)] lg:grid-cols-[minmax(0,42rem)_14rem] lg:justify-between'>
          <div className='min-w-0'>
            {toc.length > 0 && (
              <details className='mb-[var(--space-5)] rounded-[var(--radius-tile)] bg-[var(--surface-raised)] px-[var(--space-4)] py-[var(--space-3)] lg:hidden'>
                <summary className='t-label cursor-pointer'>もくじ</summary>
                <div className='mt-[var(--space-3)]'>
                  <Toc items={toc} />
                </div>
              </details>
            )}
            <div className='article' dangerouslySetInnerHTML={{ __html: html }} />

            <aside
              className='mt-[var(--space-6)] flex flex-wrap items-center gap-[var(--space-3)] rounded-[var(--radius-cover)] bg-[var(--surface-raised)] p-[var(--space-4)]'
              aria-label='書いた人'
            >
              <img src={avatar} alt='' width={56} height={56} className='rounded-full' />
              <div className='min-w-0 flex-1'>
                <p className='t-title'>{SITE.author}</p>
                <p className='t-label font-medium text-[var(--ink-muted)]'>人間界のエイリアン植物</p>
              </div>
              <Link to='/about' className='hs-btn hs-btn--primary' prefetch='intent'>
                プロフィール
              </Link>
            </aside>
          </div>

          {toc.length > 0 && (
            <aside className='hidden lg:block' aria-label='もくじ'>
              <div className='sticky top-8'>
                <p className='t-caption mb-[var(--space-3)] text-[var(--ink-muted)]'>もくじ</p>
                <Toc items={toc} trackActive />
              </div>
            </aside>
          )}
        </div>
      </main>

      <HintBar />
    </div>
  )
}
