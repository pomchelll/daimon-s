import { createRequestHandler } from 'react-router'

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
    }
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default {
  fetch(request, env, ctx) {
    // www.daimon-s.party → daimon-s.party に統一
    const url = new URL(request.url)
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }
    return requestHandler(request, { cloudflare: { env, ctx } })
  },
} satisfies ExportedHandler<Env>
