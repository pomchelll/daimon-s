import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import avatar from '~/image/daimon-avatar.webp'
import { SITE } from '~/site'
import { Icon } from './icons'

/** トップバー右の時刻（日本時間）。サーバーでは描かず、ブラウザで埋める */
function Clock() {
  const [now, setNow] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit',
    })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className='hs-status' aria-hidden>
      <span>{now ?? '\u00a0'}</span>
    </div>
  )
}

/** ホームではアバター、詳細では「← ホーム」 */
export function TopBar({ back }: { back?: { to: string; label: string } }) {
  return (
    <header className='hs-topbar'>
      {back ? (
        <Link to={back.to} className='hs-btn' prefetch='intent'>
          <Icon name='back' size={18} />
          {back.label}
        </Link>
      ) : (
        <Link to='/about' className='hs-avatar' aria-label='プロフィールをひらく' prefetch='intent'>
          <img src={avatar} alt='' width={48} height={48} />
        </Link>
      )}
      <Clock />
    </header>
  )
}

export function HintBar({ children }: { children?: React.ReactNode }) {
  return (
    <footer className='hs-hintbar'>
      <span>
        <Link to='/' className='font-bold text-ink'>
          {SITE.name}
        </Link>
        <span className='hidden sm:inline'>　ダイモン シュウの個人サイト</span>
      </span>
      {children && <span className='flex items-center gap-[22px]'>{children}</span>}
    </footer>
  )
}
