import React from 'react'
import Markdown from 'react-markdown'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

type Props = {
  params: {
    slug: string
    content: string
  }
}

// export const dynamic = 'force-dynamic'
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
  return (
    <div className='flex-1 overflow-auto mt-10'>
      <Markdown
        skipHtml={true}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        className='markdown-wrapper github-light-wrapper'
      >
        {content}
      </Markdown>
    </div>
  )
}
