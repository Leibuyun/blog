import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import PostList, { type IPostItem } from '@/components/PostPreviewList'

async function getPosts() {
  const fileList = await fs.promises.readdir(path.join(process.cwd(), 'posts'))
  const blogList: IPostItem[] = []
  for (const fileName of fileList) {
    const absPath = path.join(process.cwd(), `posts/${fileName}`)
    const stat = await fs.promises.stat(absPath)
    if (stat.isDirectory()) continue
    const metaData = await fs.promises.readFile(absPath, 'utf-8')
    const { data, content } = matter(metaData)
    const idx = content.indexOf('<!-- more -->')
    blogList.push({
      data,
      slug: fileName.replace(/\.md$/, ''),
      content: idx === -1 ? content : content.slice(0, idx),
    } as any)
  }

  return blogList.sort((a, b) => new Date(b.data.ctime).getTime() - new Date(a.data.ctime).getTime())
}

export default async function Home() {
  const posts = await getPosts()
  return (
    <main className='flex-1 overflow-auto mt-10 pb-10'>
      <div className='px-6'>
        <PostList posts={posts} />
      </div>
    </main>
  )
}
