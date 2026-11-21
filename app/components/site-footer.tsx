import { Link } from 'react-router'
import { SITE } from '~/site'

export function SiteFooter() {
  return (
    <footer className='mt-24 border-t border-line'>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted sm:px-8'>
        <Link to='/' className='wordmark text-ink'>
          {SITE.name}
        </Link>
        <p>&copy; {new Date().getFullYear()} Daimon Shu</p>
      </div>
    </footer>
  )
}
