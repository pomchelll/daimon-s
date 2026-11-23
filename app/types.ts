import type { MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk'

export type Category = MicroCMSListContent & {
  name: string
  slug: string
}

export type Tag = MicroCMSListContent & {
  name: string
}

export type Blog = MicroCMSListContent & {
  title: string
  description?: string
  content: string
  eyecatch?: MicroCMSImage
  category: Category
  tags?: Tag[]
  ogp?: MicroCMSImage
}

export type BlogSummary = Omit<Blog, 'content'>

/** 棚に並べる1冊（ブログ記事・プロダクト・プロジェクト共通） */
export type ShelfItem = {
  key: string
  href: string
  title: string
  date: string
  label: string
  color: string
  image?: string
}
