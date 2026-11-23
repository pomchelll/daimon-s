import { createClient } from 'microcms-js-sdk'
import type { Blog, BlogSummary } from '~/types'

const LIST_FIELDS = [
  'id',
  'title',
  'description',
  'eyecatch',
  'category',
  'tags',
  'publishedAt',
  'revisedAt',
  'createdAt',
  'updatedAt',
]

export function cms(env: Env) {
  if (!env.MICROCMS_SERVICE_DOMAIN || !env.MICROCMS_API_KEY) {
    throw new Error(
      'MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が設定されていません。ローカルでは .dev.vars、本番では Cloudflare の Variables and Secrets に登録してください。',
    )
  }
  const client = createClient({
    serviceDomain: env.MICROCMS_SERVICE_DOMAIN,
    apiKey: env.MICROCMS_API_KEY,
  })

  return {
    async listBlogs(opts: { offset: number; limit: number }) {
      return client.getList<BlogSummary>({
        endpoint: 'blogs',
        queries: {
          orders: '-publishedAt',
          limit: opts.limit,
          offset: Math.max(0, opts.offset),
          fields: LIST_FIELDS,
        },
      })
    },

    async getBlog(id: string) {
      try {
        return await client.get<Blog>({ endpoint: 'blogs', contentId: id })
      } catch (e) {
        if (e instanceof Error && e.message.includes('status: 404')) return null
        throw e
      }
    },

    async allBlogsForSitemap() {
      return client.getAllContents<Pick<Blog, 'id' | 'revisedAt' | 'category'>>({
        endpoint: 'blogs',
        queries: { fields: ['id', 'revisedAt', 'category.slug'] },
      })
    },
  }
}
