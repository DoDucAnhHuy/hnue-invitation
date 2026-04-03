import { Invitation } from '@/types'
import Image from 'next/image'

export default function ElegantBlue({ name, class: cls, time, location, message, images }: Invitation) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4">
      {/* Gold top bar */}
      <div className="w-full max-w-sm h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full mb-8" />

      <div className="text-center mb-8">
        <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-2">
          Trường Đại học Sư phạm Hà Nội
        </p>
        <h1 className="text-2xl font-bold text-white">Thiệp Mời Kỉ Yếu</h1>
      </div>

      <div className="bg-slate-800 rounded-2xl w-full max-w-sm overflow-hidden border border-slate-700">
        {images && images.length > 0 && (
          <div className="relative h-64">
            <Image src={images[0]} alt={name} fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent" />
          </div>
        )}

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Trân trọng kính mời</p>
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <span className="inline-block border border-amber-400 text-amber-400 text-xs px-3 py-1 rounded mt-2">
              {cls}
            </span>
          </div>

          <div className="border-t border-slate-700 pt-5 space-y-4 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Thời gian</span>
              <span className="text-white text-sm font-medium">{time}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-slate-400 text-sm shrink-0">Địa điểm</span>
              <span className="text-white text-sm font-medium text-right">{location}</span>
            </div>
          </div>

          {message && (
            <div className="border-l-2 border-amber-400 pl-4">
              <p className="text-slate-300 text-sm italic leading-relaxed whitespace-pre-line break-words">&ldquo;{message}&rdquo;</p>
            </div>
          )}
        </div>
      </div>

      {images && images.length > 1 && (
        <div className="mt-4 flex gap-3 w-full max-w-sm">
          {images.slice(1).map((url, i) => (
            <div key={i} className="relative flex-1 h-32 rounded-xl overflow-hidden">
              <Image src={url} alt="" fill className="object-cover opacity-80" />
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-8" />
      <p className="mt-4 text-slate-600 text-xs">HNUE Invitation</p>
    </div>
  )
}
