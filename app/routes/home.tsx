import { Link } from 'react-router'
import { PostList } from '~/components/post-list'
import { Profile } from '~/components/profile'
import { CACHE_HEADERS, pageMeta } from '~/lib/meta'
import { cms } from '~/lib/microcms.server'
import { CATEGORIES } from '~/site'

import type { Route } from './+types/home'

export const meta: Route.MetaFunction = () => pageMeta({ path: '/' })
export const headers = () => CACHE_HEADERS

export async function loader({ context }: Route.LoaderArgs) {
  const { contents, totalCount } = await cms(context.cloudflare.env).listBlogs({ limit: 10 })
  return { posts: contents, totalCount }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData
  return (
    <>
      <section className='mx-auto max-w-6xl overflow-hidden px-5 pt-14 pb-12 sm:px-8 sm:pt-20'>
        <h1 className='wordmark wordmark-hero' aria-label='DAIMON SHU'>
          <span aria-hidden>DAIMON</span>
          <span aria-hidden>SHU</span>
        </h1>
        <div className='mt-12 grid gap-10 sm:mt-16 md:grid-cols-[minmax(0,34rem)_1fr] md:gap-16'>
          <Profile />
          <div>
            <h2 className='text-sm font-bold text-muted'>書いていること</h2>
            <ul className='mt-3 space-y-3'>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/${c.slug}`}
                    prefetch='intent'
                    className='group block'
                  >
                    <span className='font-bold group-hover:text-moss group-hover:underline group-hover:underline-offset-4'>
                      {c.name}
                    </span>
                    <span className='ml-3 text-sm text-muted'>{c.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-5 sm:px-8' aria-labelledby='latest'>
        <h2 id='latest' className='mb-4 text-2xl font-bold'>
          最近の記事
        </h2>
        <PostList posts={posts} />
      </section>
    </>
  )
}
