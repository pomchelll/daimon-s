import { ShelfScreen } from '~/components/shelf-screen'
import { CACHE_HEADERS, pageMeta } from '~/lib/meta'
import { loadShelf } from '~/lib/shelf.server'
import { SITE } from '~/site'

import type { Route } from './+types/home'

export const meta: Route.MetaFunction = () => pageMeta({ path: '/' })
export const headers = () => CACHE_HEADERS

export async function loader({ context, request }: Route.LoaderArgs) {
  return loadShelf(context.cloudflare.env, request)
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <ShelfScreen
      heading={`${SITE.name}｜ダイモン シュウの個人サイト`}
      active='/'
      {...loaderData}
    />
  )
}
