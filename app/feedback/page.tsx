'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type FeedbackTab = 'template_request' | 'bug_report'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'hnue-invitation/feedbacks')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    throw new Error('Upload ảnh thất bại')
  }

  const data = await res.json()
  return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1400/')
}

export default function FeedbackPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<FeedbackTab>('template_request')

  const [templateUrl, setTemplateUrl] = useState('')
  const [templateNote, setTemplateNote] = useState('')
  const [bugNote, setBugNote] = useState('')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const tabCopy = useMemo(() => {
    if (activeTab === 'template_request') {
      return 'Gửi template bạn thích - tụi mình sẽ làm nó thành thiệp cho bạn'
    }

    return 'Gặp lỗi? Báo tụi mình fix ngay'
  }, [activeTab])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  function onSelectImage(files: FileList | null) {
    if (!files || files.length === 0) return

    const file = files[0]
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh tối đa 5MB')
      return
    }

    setError('')
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function clearImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview('')
  }

  function switchTab(nextTab: FeedbackTab) {
    setActiveTab(nextTab)
    setError('')
    setSuccess('')
    clearImage()
  }

  async function submit() {
    setError('')
    setSuccess('')

    if (activeTab === 'template_request') {
      if (!templateUrl.trim()) {
        setError('Vui lòng nhập URL template')
        return
      }

      const isHttp = /^https?:\/\//i.test(templateUrl.trim())
      if (!isHttp) {
        setError('URL cần bắt đầu bằng http:// hoặc https://')
        return
      }
    }

    if (activeTab === 'bug_report' && !bugNote.trim()) {
      setError('Vui lòng mô tả lỗi bạn gặp')
      return
    }

    setLoading(true)

    try {
      let imageUrl = ''
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile)
      }

      const payload = activeTab === 'template_request'
        ? {
            type: 'template_request',
            data: {
              url: templateUrl.trim(),
              note: templateNote.trim(),
              image_url: imageUrl,
            },
          }
        : {
            type: 'bug_report',
            data: {
              note: bugNote.trim(),
              image_url: imageUrl,
            },
          }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Gửi thất bại')
      }

      setSuccess('Đã gửi thành công')
      setTemplateUrl('')
      setTemplateNote('')
      setBugNote('')
      clearImage()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="font-semibold text-gray-900">Gửi yêu cầu hoặc báo lỗi</h1>
      </div>

      <section className="max-w-2xl mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6"
        >
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-5">
            <button
              onClick={() => switchTab('template_request')}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'template_request' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Yêu cầu template
            </button>
            <button
              onClick={() => switchTab('bug_report')}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'bug_report' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Báo lỗi
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-5">{tabCopy}</p>

          {activeTab === 'template_request' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">URL (bắt buộc)</label>
                <input
                  value={templateUrl}
                  onChange={(e) => setTemplateUrl(e.target.value)}
                  placeholder="Dán link Canva / Pinterest"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Note (optional)</label>
                <textarea
                  value={templateNote}
                  onChange={(e) => setTemplateNote(e.target.value)}
                  placeholder={'Mình thích màu này\nTemplate này cute'}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-500 resize-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-gray-700">Note (bắt buộc)</label>
              <textarea
                value={bugNote}
                onChange={(e) => setBugNote(e.target.value)}
                placeholder="Mô tả lỗi bạn gặp"
                rows={4}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-500 resize-none"
              />
            </div>
          )}

          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700">
              Ảnh {activeTab === 'template_request' ? 'template (optional)' : 'lỗi (rất quan trọng)'}
            </p>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              {imagePreview ? (
                <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    onClick={clearImage}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs"
                  >
                    x
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-500 transition-colors"
                >
                  + Upload
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onSelectImage(e.target.files)}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
              {success}
            </p>
          )}

          <motion.button
            onClick={submit}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Đang gửi...' : 'Gửi'}
          </motion.button>
        </motion.div>
      </section>
    </main>
  )
}
