import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { formatDate } from '~/lib/format'
import { LIGHT_TILES } from '~/site'
import type { ShelfItem } from '~/types'
import { Icon } from './icons'

/**
 * 本（タイル）を横一列に並べる棚。
 * タイルを押すと選択、選択中をもう一度押すとひらく（オブジェクト → アクション）。
 * ←→ キーで選択を移動、Enter でひらく。
 */
export function Shelf({
  items,
  offset = 0,
  prev,
  next,
  empty,
}: {
  items: ShelfItem[]
  offset?: number
  prev?: string
  next?: string
  empty: string
}) {
  const [selected, setSelected] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const current = items[selected]

  const focusTile = (i: number) => {
    const el = listRef.current?.querySelectorAll<HTMLElement>('[data-tile]')[i]
    el?.focus()
    el?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' && selected < items.length - 1) {
      e.preventDefault()
      setSelected(selected + 1)
      focusTile(selected + 1)
    } else if (e.key === 'ArrowLeft' && selected > 0) {
      e.preventDefault()
      setSelected(selected - 1)
      focusTile(selected - 1)
    }
  }

  if (items.length === 0) {
    return <div className='px-[var(--gutter)] py-16 text-[var(--ink-muted)]'>{empty}</div>
  }

  return (
    <section aria-label='棚'>
      <p className='hs-shelf-title' aria-live='polite'>
        <span className='hs-shelf-title__text'>{current.title}</span>
        <span className='t-label shrink-0 font-medium text-[var(--ink-muted)]'>
          {formatDate(current.date)}
        </span>
      </p>
      <div className='hs-shelf' ref={listRef} onKeyDown={onKeyDown}>
        {prev && (
          <Link to={prev} className='hs-tile hs-tile--more' aria-label='新しいものへもどる'>
            <span className='hs-tile__meta flex items-center gap-1 t-label'>
              <Icon name='back' size={18} />
              もどる
            </span>
          </Link>
        )}
        {items.map((item, i) => {
          const isSelected = i === selected
          return (
            <Link
              key={item.key}
              to={item.href}
              data-tile
              prefetch={isSelected ? 'render' : 'none'}
              aria-current={isSelected ? 'true' : undefined}
              aria-label={`${item.title}（${item.label}）`}
              className={`hs-tile hs-tile--${item.color} ${LIGHT_TILES.has(item.color) ? 'hs-tile--light' : ''}`}
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
              {item.image ? (
                <img className='hs-tile__img' src={item.image} alt='' loading={i < 6 ? 'eager' : 'lazy'} />
              ) : (
                <>
                  <span className='hs-tile__deco' />
                  <span className='hs-tile__no'>{String(offset + i + 1).padStart(2, '0')}</span>
                  <span className='hs-tile__meta'>
                    <span className='hs-tile__cat'>{item.label}</span>
                    <span className='hs-tile__title'>{item.title}</span>
                  </span>
                </>
              )}
            </Link>
          )
        })}
        {next && (
          <Link to={next} className='hs-tile hs-tile--more' aria-label='つづきを見る'>
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
