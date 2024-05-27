'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes } from './router'
import classNames from 'classnames'

export default function NavBar() {
  const pathname = usePathname()
  return (
    <nav className='flex items-center gap-10 pr-4'>
      {routes.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={classNames(
            'duration-200 transform rounded-md select-none font-sans',
            pathname === item.path ? 'text-blue-600' : 'hover:text-blue-600'
          )}
        >
          {item.text}
        </Link>
      ))}
    </nav>
  )
}
