import { useEffect, useState } from 'react'
import type { TocItem } from '~/lib/format'

export function Toc({ items, trackActive = false }: { items: TocItem[]; trackActive?: boolean }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!trackActive) return
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items, trackActive])

  return (
    <ol className='space-y-2 text-sm leading-snug'>
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
          <a
            href={`#${item.id}`}
            className={`block border-l-2 pl-3 hover:text-moss ${
              active === item.id ? 'border-signal font-bold text-ink' : 'border-transparent text-muted'
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  )
}
