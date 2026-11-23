/**
 * プロダクト作成・プロジェクトの中身（microCMS ではなく、ここで管理する）。
 *
 * 追加するときは WORKS に1件足すだけ。画像は public/works/ に置いて '/works/xxx.webp' と書く。
 *
 * 例：
 * {
 *   id: 'my-app',                 // URL になる（/products/my-app）
 *   section: 'products',          // 'products'（プロダクト作成） or 'projects'（プロジェクト）
 *   kind: 'web',                  // products のみ：'web'（Webプロダクト） or 'craft'（ものづくり）
 *   title: 'タイトル',
 *   description: 'ひとこと説明',
 *   date: '2026-11-23',
 *   image: '/works/my-app.webp',  // 任意
 *   url: 'https://example.com',   // 任意：公開先やリポジトリ
 *   body: '<p>本文（HTML）</p>',   // 任意
 * },
 */
export type Work = {
  id: string
  section: 'products' | 'projects'
  kind?: 'web' | 'craft'
  title: string
  description?: string
  date: string
  image?: string
  url?: string
  body?: string
}

export const WORKS: Work[] = []

/** タイルやチップに出すラベルと色 */
export function workStyle(w: Pick<Work, 'section' | 'kind'>) {
  if (w.section === 'projects') return { label: 'プロジェクト', color: 'rose' }
  if (w.kind === 'craft') return { label: 'ものづくり', color: 'yellow' }
  return { label: 'Webプロダクト', color: 'purple' }
}

export const worksIn = (section: Work['section']) =>
  WORKS.filter((w) => w.section === section).sort((a, b) => b.date.localeCompare(a.date))

export const findWork = (section: string, id: string) =>
  WORKS.find((w) => w.section === section && w.id === id)
