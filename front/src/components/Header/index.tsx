import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import avatarPic from '@/assets/images/user.png'
import { TextField } from '@mui/material'
import { routes } from './router'

type Props = {}

export default function Header({}: Props) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <Image src={avatarPic} width={50} height={50} alt='me' className='rounded-full border' />
        <TextField label='搜索标题' variant='outlined' size='small' className='ml-3' />
      </div>
      <nav className='flex items-center gap-10'>
        {routes.map((item) => (
          <Link key={item.path} href={item.path}>
            {item.text}
          </Link>
        ))}
      </nav>
    </div>
  )
}
