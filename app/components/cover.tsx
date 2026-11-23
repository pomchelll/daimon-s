import { imgUrl } from '~/lib/format'
import { LIGHT_TILES } from '~/site'

/** 詳細画面の大きなカバー。画像がなければタイルと同じ地色で */
export function Cover({
  image,
  color,
  caption,
  square = false,
  raw = false,
}: {
  image?: { url: string; width?: number; height?: number }
  color: string
  caption?: string
  square?: boolean
  /** true なら microCMS のリサイズ指定を付けない（public/ の画像用） */
  raw?: boolean
}) {
  if (image) {
    return (
      <div className={`hs-cover ${square ? 'hs-cover--square' : ''} bg-[var(--surface-raised)]`}>
        <img src={raw ? image.url : imgUrl(image.url, 1200)} alt='' width={image.width} height={image.height} />
      </div>
    )
  }
  return (
    <div
      className={`hs-cover hs-tile--${color} ${LIGHT_TILES.has(color) ? 'hs-tile--light' : ''} ${
        square ? 'hs-cover--square' : ''
      }`}
      aria-hidden
    >
      <span className='hs-tile__deco' />
      {caption && <span className='hs-tile__cat absolute bottom-5 left-6'>{caption}</span>}
    </div>
  )
}
