import { Link } from 'react-router'
import { formatDate, imgUrl } from '~/lib/format'
import { findCategory } from '~/site'
import type { BlogSummary } from '~/types'

export function PostList({
  posts,
  showCategory = true,
}: {
  posts: BlogSummary[]
  showCategory?: boolean
}) {
  if (posts.length === 0) {
    return (
      <p className='border-t border-line py-10 text-muted'>
        まだ記事がありません。microCMSで記事を公開するとここに表示されます。
      </p>
    )
  }

  return (
    <ol className='border-t border-line'>
      {posts.map((post) => {
        const cat = findCategory(post.category?.slug)
        return (
          <li key={post.id} className='border-b border-line'>
            <Link
              to={`/${post.category.slug}/${post.id}`}
              prefetch='intent'
              className='group grid grid-cols-[1fr_auto] gap-x-5 gap-y-1 py-6 sm:grid-cols-[7.5rem_1fr_auto] sm:gap-x-8'
            >
              <div className='col-span-2 flex gap-3 text-sm text-muted sm:col-span-1 sm:flex-col sm:gap-1'>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                {showCategory && <span>{cat?.name ?? post.category.name}</span>}
              </div>
              <div className='min-w-0'>
                <h3 className='text-lg leading-snug font-bold group-hover:text-moss group-hover:underline group-hover:underline-offset-4 sm:text-xl'>
                  {post.title}
                </h3>
                {post.description && (
                  <p className='mt-2 line-clamp-2 text-sm text-muted'>{post.description}</p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <ul className='mt-2 flex flex-wrap gap-x-3 text-xs text-muted'>
                    {post.tags.map((t) => (
                      <li key={t.id}>#{t.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              {post.eyecatch ? (
                <img
                  src={imgUrl(post.eyecatch.url, 320)}
                  alt=''
                  width={160}
                  height={100}
                  loading='lazy'
                  className='h-[72px] w-[112px] rounded object-cover sm:h-[100px] sm:w-[160px]'
                />
              ) : (
                <span />
              )}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
