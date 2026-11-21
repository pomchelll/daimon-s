const fmt = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export const formatDate = (iso?: string) => (iso ? fmt.format(new Date(iso)) : '')

/** microCMS の画像URLにリサイズ・WebP変換のパラメータを付ける */
export const imgUrl = (url: string, w: number) =>
  `${url}?w=${w}&fm=webp&q=80`

export type TocItem = { id: string; text: string; level: 2 | 3 }

/**
 * 本文HTMLの h2/h3 から目次を作り、id のない見出しには id を振る。
 * サーバー側で行うので、JSなしでも目次リンクが機能する。
 */
export function buildToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  let n = 0
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (_m, level: string, attrs: string, inner: string) => {
      const idMatch = attrs.match(/\sid="([^"]+)"/)
      const id = idMatch ? idMatch[1] : `section-${++n}`
      const text = inner.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
      if (text) toc.push({ id, text, level: Number(level) as 2 | 3 })
      const newAttrs = idMatch ? attrs : `${attrs} id="${id}"`
      return `<h${level}${newAttrs}>${inner}</h${level}>`
    },
  )
  return { html: out, toc }
}
