import { Link } from 'react-router'
import { MenuDock } from '~/components/menu-dock'
import { HintBar, TopBar } from '~/components/screen'
import avatar from '~/image/daimon-avatar.webp'
import { pageMeta } from '~/lib/meta'
import { CATEGORIES, SITE } from '~/site'

import type { Route } from './+types/about'

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: 'プロフィール', path: '/about' })

export default function About() {
  return (
    <div className='hs-screen'>
      <TopBar back={{ to: '/', label: 'ホーム' }} />
      <main className='mx-auto grid w-full max-w-5xl flex-1 items-center gap-[var(--space-5)] px-[var(--gutter)] py-[var(--space-6)] md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]'>
        <div className='hs-cover hs-cover--square mx-auto w-full max-w-[22rem] bg-[var(--surface-raised)]'>
          <img src={avatar} alt={`${SITE.author}のアバター`} width={320} height={320} />
        </div>
        <div>
          <p className='t-caption text-[var(--ink-muted)]'>PROFILE</p>
          <h1 className='t-display mt-[var(--space-2)] text-[28px] sm:text-[34px]'>{SITE.author}</h1>
          <p className='t-title text-[var(--ink-muted)]'>{SITE.name}</p>
          <p className='t-body mt-[var(--space-4)] max-w-[40em]'>
            人間界のエイリアン植物こと、ダイモンです。部屋で育てている植物たち（ダイモンジャングル）のことや、仕事で学んだこと、日々のあれこれを書いています。
          </p>
          <ul className='mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]'>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/${c.slug}`} className='hs-chip' prefetch='intent'>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className='mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]'>
            <a href={SITE.x.url} target='_blank' rel='noopener noreferrer' className='hs-btn hs-btn--primary'>
              X（@{SITE.x.handle}）
            </a>
            <Link to='/' className='hs-btn'>
              記事をよむ
            </Link>
          </div>
        </div>
      </main>
      <div className='pb-[var(--space-4)]'>
        <MenuDock active='/about' />
      </div>
      <HintBar />
    </div>
  )
}
