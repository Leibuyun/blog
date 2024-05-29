import React from 'react'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import MarkdownComponent from '@/components/common/Markdown'
import Summary from './summary'
import { getTree } from './util'

type Props = {
  params: {
    slug: string
    content: string
  }
}

export const dynamic = 'error'
export const dynamicParams = false

export async function generateStaticParams() {
  const fileList = await fs.promises.readdir(path.join(process.cwd(), 'posts'))
  return fileList.map((name) => ({
    slug: name.replace(/\.md$/, ''),
  }))
}

async function getPostData(slug: string) {
  const postMetaData = await fs.promises.readFile(path.join(process.cwd(), 'posts', `${slug}.md`), 'utf-8')
  const { data, content } = matter(postMetaData)
  return { data, content }
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = params
  const { data, content } = await getPostData(slug)
  const tree = await getTree(content)

  return (
    <div className='flex-1 overflow-auto mt-10'>
      <div className='flex gap-4'>
        <div className='w-64'>
          <Summary tree={tree} />
        </div>
        <div className='flex-1'>
          <MarkdownComponent content={content} />
        </div>
      </div>
    </div>
  )
}
