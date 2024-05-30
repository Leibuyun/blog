import React, { PropsWithChildren } from 'react'
import Image from 'next/image'
import NavBar from './NavBar'
import avatarPic from '@/assets/images/user.png'

type Props = {}

export default function Header({ children }: PropsWithChildren<Props>) {
  return (
    <div className='flex items-center justify-between px-4 py-2'>
      <div className='flex items-center gap-4'>
        <Image src={avatarPic} width={50} height={50} alt='me' className='rounded-full border' />
        {children}
      </div>
      <NavBar />
    </div>
  )
}
