import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'gold', onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [message])

  const dotColor =
    type === 'success' ? 'bg-[#7EB89A]' :
    type === 'error'   ? 'bg-[#C97B7B]' :
    'bg-[var(--gold)]'

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[400]
        flex items-center gap-2.5
        bg-[#1E1E1E] border border-[rgba(201,164,89,0.45)]
        rounded-[10px] px-4 py-3
        text-[13px] text-white
        pointer-events-none
        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
      `}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
      {message}
    </div>
  )
}