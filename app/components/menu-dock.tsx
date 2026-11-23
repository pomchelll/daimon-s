import { Link } from 'react-router'
import { CATEGORIES } from '~/site'
import { Icon, type IconName } from './icons'

const ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'すべての記事', icon: 'all' },
  ...CATEGORIES.map((c) => ({ to: `/${c.slug}`, label: c.name, icon: c.slug as IconName })),
  { to: '/about', label: 'プロフィール', icon: 'profile' },
]

export function MenuDock({ active }: { active: string }) {
  const current = ITEMS.find((i) => i.to === active)
  return (
    <div className='hs-dock-wrap'>
      <nav className='hs-dock' aria-label='メニュー'>
        {ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            prefetch='intent'
            className='hs-dock-btn'
            aria-label={item.label}
            title={item.label}
            aria-current={item.to === active ? 'page' : undefined}
          >
            <Icon name={item.icon} />
          </Link>
        ))}
      </nav>
      <div className='hs-dock-label' aria-hidden>
        {current?.label}
      </div>
    </div>
  )
}
