'use client'

import React, { useEffect } from 'react'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view'

type ITreeProps = {
  label: string
  targetId: string
  parent?: ITreeProps
  children?: ITreeProps[]
}

type Props = {
  tree: ITreeProps[]
}

function renderTree(item: ITreeProps) {
  const handleAnchorClick = () => {
    document.getElementById(item.targetId)?.scrollIntoView()
    // 替换url
    window.history.pushState(null, '', `#${item.targetId}`)
  }

  return (
    <TreeItem
      onClick={handleAnchorClick}
      itemId={item.targetId}
      label={item.label}
      // label={
      //   <a href={`#${item.targetId}`} className='inline-block w-full'>
      //     {item.label}
      //   </a>
      // }
      key={item.targetId}
    >
      {item.children?.map((child: any) => renderTree(child))}
    </TreeItem>
  )
}

export default function Summary({ tree }: Props) {
  useEffect(() => {
    const handleHashChange = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      document.getElementById(id)?.scrollIntoView()
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return <SimpleTreeView className='bg-[#f3f6f6]'>{tree.map((item) => renderTree(item))}</SimpleTreeView>
}
