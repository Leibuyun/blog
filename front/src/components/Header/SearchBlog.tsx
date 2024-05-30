'use client'

import React, { useEffect, useState } from 'react'
import { Button, Modal, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/navigation'
import type { IPostItem } from '../PostPreviewList'

type Props = {
  posts: IPostItem[]
}

export default function SearchBlog({ posts }: Props) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState(posts.slice(0, 10))

  useEffect(() => {
    if (searchText.trim().length > 0) {
      setResults(posts.filter((item) => item.data.title.includes(searchText)))
    } else {
      setResults(posts.slice(0, 10))
    }
  }, [searchText, posts])

  return (
    <>
      <Button
        variant='contained'
        startIcon={<SearchIcon />}
        size='medium'
        style={{ backgroundColor: '#1565c0' }}
        onClick={() => setVisible(true)}
      >
        搜索博客
      </Button>
      <Modal open={visible} onClose={() => setVisible(false)}>
        <div className='max-w-2xl m-auto mt-80 h-1/2 rounded-3xl border bg-white p-6'>
          <TextField
            id='search-post'
            label='搜索博客'
            variant='standard'
            className='w-full'
            onChange={(e) => setSearchText(e.target.value.trim())}
          />
          <div className='flex flex-col gap-2 p-3'>
            {results.map(({ data, slug }) => (
              <div
                key={data.ctime}
                className='flex items-center bg-[#fbfcfc] h-16 px-3 cursor-pointer rounded-xl border-[#f1f3f5] hover:text-[#66b3ff] hover:border-blue-600 border'
                onClick={() => router.push(`/posts/${slug}`)}
              >
                <svg width='20' height='20' viewBox='0 0 20 20'>
                  <g
                    stroke='currentColor'
                    fill='none'
                    fill-rule='evenodd'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  >
                    <path d='M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0'></path>
                    <path d='M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13'></path>
                  </g>
                </svg>
                <div className='ml-4'>{data.title}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
