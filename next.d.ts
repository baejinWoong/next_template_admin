import type { ReactElement, ReactNode } from 'react'
import type { NextPageContext } from 'next/dist/shared/lib/utils'

declare module 'next' {
  export declare type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getLayout?: (page: ReactElement) => ReactNode
    getInitialProps?: (context: NextPageContext) => IP | Promise<IP>
  }
}
