export const SITE = {
  name: 'DAIMON SHU',
  url: 'https://daimon-s.party',
  author: 'ダイモン シュウ',
  description:
    'ダイモン シュウの個人サイト。植物のこと、仕事での学び、日々のことを書いています。',
  x: { handle: 'donalddshu1', url: 'https://x.com/donalddshu1' },
}

// microCMS のカテゴリID と URL スラッグの対応
export const CATEGORIES = [
  {
    id: 'n-qv82qvl',
    name: '学びの記録',
    description: '仕事や日常で役立つTips',
    slug: 'learning',
    tiles: ['blue'],
  },
  {
    id: 'ws9xx-twte',
    name: '植物手帖',
    description: 'ダイモンジャングルの植物を紹介',
    slug: 'plants',
    tiles: ['green'],
  },
  {
    id: 'cgxkplli7x',
    name: '日々のあれこれ',
    description: '誰に向けるわけでもなく、日々のことを呟きます',
    slug: 'dairy',
    tiles: ['orange'],
  },
] as const

export type CategoryDef = (typeof CATEGORIES)[number]

export const findCategory = (slug: string | undefined) =>
  CATEGORIES.find((c) => c.slug === slug)

/** 1つの棚に並べる記事数（超えたら「つづき」タイルで次ページへ） */
export const PER_SHELF = 40

/** 明るい地のタイル（文字は tile-on-light） */
export const LIGHT_TILES = new Set(['orange', 'yellow', 'sand'])
