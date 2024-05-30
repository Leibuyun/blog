'use client'

import { ReactNode, useCallback } from 'react'
import ReactDOMServer from 'react-dom/server'
import useAlert from '@/hooks/useAlert'
import { copyText } from '@/utils'

type Props = {
  node: ReactNode
}

function getNodeText(node: ReactNode) {
  if (typeof node === 'string') {
    return node
  }
  const htmlString = ReactDOMServer.renderToStaticMarkup(node as React.ReactElement)
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const textContent = doc.body.textContent || ''
  return textContent
}

export default function CopyBtn({ node }: Props) {
  const { showAlert } = useAlert()
  const handleCopy = useCallback(async () => {
    try {
      const text = getNodeText(node)
      await copyText(text)
      showAlert({ message: '复制成功', type: 'success', duration: 1000 })
      console.log('复制成功')
    } catch (err) {
      console.error('Could not copy text: ', err)
    }
  }, [node, showAlert])

  return (
    <div
      className='absolute top-0 right-0 bg-gray-800 text-white p-1 rounded-tr-sm cursor-pointer'
      onClick={handleCopy}
    >
      Copy
    </div>
  )
}
