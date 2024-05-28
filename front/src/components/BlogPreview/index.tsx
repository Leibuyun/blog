import React from 'react'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { Button } from '@mui/material'

type Props = {
  slug: string
  title: string
  ctime: string
  content: string
}

export default function BlogPreview({ slug, title, ctime, content }: Props) {
  return (
    <div className='p-7 mb-4 border card flex flex-col items-center gap-3'>
      <div className='text-gray-700 font-medium text-3xl my-4 text-center'>{title}</div>
      <div className='text-center text-sm text-gray-500 select-none'>{ctime}</div>
      <Markdown
        skipHtml={true}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        className='markdown-wrapper github-light-wrapper'
      >
        {content}
      </Markdown>
      <Button variant='contained' color='secondary' className='load-more-btn'>
        查看更多
      </Button>
    </div>
  )
}
