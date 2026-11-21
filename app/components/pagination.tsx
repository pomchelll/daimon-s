import { Link } from 'react-router'

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  const href = (p: number) => (p === 1 ? '?' : `?page=${p}`)
  return (
    <nav aria-label='ページ送り' className='mt-10 flex items-center justify-between text-sm'>
      {page > 1 ? (
        <Link to={href(page - 1)} className='font-bold text-moss underline underline-offset-4'>
          新しい記事
        </Link>
      ) : (
        <span />
      )}
      <span className='text-muted'>
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link to={href(page + 1)} className='font-bold text-moss underline underline-offset-4'>
          古い記事
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
