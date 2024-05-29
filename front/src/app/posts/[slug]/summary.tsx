'use client'

import React, { useEffect } from 'react'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view'

type ITreeProps = {
  label: string
  targetId: string
  children?: ITreeProps[]
}

type Props = {
  tree: ITreeProps[]
}

function renderTree(item: ITreeProps) {
  return (
    <TreeItem itemId={item.targetId} label={item.label} key={item.targetId}>
      {item.children?.map((child) => renderTree(child))}
    </TreeItem>
  )
}

export default function Summary({ tree }: Props) {
  useEffect(() => {
    console.log(tree)
  }, [tree])

  return <SimpleTreeView>{tree.map((item) => renderTree(item))}</SimpleTreeView>
}
