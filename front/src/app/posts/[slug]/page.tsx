import React from 'react'
import Image from 'next/image'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import MarkdownComponent from '@/components/common/Markdown'
import Summary from './summary'
import { getTree } from './util'
import IconDoc from '@/assets/images/doc-layout.svg'

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
    <div className='flex-1 mt-10 min-h-0'>
      <div className='flex gap-4 h-full'>
        <div className='flex flex-col'>
          <div className='gap-2 pl-2 py-3 bg-[#11999e] text-white flex items-center'>
            <Image
              src={IconDoc}
              width={20}
              height={20}
              alt='doc'
              style={{
                filter: 'invert(97%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(104%) contrast(104%);',
              }}
            />
            <span className='font-bold'>目录</span>
          </div>
          <div className='w-64 overflow-y-auto mb-6'>
            <Summary tree={tree} />
          </div>
        </div>
        <div className='flex-1 overflow-auto'>
          <MarkdownComponent content={content} />
        </div>
      </div>
    </div>
  )
}
