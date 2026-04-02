'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

export default function ShareBar({ id, name }: { id: string; name: string }) {
  const [copied, setCopied] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('new') === '1') setShowBanner(true)
  }, [searchParams])

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/invite/${id}`
    : `/invite/${id}`

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareZalo() {
    window.open(`https://zalo.me/share?text=${encodeURIComponent(`Thiệp kỉ yếu của ${name} 🎓 ${url}`)}`, '_blank')
  }

  function shareFacebook() {
    window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 text-sm font-medium z-50"
          >
            🎉 Thiệp đã tạo xong! Chia sẻ với bạn bè ngay nhé
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100 p-4 z-40"
      >
        <div className="max-w-sm mx-auto flex gap-2">
          <motion.button
            onClick={copyLink}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {copied ? '✓ Đã copy!' : '🔗 Copy link'}
          </motion.button>
          <motion.button
            onClick={shareZalo}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Zalo
          </motion.button>
          <motion.button
            onClick={shareFacebook}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-3 rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            FB
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
