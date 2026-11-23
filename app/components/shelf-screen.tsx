import { MenuDock } from './menu-dock'
import { HintBar, TopBar } from './screen'
import { Shelf } from './shelf'
import type { ShelfItem } from '~/types'

/** ホーム画面の骨格：TopBar → 選択タイトル → Shelf → MenuDock → HintBar */
export function ShelfScreen({
  heading,
  active,
  items,
  offset,
  prev,
  next,
  empty,
}: {
  heading: string
  active: string
  items: ShelfItem[]
  offset: number
  prev?: string
  next?: string
  empty: string
}) {
  return (
    <div className='hs-screen'>
      <TopBar />
      <h1 className='sr-only'>{heading}</h1>
      <main className='flex flex-1 flex-col justify-center gap-[var(--space-4)] py-[var(--space-6)]'>
        {/* 棚を切り替えたら選択を先頭に戻す */}
        <Shelf key={`${active}-${offset}`} items={items} offset={offset} prev={prev} next={next} empty={empty} />
      </main>
      <div className='pb-[var(--space-4)]'>
        <MenuDock active={active} />
      </div>
      <HintBar />
    </div>
  )
}
