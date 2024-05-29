import React, { PropsWithChildren, ReactNode } from 'react'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import CopyBtn from './CopyBtn'

type Props = {
  content: string
}

type CopyCodeProps = {
  className: string
  node: ReactNode
}

function CopyCode({ className, children, node }: PropsWithChildren<CopyCodeProps>) {
  return (
    <div className='relative'>
      <code className={className}>{children}</code>
      <CopyBtn node={node} />
    </div>
  )
}

export default function MarkdownComponent({ content }: Props) {
  return (
    <Markdown
      skipHtml={true}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeSlug]}
      components={{
        code({ className = '', children, ...props }) {
          const isHighlight = className.includes('hljs')
          return isHighlight ? (
            <CopyCode className={className} node={children}>
              {children}
            </CopyCode>
          ) : (
            <code className={className}>{children}</code>
          )
        },
      }}
      className='markdown-wrapper github-light-wrapper'
    >
      {content}
    </Markdown>
  )
}
