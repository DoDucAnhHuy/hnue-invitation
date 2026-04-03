'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { TEMPLATES } from '@/lib/templates'

type PopularTemplate = {
  id: string
  name: string
  description: string
  preview_url: string
  color_scheme: string
  usageCount: number
}

export default function HomePage() {
  const router = useRouter()
  const [popularTemplates, setPopularTemplates] = useState<PopularTemplate[]>([])

  useEffect(() => {
    let active = true

    async function loadPopularTemplates() {
      try {
        const res = await fetch('/api/templates/popular?limit=4')
        if (!res.ok) return
        const data = await res.json() as { items?: PopularTemplate[] }
        if (!active) return
        setPopularTemplates(data.items ?? [])
      } catch {
        // Keep the homepage usable even if stats API is unavailable.
      }
    }

    loadPopularTemplates()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-100 px-4 py-12 sm:py-16 text-center"
      >
        <p className="text-sm text-gray-400 uppercase tracking-widest mb-3">HNUE Invitation</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Thiệp kỉ yếu của bạn<br />
          <span className="text-pink-500">trong 1 phút</span>
        </h1>
        <p className="text-gray-500 mb-8 max-w-xs sm:max-w-sm mx-auto text-sm sm:text-base">
          Chọn template, nhập thông tin, nhận link chia sẻ ngay. Không cần kỹ năng thiết kế.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            onClick={() => router.push('/create')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Tạo thiệp ngay →
          </motion.button>

          <motion.button
            onClick={() => router.push('/feedback')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-gray-700 px-8 py-3 rounded-full font-medium border border-gray-200 hover:border-gray-400 transition-colors"
          >
            Gửi yêu cầu / báo lỗi
          </motion.button>
        </div>
      </motion.section>

      {/* Most used templates */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="px-4 pb-4 pt-8 max-w-5xl mx-auto"
      >
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Template dùng nhiều nhất</h2>
          <button
            onClick={() => router.push('/create')}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(popularTemplates.length > 0 ? popularTemplates : TEMPLATES.slice(0, 4).map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            preview_url: t.preview_url,
            color_scheme: t.color_scheme,
            usageCount: 0,
          }))).map((t, index) => (
            <motion.button
              key={t.id}
              onClick={() => router.push(`/create?template=${t.id}`)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              className="bg-white border border-gray-100 rounded-2xl p-3 text-left hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.preview_url}
                alt={t.name}
                className="w-full aspect-[1240/1748] object-cover rounded-xl bg-gray-100"
              />

              <div className="mt-3">
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.description}</p>
                <p className="text-xs text-gray-400 mt-2">{t.usageCount} lượt dùng</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Template preview */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="px-4 py-10 sm:py-12 max-w-lg mx-auto"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Chọn phong cách</h2>
        <div className="space-y-4">
          {TEMPLATES.map((t, index) => (
            <motion.button
              key={t.id}
              onClick={() => router.push(`/create?template=${t.id}`)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-300 hover:shadow-sm transition-all text-left"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0
                ${t.color_scheme === 'pink' ? 'bg-pink-100' : ''}
                ${t.color_scheme === 'blue' ? 'bg-slate-800' : ''}
                ${t.color_scheme === 'neutral' ? 'bg-gray-100' : ''}
              `}>
                <span className="text-2xl">
                  {t.color_scheme === 'pink' ? '🌸' : t.color_scheme === 'blue' ? '✨' : '◻️'}
                </span>
              </div>

              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.description}</p>
              </div>
              <span className="ml-auto text-gray-300">→</span>
            </motion.button>
          ))}
        </div>
      </motion.section>
    </main>
  )
}
