import React from 'react'

import kIcons from '@/assets/k-icons/meta.json'
import Main from './_main'
import type { KIconProps } from './_SvgItem'
import './index.css'

// export const metadata: Metadata = {
//   title: 'svg-icons',
//   description: 'svg图标库',
// }

export default function SvgIcons() {
  return <Main icons={kIcons as KIconProps[]} />
}
