import { Invitation } from '@/types'
import Image from 'next/image'

export default function CutePink({ name, class: cls, time, location, message, images }: Invitation) {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🌸</div>
        <h1 className="text-3xl font-bold text-pink-500">Thiệp Mời Kỉ Yếu</h1>
        <p className="text-pink-400 mt-1 text-sm">Trường Đại học Sư phạm Hà Nội</p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm overflow-hidden border border-pink-100">
        {/* Photo gallery */}
        {images && images.length > 0 && (
          <div className="relative h-72 bg-pink-100">
            <Image
              src={images[0]}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Name */}
          <div className="text-center mb-6">
            <p className="text-pink-400 text-sm mb-1">Kính mời</p>
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
            <span className="inline-block bg-pink-100 text-pink-600 text-xs px-3 py-1 rounded-full mt-2">
              {cls}
            </span>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-pink-100" />
            <span className="text-pink-300 text-lg">♡</span>
            <div className="flex-1 h-px bg-pink-100" />
          </div>

          {/* Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-pink-400 text-lg mt-0.5">🕐</span>
              <div>
                <p className="text-xs text-gray-400">Thời gian</p>
                <p className="text-gray-700 font-medium">{time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-pink-400 text-lg mt-0.5">📍</span>
              <div>
                <p className="text-xs text-gray-400">Địa điểm</p>
                <p className="text-gray-700 font-medium">{location}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="bg-pink-50 rounded-2xl p-4 text-center">
              <p className="text-gray-600 text-sm leading-relaxed italic">&ldquo;{message}&rdquo;</p>
            </div>
          )}
        </div>
      </div>

      {/* Extra images */}
      {images && images.length > 1 && (
        <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-sm">
          {images.slice(1).map((url, i) => (
            <div key={i} className="relative h-40 rounded-2xl overflow-hidden">
              <Image src={url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-pink-300 text-xs">Made with 💕 by HNUE Invitation</p>
    </div>
  )
}
