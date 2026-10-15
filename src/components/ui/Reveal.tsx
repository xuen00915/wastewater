import { useEffect, useRef, useState, type PropsWithChildren } from 'react'

type RevealProps = PropsWithChildren<{ className?: string; delay?: number }>

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [prepared, setPrepared] = useState(false)
  const [visible, setVisible] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window))

  useEffect(() => {
    if (!('IntersectionObserver' in window) || !ref.current) {
      setVisible(true)
      return
    }
    setPrepared(true)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal${prepared ? ' reveal--prepared' : ''}${visible ? ' reveal--visible' : ''} ${className}`.trim()} style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  )
}
