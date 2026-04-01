import { Invitation } from '@/types'
import Image from 'next/image'

export default function MinimalWhite({ name, class: cls, time, location, message, images }: Invitation) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Kỉ yếu · HNUE</p>
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-500 mt-1">{cls}</p>
        </div>

        {/* Main image */}
        {images && images.length > 0 && (
          <div className="relative h-80 rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <Image src={images[0]} alt={name} fill className="object-cover" />
          </div>
        )}

        {/* Info block */}
        <div className="border-t border-gray-100 pt-6 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Thông tin sự kiện</p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400">Thời gian</p>
              <p className="text-gray-800 font-medium mt-0.5">{time}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Địa điểm</p>
              <p className="text-gray-800 font-medium mt-0.5">{location}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="border-t border-gray-100 pt-6 mb-8">
            <p className="text-gray-600 leading-relaxed">{message}</p>
          </div>
        )}

        {/* Extra images */}
        {images && images.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1).map((url, i) => (
              <div key={i} className="relative h-36 rounded-xl overflow-hidden bg-gray-100">
                <Image src={url} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-gray-300 text-xs mt-10">HNUE Invitation</p>
      </div>
    </div>
  )
}
