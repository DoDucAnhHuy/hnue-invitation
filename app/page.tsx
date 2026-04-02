'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { TEMPLATES } from '@/lib/templates'

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-100 px-4 py-16 text-center"
      >
        <p className="text-sm text-gray-400 uppercase tracking-widest mb-3">HNUE Invitation</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thiệp kỉ yếu của bạn<br />
          <span className="text-pink-500">trong 1 phút</span>
        </h1>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
          Chọn template, nhập thông tin, nhận link chia sẻ ngay. Không cần kỹ năng thiết kế.
        </p>
        <motion.button
          onClick={() => router.push('/create')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Tạo thiệp ngay →
        </motion.button>
      </motion.section>

      {/* Template preview */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="px-4 py-12 max-w-lg mx-auto"
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
