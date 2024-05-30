import { PropsWithChildren } from 'react'
import Header from '@/components/Header'

type Props = {}

export default function layout({ children }: PropsWithChildren<Props>) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
