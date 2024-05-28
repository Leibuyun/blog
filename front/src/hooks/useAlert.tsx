import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Alert } from '@mui/material'

interface IProps {
  type: 'success' | 'info' | 'error' | 'warning'
  message: ReactNode
  duration?: number
}

function AlertNode({ type, message, duration = 1000 }: IProps) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0)
    }, duration)
    return () => {
      clearTimeout(timer)
    }
  }, [duration])

  return (
    <div
      className='alert-container'
      style={{ top: '10%', left: '50%', opacity: opacity, animation: `${opacity === 0 ? 'slide-up-fade-out 1s' : ''}` }}
    >
      <Alert variant='filled' severity={type}>
        {message}
      </Alert>
    </div>
  )
}

export default function useAlert() {
  const showAlert = useCallback((props: IProps) => {
    const { duration = 2000 } = props
    const div = document.createElement('div')
    document.body.appendChild(div)
    const root = ReactDOM.createRoot(div)
    root.render(<AlertNode {...props} />)
    setTimeout(() => {
      root.unmount()
      document.body.removeChild(div)
    }, duration * 2)
  }, [])

  return {
    showAlert,
  }
}
