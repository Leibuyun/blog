import React from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import NavBar from './NavBar'
import avatarPic from '@/assets/images/user.png'

type Props = {}

export default function Header({}: Props) {
  return (
    <div className='flex items-center justify-between px-4 py-2'>
      <div className='flex items-center gap-4'>
        <Image src={avatarPic} width={50} height={50} alt='me' className='rounded-full border' />
        {/* <TextField label='搜索标题' variant='outlined' size='small' /> */}
      </div>
      <NavBar />
    </div>
  )
}
