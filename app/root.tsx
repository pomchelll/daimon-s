import { useEffect } from 'react'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useRouteLoaderData,
} from 'react-router'

import type { Route } from './+types/root'
import './app.css'
import { SiteFooter } from './components/site-footer'
import { SiteHeader } from './components/site-header'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap',
  },
]

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env
  return { gaId: env.GA_TRACKING_ID || null }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  const gaId = data?.gaId
  const location = useLocation()

  useEffect(() => {
    if (gaId && window.gtag) {
      window.gtag('config', gaId, { page_path: location.pathname })
    }
  }, [gaId, location.pathname])

  return (
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body className='flex min-h-dvh flex-col'>
        <SiteHeader />
        <main className='flex-1'>{children}</main>
        <SiteFooter />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  let detail: string | undefined
  if (import.meta.env.DEV && error instanceof Error) detail = error.message

  return (
    <div className='mx-auto max-w-3xl px-5 py-20 sm:px-8'>
      <p className='wordmark text-6xl text-moss sm:text-8xl'>{notFound ? '404' : 'Error'}</p>
      <h1 className='mt-8 text-xl font-bold'>
        {notFound ? 'ページが見つかりません' : 'ページを表示できませんでした'}
      </h1>
      <p className='mt-3 text-muted'>
        {notFound
          ? 'URLが変わったか、記事が削除された可能性があります。'
          : '時間をおいて再読み込みしてください。'}
      </p>
      {detail && (
        <pre className='mt-6 overflow-x-auto rounded bg-surface p-4 text-sm'>{detail}</pre>
      )}
      <Link to='/' className='mt-8 inline-block font-bold text-moss underline underline-offset-4'>
        トップページへ戻る
      </Link>
    </div>
  )
}
