import type { Invitation } from '@/types'
import Image from 'next/image'
import bgClean from '../../temp/Grey and Black.png'

export default function GreyBlackInvitation({ name, class: cls, time, location, message, images }: Invitation) {
  const displayName = name?.trim() || 'Your Name'
  const displayClass = cls?.trim() || 'Class Of 2026'
  const displayTime = time?.trim() || 'June 25th, 2023 at 10:00 AM'
  const displayLocation = location?.trim() || '123 Anywhere St., Any City, ST 12345'
  const displayMessage = message?.trim() || 'Come and Celebrate with us!'

  return (
    <div className="min-h-screen bg-[#d7d7d7] flex items-center justify-center px-4 py-8">
      <div
        className="relative w-[min(92vw,390px)] aspect-[1240/1748] overflow-hidden rounded-md shadow-[0_20px_45px_rgba(0,0,0,0.2)] origin-center lg:scale-[1.12] xl:scale-[1.22]"
        style={{ containerType: 'inline-size' }}
      >
        <Image src={bgClean} alt="" fill className="object-cover" priority />

        <div className="absolute inset-0 pointer-events-none">
          {images?.[0] && (
            <div className="absolute left-[32.5%] top-[19%] w-[37.8%] h-[26.5%] overflow-hidden rounded-[3.5%]">
              <Image src={images[0]} alt="" fill className="object-cover" />
            </div>
          )}

          <div
            className="absolute top-[68%] w-[100%] text-center text-[#2f2a33]"
            style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(26px, 8.3cqw, 56px)', lineHeight: 1.02 }}
          >
            {displayName}
          </div>

          

          <div
            className="absolute left-[14%] bottom-[15.5%] w-[72%] text-center text-[#312f37]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(12px, 3.4cqw, 26px)', lineHeight: 1.1 }}
          >
            {displayTime}
          </div>

          <div
            className="absolute left-[14%] bottom-[10%] w-[72%] text-center text-[#312f37] h-[5.5%] overflow-hidden"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(12px, 3.4cqw, 26px)', lineHeight: 1.1 }}
          >
            <p className="m-0 whitespace-normal break-words">{displayLocation}</p>
          </div>

          <div
            className="absolute left-[18%] bottom-[6%] w-[68%] text-center text-[#2f2a33] h-[4.8%] overflow-hidden whitespace-pre-line break-words"
            style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(12px, 5.4cqw, 18px)', lineHeight: 1.05 }}
          >
            {displayMessage}
            {/* <p className="m-0 whitespace-normal break-words">{displayMessage}</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}
