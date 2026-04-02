import type { Invitation } from '@/types'
import Image from 'next/image'
import bgMobile from '../../temp/Blue Yellow Creative Graduation Poster.png'

export default function BlueYellowScrapbook({ name, time, location, message, images }: Invitation) {
  const displayTime = time?.trim() || 'time'
  const displayLocation = location?.trim() || 'location'
  const displayMessage = message?.trim() || 'message'
  const displayName = name?.trim() || 'name'

  return (
    <div className="min-h-screen bg-[#efb625] flex items-center justify-center px-4 py-8">
      <div className="relative w-[min(92vw,390px)] aspect-[1587/2245] overflow-hidden rounded-md shadow-[0_20px_45px_rgba(0,0,0,0.22)]">
        <Image src={bgMobile} alt="" fill className="object-cover" priority />

        <div className="absolute inset-0 pointer-events-none">
          {images?.[0] && (
            <div className="absolute left-[16.2%] top-[42.5%] w-[26%] h-[16%] rotate-[-8deg] bg-white p-[0.5%] shadow-[0_8px_18px_rgba(0,0,0,0.22)]">
              <div className="relative w-full h-full border border-zinc-200">
                <Image src={images[0]} alt="" fill className="object-cover" />
              </div>
            </div>
          )}

          {images?.[1] && (
            <div className="absolute right-[18.2%] top-[33.1%] w-[21%] h-[18.0%] rotate-[0deg] bg-white p-[0.5%] shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
              <div className="relative w-full h-full border border-zinc-200">
                <Image src={images[1]} alt="" fill className="object-cover" />
              </div>
            </div>
          )}

          {images?.[2] && (
            <div className="absolute right-[24.5%] top-[46.5%] w-[19%] h-[17%] rotate-[-15deg] bg-white p-[0.5%] shadow-[0_9px_20px_rgba(0,0,0,0.24)]">
              <div className="relative w-full h-full border border-zinc-200">
                <Image src={images[2]} alt="" fill className="object-cover" />
              </div>
            </div>
          )}

          <div
            className="absolute top-[28%] left-[-17%] w-[100%] rotate-[0deg] text-center text-[#f7be34] font-semibold"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            <div className="leading-tight break-words" style={{ fontSize: 'clamp(10px, 3.5vw, 20px)' }}>{displayName}</div>
          </div>

          <div className="absolute bottom-[15%] right-[9%] w-[38%] rotate-[-1deg] text-center text-[#171717] [font-family:'Times_New_Roman',serif] font-semibold">
            <div className="leading-tight break-words" style={{ fontSize: 'clamp(10px, 3.5vw, 18px)' }}>{displayTime}</div>
          </div>

          <div className="absolute bottom-[8.2%] right-[9%] w-[38%] rotate-[-1deg] text-center text-[#171717] [font-family:'Times_New_Roman',serif] font-semibold">
            <div className="leading-tight break-words" style={{ fontSize: 'clamp(10px, 3.5vw, 18px)' }}>{displayLocation}</div>
          </div>

          <div className="absolute bottom-[8.2%] left-[9%] w-[38%] rotate-[2deg] text-center text-[#171717] [font-family:'Times_New_Roman',serif] font-semibold">
            <div className="leading-tight break-words" style={{ fontSize: 'clamp(10px, 3.5vw, 18px)' }}>{displayMessage}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
