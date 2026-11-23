import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { formatDate, imgUrl } from '~/lib/format'
import { CATEGORIES, LIGHT_TILES, findCategory } from '~/site'
import type { BlogSummary } from '~/types'
import { Icon } from './icons'

/** カテゴリごとのパレットを、カテゴリ内の並び順で順番に使う */
function tileColors(posts: BlogSummary[], offset: number) {
  const count: Record<string, number> = {}
  return posts.map((post) => {
    const slug = post.category?.slug ?? ''
    const palette = findCategory(slug)?.tiles ?? CATEGORIES[0].tiles
    const n = (count[slug] = (count[slug] ?? (offset % palette.length) - 1) + 1)
    return palette[n % palette.length]
  })
}

/**
 * 記事を横一列に並べる棚。
 * タイルを押すと選択、選択中をもう一度押すと記事をひらく（オブジェクト → アクション）。
 * ←→ キーで選択を移動、Enter でひらく。
 */
export function Shelf({
  posts,
  offset = 0,
  prev,
  next,
}: {
  posts: BlogSummary[]
  offset?: number
  prev?: string
  next?: string
}) {
  const [selected, setSelected] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const current = posts[selected]
  const colors = tileColors(posts, offset)

  const focusTile = (i: number) => {
    const el = listRef.current?.querySelectorAll<HTMLElement>('[data-tile]')[i]
    el?.focus()
    el?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' && selected < posts.length - 1) {
      e.preventDefault()
      setSelected(selected + 1)
      focusTile(selected + 1)
    } else if (e.key === 'ArrowLeft' && selected > 0) {
      e.preventDefault()
      setSelected(selected - 1)
      focusTile(selected - 1)
    }
  }

  if (posts.length === 0) {
    return (
      <div className='px-[var(--gutter)] py-16 text-[var(--ink-muted)]'>
        まだ記事がありません。microCMS で記事を公開すると、ここに並びます。
      </div>
    )
  }

  return (
    <section aria-label='記事の棚'>
      <p className='hs-shelf-title' aria-live='polite'>
        <span className='hs-shelf-title__text'>{current.title}</span>
        <span className='t-label shrink-0 font-medium text-[var(--ink-muted)]'>
          {formatDate(current.publishedAt)}
        </span>
      </p>
      <div className='hs-shelf' ref={listRef} onKeyDown={onKeyDown}>
        {prev && (
          <Link to={prev} className='hs-tile hs-tile--more' aria-label='新しい記事へもどる'>
            <span className='hs-tile__meta flex items-center gap-1 t-label'>
              <Icon name='back' size={18} />
              もどる
            </span>
          </Link>
        )}
        {posts.map((post, i) => {
          const color = colors[i]
          const isSelected = i === selected
          const href = `/${post.category.slug}/${post.id}`
          const cat = findCategory(post.category.slug)?.name ?? post.category.name
          return (
            <Link
              key={post.id}
              to={href}
              data-tile
              prefetch={isSelected ? 'render' : 'none'}
              aria-current={isSelected ? 'true' : undefined}
              aria-label={`${post.title}（${cat}）`}
              className={`hs-tile hs-tile--${color} ${LIGHT_TILES.has(color) ? 'hs-tile--light' : ''}`}
              onClick={(e) => {
                if (!isSelected) {
                  e.preventDefault()
                  setSelected(i)
                }
              }}
              onFocus={(e) => {
                // キーボードでのフォーカスだけ選択を移す（マウスは2回押し）
                if (e.currentTarget.matches(':focus-visible')) setSelected(i)
              }}
            >
              {post.eyecatch ? (
                <img
                  className='hs-tile__img'
                  src={imgUrl(post.eyecatch.url, 420)}
                  alt=''
                  loading={i < 6 ? 'eager' : 'lazy'}
                />
              ) : (
                <>
                  <span className='hs-tile__deco' />
                  <span className='hs-tile__no'>{String(offset + i + 1).padStart(2, '0')}</span>
                  <span className='hs-tile__meta'>
                    <span className='hs-tile__cat'>{cat}</span>
                    <span className='hs-tile__title'>{post.title}</span>
                  </span>
                </>
              )}
            </Link>
          )
        })}
        {next && (
          <Link to={next} className='hs-tile hs-tile--more' aria-label='つづきの記事を見る'>
            <span className='hs-tile__meta flex items-center gap-1 t-label'>
              つづき
              <Icon name='next' size={18} />
            </span>
          </Link>
        )}
      </div>
    </section>
  )
}

export function ShelfHints() {
  return (
    <>
      <span className='hs-hint hidden md:inline-flex'>◀ ▶ えらぶ</span>
      <span className='hs-hint hidden md:inline-flex'>
        <span className='hs-key'>↵</span>ひらく
      </span>
      <span className='hs-hint md:hidden'>もう一度おすと ひらく</span>
    </>
  )
}
