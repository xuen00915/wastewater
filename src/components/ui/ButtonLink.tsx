import type { AnchorHTMLAttributes, PropsWithChildren } from 'react'

type ButtonLinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: 'primary' | 'secondary' | 'light' }>

export function ButtonLink({ variant = 'primary', className = '', children, ...props }: ButtonLinkProps) {
  return <a className={`button-link button-link--${variant} ${className}`.trim()} {...props}>{children}</a>
}
