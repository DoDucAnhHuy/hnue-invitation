'use client'

import { useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TEMPLATES } from '@/lib/templates'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

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
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files).slice(0, 3 - images.length)
    const valid = arr.filter(f => f.size <= 5 * 1024 * 1024)
    if (valid.length < arr.length) setError('Ảnh tối đa 5MB mỗi file')
    setImages(prev => [...prev, ...valid])
    setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit() {
    setError('')
    if (!name.trim() || !cls.trim() || !time.trim() || !location.trim()) {
      setError('Vui lòng điền đủ thông tin bắt buộc')
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
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="font-semibold text-gray-900">Tạo thiệp kỉ yếu</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Template picker */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Phong cách</p>
          <div className="flex gap-2">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm border transition-all
                  ${templateId === t.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {[
            { label: 'Tên *', value: name, setter: setName, placeholder: 'Nguyễn Văn A' },
            { label: 'Lớp *', value: cls, setter: setCls, placeholder: 'K61 CNTT' },
            { label: 'Thời gian *', value: time, setter: setTime, placeholder: '18:00, Thứ 7, 20/06/2025' },
            { label: 'Địa điểm *', value: location, setter: setLocation, placeholder: 'Nhà hàng Hà Nội' },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label} className="px-4 py-3">
              <label className="text-xs text-gray-400 block mb-1">{label}</label>
              <input
                value={value}
                onChange={e => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full text-gray-900 placeholder-gray-300 outline-none text-sm"
              />
            </div>
          ))}
          <div className="px-4 py-3">
            <label className="text-xs text-gray-400 block mb-1">Lời nhắn</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Cảm ơn bạn đã đồng hành cùng mình suốt 4 năm..."
              rows={3}
              className="w-full text-gray-900 placeholder-gray-300 outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* Image upload */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Ảnh (tối đa 3)</p>
          <div className="flex gap-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 transition-colors"
              >
                <span className="text-2xl">+</span>
                <span className="text-xs mt-1">Thêm ảnh</span>
              </button>
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
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full max-w-lg mx-auto block bg-gray-900 text-white py-3.5 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang tạo thiệp...' : 'Tạo thiệp →'}
        </button>
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