export const SITE = {
  name: 'DAIMON SHU',
  url: 'https://daimon-s.party',
  author: 'ダイモン シュウ',
  description:
    'ダイモン シュウの個人サイト。植物のこと、仕事での学び、日々のことを書いています。',
  x: { handle: 'donalddshu1', url: 'https://x.com/donalddshu1' },
}

/**
 * microCMS のカテゴリ（記事URLの /{slug}/{id} に使う）。
 * 表示上はすべて「ブログ」にまとめ、色だけカテゴリごとに変える。
 */
export const BLOG_CATEGORIES = [
  { id: 'n-qv82qvl', slug: 'learning', color: 'blue' },
  { id: 'ws9xx-twte', slug: 'plants', color: 'green' },
  { id: 'cgxkplli7x', slug: 'dairy', color: 'orange' },
] as const

export const findBlogCategory = (slug: string | undefined) =>
  BLOG_CATEGORIES.find((c) => c.slug === slug)

/** メニューに並ぶ棚。blog は microCMS、products / projects は app/works.ts */
export const SECTIONS = [
  {
    slug: 'blog',
    name: 'ブログ',
    description: '学んだこと、植物のこと、日々のあれこれ',
    empty: 'まだ記事がありません。microCMS で記事を公開すると、ここに並びます。',
  },
  {
    slug: 'products',
    name: 'プロダクト作成',
    description: 'Webサービスから、手で触れるものづくりまで',
    empty: 'プロダクトを準備中です。',
  },
  {
    slug: 'projects',
    name: 'プロジェクト',
    description: '取り組んできたプロジェクト',
    empty: 'プロジェクトを準備中です。',
  },
] as const

export type SectionSlug = (typeof SECTIONS)[number]['slug']

export const findSection = (slug: string | undefined) =>
  SECTIONS.find((s) => s.slug === slug)

/** 1つの棚に並べる記事数（超えたら「つづき」タイルで次ページへ） */
export const PER_SHELF = 40

/** 明るい地のタイル（文字は tile-on-light） */
export const LIGHT_TILES = new Set(['orange', 'yellow', 'sand'])
