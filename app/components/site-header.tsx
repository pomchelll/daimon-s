import { Link, NavLink } from 'react-router'
import { CATEGORIES, SITE } from '~/site'

export function SiteHeader() {
  return (
    <header className='border-b border-line'>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-4 sm:px-8'>
        <Link to='/' className='wordmark text-lg tracking-tight' aria-label={`${SITE.name} トップページ`}>
          {SITE.name}
        </Link>
        <nav aria-label='カテゴリ'>
          <ul className='-mx-2 flex flex-wrap text-sm font-medium'>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <NavLink
                  to={`/${c.slug}`}
                  prefetch='intent'
                  className={({ isActive }) =>
                    `block px-2 py-1 underline-offset-[6px] decoration-2 hover:underline ${
                      isActive ? 'text-moss underline decoration-signal' : ''
                    }`
                  }
                >
                  {c.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
