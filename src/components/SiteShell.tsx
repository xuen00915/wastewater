import type { PropsWithChildren } from 'react'
import type { PageId } from '../site'
import { Footer } from './Footer'
import { Header } from './Header'

type SiteShellProps = PropsWithChildren<{ currentPage: PageId }>

export function SiteShell({ currentPage, children }: SiteShellProps) {
  return (
    <>
      <div className="page-top-sentinel" aria-hidden="true" />
      <Header currentPage={currentPage} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
