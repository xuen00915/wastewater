export type IconName = 'water' | 'treatment' | 'recovery' | 'leaf' | 'building' | 'solids' | 'flask' | 'industry' | 'site' | 'arrow'

type IconProps = { name: IconName; className?: string; size?: number }

const paths: Record<IconName, React.ReactNode> = {
  water: <path d="M12 2.8S5.5 10 5.5 15.1a6.5 6.5 0 0 0 13 0C18.5 10 12 2.8 12 2.8Z" />,
  treatment: <><circle cx="12" cy="12" r="3.4" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" /></>,
  recovery: <><path d="M7.2 7.4A7 7 0 0 1 19 11" /><path d="m18.6 6.6.5 4.8-4.8-.4M16.8 16.6A7 7 0 0 1 5 13" /><path d="m5.4 17.4-.5-4.8 4.8.4" /></>,
  leaf: <><path d="M19.5 4.5C12 4.5 6 8.3 6 14.2c0 2.9 2.2 5.3 5 5.3 5.8 0 8.5-6.7 8.5-15Z" /><path d="M4.5 21c2-5.6 5.8-9.5 11.5-12" /></>,
  building: <><path d="M4 21V9l7-4v16M11 21V3l9 4v14M2 21h20" /><path d="M7 12h1M7 16h1M15 9h1M15 13h1M15 17h1" /></>,
  solids: <><path d="m5 9 7-4 7 4-7 4-7-4Z" /><path d="m5 13 7 4 7-4M5 17l7 4 7-4" /></>,
  flask: <><path d="M9 3h6M10 3v5l-5 9a2.5 2.5 0 0 0 2.2 3.7h9.6A2.5 2.5 0 0 0 19 17l-5-9V3" /><path d="M7.5 15h9" /></>,
  industry: <><path d="M3 21V9l6 3V8l6 4V5h6v16H3Z" /><path d="M7 16h1M12 16h1M17 16h1" /></>,
  site: <><path d="M4 21V7h10v14M14 12h6v9M2 21h20" /><path d="M8 11h2M8 15h2M8 19h2M17 16h1" /></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
}

export function Icon({ name, className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
