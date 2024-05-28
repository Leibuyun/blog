import React from 'react'
import Markdown from 'react-markdown'
import Link from 'next/link'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

type Props = {
  slug: string
  title: string
  ctime: string
  content: string
  tags: string[]
}

export default function PreviewItem({ slug, title, ctime, content, tags }: Props) {
  return (
    <div className='p-7 mb-4 border card flex flex-col items-center gap-3'>
      <Link href={`/posts/${slug}`} className='text-gray-700 font-medium text-3xl my-4 text-center cursor-pointer'>
        {title}
      </Link>
      <div className='text-center text-sm text-gray-500 select-none'>{ctime}</div>
      <Markdown
        skipHtml={true}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        className='markdown-wrapper github-light-wrapper self-start'
      >
        {content}
      </Markdown>
      <Link href={`/posts/${slug}`} className='load-more-btn rounded-sm text-white'>
        查看更多
      </Link>
      {tags.length > 0 && (
        <div className='self-start flex items-center gap-3 flex-wrap'>
          {tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className='text-gray-600'>
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
