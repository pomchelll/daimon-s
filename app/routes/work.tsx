import { Link } from 'react-router'
import { Cover } from '~/components/cover'
import { HintBar, TopBar } from '~/components/screen'
import { formatDate } from '~/lib/format'
import { CACHE_HEADERS, pageMeta } from '~/lib/meta'
import { findSection } from '~/site'
import { findWork, workStyle } from '~/works'

import type { Route } from './+types/work'

export const headers = () => CACHE_HEADERS

export function loader({ params, request }: Route.LoaderArgs) {
  const sectionSlug = new URL(request.url).pathname.split('/')[1]
  const work = findWork(sectionSlug, params.workId)
  const section = findSection(sectionSlug)
  if (!work || !section) throw new Response('Not Found', { status: 404 })
  return { work, section: { slug: section.slug, name: section.name } }
}

export const meta: Route.MetaFunction = ({ data }) =>
  data
    ? pageMeta({
        title: data.work.title,
        description: data.work.description,
        path: `/${data.work.section}/${data.work.id}`,
        image: data.work.image,
        type: 'article',
      })
    : []

export default function WorkPage({ loaderData }: Route.ComponentProps) {
  const { work, section } = loaderData
  const { label, color } = workStyle(work)

  return (
    <div className='hs-screen'>
      <TopBar back={{ to: `/${section.slug}`, label: 'ホーム' }} />

      <main className='mx-auto w-full max-w-6xl flex-1 px-[var(--gutter)] pt-[var(--space-6)] pb-[var(--space-6)]'>
        <header className='grid items-center gap-[var(--space-5)] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]'>
          <Cover image={work.image ? { url: work.image } : undefined} color={color} caption={label} raw />
          <div>
            <div className='flex flex-wrap gap-[var(--space-2)]'>
              <Link to={`/${section.slug}`} className='hs-chip' prefetch='intent'>
                {section.name}
              </Link>
              {label !== section.name && <span className='hs-chip'>{label}</span>}
              <span className='hs-chip'>
                <time dateTime={work.date}>{formatDate(work.date)}</time>
              </span>
            </div>
            <h1 className='t-display mt-[var(--space-4)] text-[26px] sm:text-[34px]'>{work.title}</h1>
            {work.description && (
              <p className='t-body mt-[var(--space-3)] text-[var(--ink-muted)]'>{work.description}</p>
            )}
            {work.url && (
              <a href={work.url} className='hs-btn hs-btn--primary mt-[var(--space-4)]' target='_blank' rel='noreferrer'>
                ひらく
              </a>
            )}
          </div>
        </header>

        {work.body && (
          <div className='article mt-[var(--space-6)] max-w-[42rem]' dangerouslySetInnerHTML={{ __html: work.body }} />
        )}
      </main>

      <HintBar />
    </div>
  )
}
