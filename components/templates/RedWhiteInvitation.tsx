import type { Invitation } from '@/types'
import Image from 'next/image'
import bgClean from '../../temp/Red_White.png'

export default function RedWhiteInvitation({ name, time, location, message, images }: Invitation) {
  const displayName     = name?.trim()     || 'name'
  const displayTime     = time?.trim()     || 'time'
  const displayLocation = location?.trim() || 'location'
  const displayMessage  = message?.trim()  || 'message'

  return (
    <div className="min-h-screen bg-[#ece9e3] flex items-center justify-center px-4 py-8">
      <div
        className="relative w-[min(92vw,390px)] aspect-[1240/1748] overflow-hidden rounded-md shadow-[0_20px_45px_rgba(0,0,0,0.2)]"
        style={{ containerType: 'inline-size' }} 
      >
        <Image src={bgClean} alt="" fill sizes="(max-width: 640px) 92vw, 390px" className="object-cover" priority />

        <div className="absolute inset-0 pointer-events-none">
          {images?.[0] && (
            <div className="absolute left-[11.6%] top-[48.2%] w-[37.5%] h-[27.8%] overflow-hidden rounded-sm">
              <Image src={images[0]} alt="" fill sizes="(max-width: 640px) 35vw, 146px" className="object-cover" />
            </div>
          )}

          <div
            className="absolute left-[0%] top-[77.6%] w-[60%] text-center text-[#a82620] font-semibold"
            style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(16px, 4.8cqw, 38px)', lineHeight: 1 }}
          >
            {displayName}
          </div>

          <div
            className="absolute right-[7%] top-[50.5%] w-[32%] text-[#575757] whitespace-pre-line break-words"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(12px, 2.9cqw, 20px)', lineHeight: 1.18 }}
          >
            {displayMessage}
          </div>

          <div
            className="absolute left-[13%] bottom-[5.6%] w-[36%] text-[#636363]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(10px, 2.1cqw, 16px)', lineHeight: 1.1 }}
          >
            {displayTime}
          </div>

          <div
            className="absolute right-[24%] bottom-[.6%] w-[30%] h-[7.2%] overflow-hidden whitespace-normal break-words text-[#636363] text-left"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(10px, 2.1cqw, 16px)', lineHeight: 1.1 }}
          >
            <p className="m-0 whitespace-normal break-words">
              {displayLocation}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}