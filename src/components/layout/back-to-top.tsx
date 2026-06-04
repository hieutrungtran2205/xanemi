'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-6 z-50 rounded-full bg-surface shadow-lg sm:bottom-6"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  )
}