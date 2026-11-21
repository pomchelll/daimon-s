import avatar from '~/image/daimon-avatar.webp'
import { SITE } from '~/site'

export function Profile({ compact = false }: { compact?: boolean }) {
  return (
    <div className='flex items-start gap-4'>
      <img
        src={avatar}
        alt=''
        width={compact ? 56 : 72}
        height={compact ? 56 : 72}
        className='shrink-0 rounded-full bg-surface'
      />
      <div>
        <p className='font-bold'>{SITE.author}</p>
        <p className={`mt-1 text-muted ${compact ? 'text-sm' : ''}`}>
          人間界のエイリアン植物こと、ダイモンです。大好きな植物のことや、日々の学びを書いています。
        </p>
        <a
          href={SITE.x.url}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-2 inline-block text-sm font-medium text-moss underline underline-offset-4'
        >
          X（@{SITE.x.handle}）
        </a>
      </div>
    </div>
  )
}
