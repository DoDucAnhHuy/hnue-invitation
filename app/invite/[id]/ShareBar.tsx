'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

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
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 text-sm font-medium z-50">
          🎉 Thiệp đã tạo xong! Chia sẻ với bạn bè ngay nhé
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100 p-4 z-40">
        <div className="max-w-sm mx-auto flex gap-2">
          <button
            onClick={copyLink}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {copied ? '✓ Đã copy!' : '🔗 Copy link'}
          </button>
          <button
            onClick={shareZalo}
            className="px-4 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Zalo
          </button>
          <button
            onClick={shareFacebook}
            className="px-4 py-3 rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            FB
          </button>
        </div>
      </div>
    </>
  )
}
