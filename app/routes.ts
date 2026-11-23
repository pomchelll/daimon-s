import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('robots.txt', 'routes/robots.ts'),
  route('sitemap.xml', 'routes/sitemap.ts'),
  route('about', 'routes/about.tsx'),
  route(':categorySlug', 'routes/category.tsx'),
  route(':categorySlug/:contentId', 'routes/article.tsx'),
] satisfies RouteConfig
