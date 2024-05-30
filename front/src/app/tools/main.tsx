'use client'

import React, { useState } from 'react'
import { Tab, Tabs } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import SvgIcons from './svg-icons/page'

type BarItem = {
  key: string
  label: string
}

type Props = {
  tabs: BarItem[]
}

export default function ToolBar({ tabs }: Props) {
  const searchParams = useSearchParams()

  const [value, setValue] = useState<string>(() => {
    const value = searchParams.get('item')
    if (value && tabs.map((item) => item.key).includes(value)) {
      return value
    }
    return tabs[0].key
  })

  return (
    <>
      <Tabs
        value={value}
        onChange={(e, v) => {
          setValue(v)
          window.history.pushState(null, '', location.pathname + `?item=${v}`)
        }}
        aria-label='工具栏'
        className='mb-8'
      >
        {tabs.map((item) => (
          <Tab key={item.key} value={item.key} label={item.label} />
        ))}
      </Tabs>
      <div className='flex-1 flex flex-col mb-8'>
        {value === 'desc' && (
          <div>
            <div>❤🧡💛💚💙💜💜</div>
            <div>施工中...</div>
          </div>
        )}
        {value === 'svg-icons' && <SvgIcons />}
      </div>
    </>
  )
}
