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
import { HintBar, TopBar } from './components/screen'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap',
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
      <body>
        {children}
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
    <div className='hs-screen'>
      <TopBar back={{ to: '/', label: 'ホーム' }} />
      <main className='mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-[var(--gutter)] py-[var(--space-6)]'>
        <p className='t-caption text-[var(--ink-muted)]'>{notFound ? '404' : 'ERROR'}</p>
        <h1 className='t-display mt-[var(--space-2)] text-[26px] sm:text-[34px]'>
          {notFound ? 'ページが見つかりません' : 'ページをひらけませんでした'}
        </h1>
        <p className='t-body mt-[var(--space-3)] text-[var(--ink-muted)]'>
          {notFound
            ? 'URLが変わったか、記事が削除されたのかもしれません。'
            : '時間をおいて、もう一度ひらいてみてください。'}
        </p>
        {detail && (
          <pre className='mt-[var(--space-4)] overflow-x-auto rounded-[var(--radius-tile)] bg-[var(--surface-raised)] p-[var(--space-3)] text-sm'>
            {detail}
          </pre>
        )}
        <div className='mt-[var(--space-5)]'>
          <Link to='/' className='hs-btn hs-btn--primary'>
            ホームへもどる
          </Link>
        </div>
      </main>
      <HintBar />
    </div>
  )
}
