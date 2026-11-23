// 24px・線幅1.8・角丸の線画（Home Shelf UI のアイコン規定）
const paths = {
  all: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  blog: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5V5.5M20 18v3H6.5M8.5 7.5h7',
  products: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5l8-4.5M12 12v9',
  projects: 'M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z',
  profile: 'M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  x: 'M4 4l16 16M20 4L4 20',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg
      viewBox='0 0 24 24'
      width={size}
      height={size}
      aria-hidden
      fill='none'
      stroke='currentColor'
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d={paths[name]} />
    </svg>
  )
}
