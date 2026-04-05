'use client'

import { useState, useRef, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { TEMPLATES } from '@/lib/templates'

const DEFAULT_FIELD_LIMITS = { name: 25, time: 35, location: 40, message: 60 }

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
const FALLBACK_PREVIEW_URL = '/previews/GrungeSilver.png'

const IMAGE_RULES: Record<string, { min: number; max: number; label: string }> = {
  'blue-yellow-scrapbook': { min: 3, max: 3, label: 'Ảnh (bắt buộc đúng 3)' },
  'cute-pink': { min: 1, max: 1, label: 'Ảnh (bắt buộc đúng 1)' },
  'elegant-blue': { min: 1, max: 1, label: 'Ảnh (bắt buộc đúng 1)' },
  'minimal-white': { min: 1, max: 1, label: 'Ảnh (bắt buộc đúng 1)' },
  'red-white-invitation': { min: 1, max: 1, label: 'Ảnh (bắt buộc đúng 1)' },
  'grey-black-invitation': { min: 1, max: 1, label: 'Ảnh (bắt buộc đúng 1)' },
}

function getImageRule(templateId: string) {
  return IMAGE_RULES[templateId] ?? { min: 0, max: 3, label: 'Ảnh (tối đa 3)' }
}

function formatDateTimeForDisplay(value: Date | null): string {
  if (!value) return ''
  return format(value, 'HH:mm, dd/MM/yyyy')
}

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'hnue-invitation')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!res.ok) throw new Error('Upload ảnh thất bại')
  const data = await res.json()
  return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_800/')
}

function CreateForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTemplate = searchParams.get('template') ?? 'minimal-white'

  const [templateId, setTemplateId] = useState(defaultTemplate)
  const [name, setName] = useState('')
  const [cls, setCls] = useState('')
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)
  const currentTemplate = TEMPLATES.find(t => t.id === templateId)
  const limits = currentTemplate?.fieldLimits ?? DEFAULT_FIELD_LIMITS
  const imageRule = getImageRule(templateId)
  const time = formatDateTimeForDisplay(selectedDateTime)

  useEffect(() => {
    const warnings: string[] = []
    if (name.length > limits.name) warnings.push(`Template này chỉ hiển thị tốt tối đa ${limits.name} ký tự cho tên`)
    if (time.length > limits.time) warnings.push(`Template này chỉ hiển thị tốt tối đa ${limits.time} ký tự cho thời gian`)
    if (location.length > limits.location) warnings.push(`Template này chỉ hiển thị tốt tối đa ${limits.location} ký tự cho địa điểm`)
    if (message.length > limits.message) warnings.push(`Template này chỉ hiển thị tốt tối đa ${limits.message} ký tự cho lời nhắn`)

    if (warnings.length > 0) {
      setError(warnings[0])
      return
    }

    if (error.startsWith('Template này chỉ hiển thị tốt tối đa')) {
      setError('')
    }
  }, [templateId, name.length, time.length, location.length, message.length, limits.name, limits.time, limits.location, limits.message, error])

  useEffect(() => {
    // Trim extra selected images when switching to templates with stricter limits.
    if (images.length > imageRule.max) {
      setImages(prev => prev.slice(0, imageRule.max))
      setPreviews(prev => prev.slice(0, imageRule.max))
      setError(`Template này chỉ cho phép tối đa ${imageRule.max} ảnh`)
    }
  }, [templateId, imageRule.max, images.length])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const remaining = Math.max(0, imageRule.max - images.length)
    const arr = Array.from(files).slice(0, remaining)
    const valid = arr.filter(f => f.size <= 5 * 1024 * 1024)
    if (valid.length < arr.length) setError('Ảnh tối đa 5MB mỗi file')
    if (remaining === 0) setError(`Template này chỉ cho phép tối đa ${imageRule.max} ảnh`)
    setImages(prev => [...prev, ...valid])
    setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  function handlePreviewError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    if (!img.src.endsWith(FALLBACK_PREVIEW_URL)) {
      img.src = FALLBACK_PREVIEW_URL
    }
  }

  async function handleSubmit() {
    setError('')
    if (!name.trim() || !cls.trim() || !time.trim() || !location.trim()) {
      setError('Vui lòng điền đủ thông tin bắt buộc')
      return
    }

    if (images.length < imageRule.min || images.length > imageRule.max) {
      if (imageRule.min === imageRule.max) {
        setError(`Template này yêu cầu đúng ${imageRule.min} ảnh`)
      } else {
        setError(`Template này yêu cầu từ ${imageRule.min} đến ${imageRule.max} ảnh`)
      }
      return
    }

    setLoading(true)
    try {
      // Upload ảnh lên Cloudinary
      const imageUrls: string[] = []
      for (const file of images) {
        const url = await uploadToCloudinary(file)
        imageUrls.push(url)
      }

      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          class: cls.trim(),
          time: time.trim(),
          location: location.trim(),
          message: message.trim(),
          images: imageUrls,
          template_id: templateId,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      const { id } = await res.json()
      router.push(`/invite/${id}?new=1`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3"
      >
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="font-semibold text-gray-900">Tạo thiệp kỉ yếu</h1>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-32 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8">
        <div className="space-y-6 lg:max-w-xl">
          {/* Template picker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm font-medium text-gray-700 mb-3">Phong cách</p>
            <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-1 no-scrollbar md:grid-flow-row md:grid-cols-3 md:auto-cols-auto md:overflow-visible">
              {TEMPLATES.map(t => (
                <motion.button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`min-w-max md:min-w-0 md:w-full py-2 px-3 rounded-xl text-sm border transition-all
                    ${templateId === t.id
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                >
                  {t.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Mobile preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="lg:hidden bg-white border border-gray-100 rounded-2xl p-3"
          >
            {/* <p className="text-xs text-gray-500 mb-2">Xem trước mẫu đã chọn</p> */}
            {currentTemplate && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentTemplate.preview_url}
                alt={currentTemplate.name}
                onError={handlePreviewError}
                className="w-full h-[52svh] min-h-[320px] max-h-[500px] object-contain bg-gray-100 rounded-xl"
              />
            )}
          </motion.div>

          {/* Fields */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50"
          >
            {[
              { label: 'Tên *', value: name, setter: setName, placeholder: 'Nguyễn Văn A', maxLength: limits.name, showCounter: true },
              { label: 'Lớp *', value: cls, setter: setCls, placeholder: 'K61 CNTT', maxLength: 25, showCounter: false },
              { label: 'Địa điểm *', value: location, setter: setLocation, placeholder: 'Nhà hàng Hà Nội', maxLength: limits.location, showCounter: true },
            ].map(({ label, value, setter, placeholder, maxLength, showCounter }) => (
              <div key={label} className="px-4 py-3">
                <label className="text-xs text-gray-400 block mb-1">
                  {label}
                  {showCounter && <span className="float-right">{value.length}/{maxLength}</span>}
                </label>
                <input
                  value={value}
                  onChange={e => setter(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  className="w-full text-gray-900 placeholder-gray-300 outline-none text-sm"
                />
              </div>
            ))}

            <div className="px-4 py-3">
              <label className="text-xs text-gray-400 block mb-1">
                Thời gian *
                <span className="float-right">{time.length}/{limits.time}</span>
              </label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-colors focus-within:border-gray-400 focus-within:bg-white">
                {/* <label className="text-[11px] text-gray-400 block mb-1">Thời gian</label> */}
                <DatePicker
                  selected={selectedDateTime}
                  onChange={(date: Date | null) => setSelectedDateTime(date)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="HH:mm, dd/MM/yyyy"
                  locale={vi}
                  placeholderText="Chọn ngày và giờ"
                  className="w-full bg-transparent text-gray-900 outline-none text-sm"
                  popperPlacement="bottom-start"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Hiển thị: <span className="text-gray-600">{time || 'Chưa chọn'}</span>
              </p>
            </div>

            <div className="px-4 py-3">
              <label className="text-xs text-gray-400 block mb-1">
                Lời nhắn
                <span className="float-right">{message.length}/{limits.message}</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Cảm ơn bạn đã đồng hành cùng mình suốt 4 năm..."
                maxLength={limits.message}
                rows={3}
                className="w-full text-gray-900 placeholder-gray-300 outline-none text-sm resize-none"
              />
            </div>
          </motion.div>

          {/* Image upload */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-sm font-medium text-gray-700 mb-3">
              {imageRule.label}
            </p>
            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
              {images.length < imageRule.max && (
                <motion.button
                  onClick={() => fileRef.current?.click()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 transition-colors"
                >
                  <span className="text-2xl">+</span>
                  <span className="text-xs mt-1">Thêm ảnh</span>
                </motion.button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Desktop preview */}
        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="hidden lg:block"
        >
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2">Xem trước mẫu đã chọn</p>
            {currentTemplate && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentTemplate.preview_url}
                alt={currentTemplate.name}
                onError={handlePreviewError}
                className="w-full h-[70svh] max-h-[620px] min-h-[420px] object-contain bg-gray-100 rounded-xl"
              />
            )}
            {currentTemplate && (
              <>
                <p className="text-sm font-medium text-gray-900 mt-3">{currentTemplate.name}</p>
                <p className="text-xs text-gray-500 mt-1">{currentTemplate.description}</p>
              </>
            )}
          </div>
        </motion.aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 sm:p-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="w-full max-w-lg mx-auto block bg-gray-900 text-white py-3.5 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang tạo thiệp...' : 'Tạo thiệp →'}
        </motion.button>
      </div>
    </main>
  )
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreateForm />
    </Suspense>
  )
}