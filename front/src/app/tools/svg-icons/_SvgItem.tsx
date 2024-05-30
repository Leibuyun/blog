import React from 'react'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import { copyText, downloadFile } from '@/utils'
import useAlert from '@/hooks/useAlert'

export type KIconProps = {
  id: number
  name: string
  format: string
  description: string
  category: string
  tags: string[]
  categoryCN: string
  desc: string
  svg: string
  searchText?: string
}

type Props = {
  item: KIconProps
}

export default function SvgItem(props: Props) {
  const { item, ...other } = props
  const { showAlert } = useAlert()
  const handleCopy = async (text: string) => {
    try {
      await copyText(text)
      showAlert({ message: '复制成功', type: 'success', duration: 1000 })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div
      className='flex items-center justify-between gap-3 kicon-item cursor-pointer relative'
      onClick={() => handleCopy(item.svg)}
    >
      <div className='w-12 h-12 flex items-center'>
        <div
          className='svg-wrapper'
          dangerouslySetInnerHTML={{ __html: item.svg }}
          style={{
            margin: 8,
            width: 20,
            height: 20,
          }}
        ></div>
      </div>
      <div className='flex flex-col gap-2 flex-1'>
        <div className='text-sm'>{item.tags[0]}</div>
        <div className='text-gray-500 text-xs'>{item.name}</div>
      </div>
      <div
        className='absolute download-icon p-1 rounded hover:bg-gray-400'
        style={{ top: 2, right: 2 }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          downloadFile(new Blob([item.svg], { type: 'image/svg+xml' }), `${item.name}.svg`)
        }}
      >
        <DownloadOutlinedIcon width={16} height={16} />
      </div>
    </div>
  )
}
