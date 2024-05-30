import React from 'react'
import { Metadata } from 'next'
import Main from './main'
import kIcons from '@/assets/k-icons/meta.json'

type Props = {}

const tabs = [
  {
    key: 'desc',
    label: '描述',
  },
  {
    key: 'svg-icons',
    label: `图标库(${kIcons.length})`,
  },
  {
    key: 'test',
    label: '测试',
  },
]

export const metadata: Metadata = {
  title: '工具栏',
  description: '提供常用工具',
}

export default function Tools({}: Props) {
  return (
    <div className='mt-10 flex-1 flex flex-col min-h-0'>
      <Main tabs={tabs} />
    </div>
  )
}
