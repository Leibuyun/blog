'use client'

import { useState } from 'react'
import { Pagination } from '@mui/material'
import BlogPreview from './Item'

export interface IPostItem {
  data: IPostMeta
  content: string
  slug: string
}

export default function PostPreviewList({ posts }: { posts: IPostItem[] }) {
  const [viewPosts, setViewPosts] = useState<IPostItem[]>(posts.slice(0, 10))

  return (
    <>
      <div className='blog-list'>
        {viewPosts.map(({ data, content, slug }) => (
          <BlogPreview key={data.ctime} slug={slug} {...data} content={content} />
        ))}
      </div>
      <Pagination
        count={Math.ceil(posts.length / 10)}
        color='primary'
        classes={{ ul: 'justify-center' }}
        onChange={(_, page) => setViewPosts(posts.slice((page - 1) * 10, page * 10))}
      />
    </>
  )
}
