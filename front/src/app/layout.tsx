import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import classNames from 'classnames'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './globals.css'
import '@/assets/css/github-light.css'
import '@/assets/css/markdown.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "lby's blog",
  description: 'record my life',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-CN'>
      <body
        className={classNames(inter.className, 'h-screen max-w-desktop flex flex-col overflow-hidden desktop:m-auto')}
      >
        {children}
      </body>
    </html>
  )
}
