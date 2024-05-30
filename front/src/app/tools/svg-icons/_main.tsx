'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
// import { Tooltip } from 'react-tooltip'
import { TextField, Tooltip } from '@mui/material'
import SvgItem from './_SvgItem'
import type { KIconProps } from './_SvgItem'

type Props = {
  icons: KIconProps[]
}

const gridComponents = {
  // eslint-disable-next-line react/display-name
  List: forwardRef(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className='grid svg-list-container gap-5 p-5'
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  )),
  // eslint-disable-next-line react/display-name
  Item: React.forwardRef(({ children, ...props }, ref) => <div {...props}>{children}</div>),
}

export default function Main({ icons }: Props) {
  const [items, setItems] = useState(icons)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (searchText.length > 0) {
      setItems((pre) => pre.filter((item) => item.searchText?.includes(searchText) || item.name.includes(searchText)))
    } else {
      setItems(icons)
    }
  }, [icons, searchText])

  return (
    <>
      <TextField
        id='search-icons'
        label='搜索'
        variant='outlined'
        value={searchText}
        className='w-full mb-5'
        onChange={(e) => setSearchText(e.target.value.trim())}
      />
      <div className='flex-1 overflow-auto'>
        <VirtuosoGrid
          totalCount={items.length}
          components={gridComponents}
          itemContent={(index) => (
            <Tooltip title={items[index].desc}>
              <div>
                <SvgItem item={items[index]} key={items[index].id} />
              </div>
            </Tooltip>
          )}
        />
      </div>
    </>
  )
}
