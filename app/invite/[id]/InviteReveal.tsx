'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

type Theme = {
  body: string
  bodyBorder: string
  leftFold: string
  rightFold: string
  btmFlap: string
  flap: string
  sealFill: string
  stamp: string
  backdrop: string
  hintText: string
}

const THEMES: Record<string, Theme> = {
  'cute-pink': {
    body: '#fce7f3',
    bodyBorder: '#f9a8d4',
    leftFold: '#fbcfe8',
    rightFold: '#fbcfe8',
    btmFlap: '#fce7f3',
    flap: '#be185d',
    sealFill: '#9d174d',
    stamp: '🌸',
    backdrop: 'bg-slate-900',
    hintText: 'rgba(255,255,255,0.72)',
  },
  'elegant-blue': {
    body: '#e0e7ff',
    bodyBorder: '#a5b4fc',
    leftFold: '#c7d2fe',
    rightFold: '#c7d2fe',
    btmFlap: '#e0e7ff',
    flap: '#3730a3',
    sealFill: '#312e81',
    stamp: '✦',
    backdrop: 'bg-amber-50',
    hintText: 'rgba(15,23,42,0.78)',
  },
  'minimal-white': {
    body: '#f1f5f9',
    bodyBorder: '#94a3b8',
    leftFold: '#e2e8f0',
    rightFold: '#e2e8f0',
    btmFlap: '#f1f5f9',
    flap: '#0f172a',
    sealFill: '#1e293b',
    stamp: '◈',
    backdrop: 'bg-zinc-900',
    hintText: 'rgba(255,255,255,0.72)',
  },
}

type Phase = 'idle' | 'opening' | 'revealed'

export default function InviteReveal({ templateId }: { templateId: string }) {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [letterUp, setLetterUp] = useState(false)
  const t = THEMES[templateId] ?? THEMES['minimal-white']
  const isOpening = phase === 'opening'

  function openEnvelope() {
    if (phase !== 'idle') return
    setPhase('opening')
    window.setTimeout(() => setLetterUp(true), prefersReducedMotion ? 40 : 260)
    window.setTimeout(() => setPhase('revealed'), prefersReducedMotion ? 180 : 1100)
  }

  return (
    <AnimatePresence>
      {phase !== 'revealed' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${t.backdrop}`}
        >
          <div className="relative w-[min(92vw,320px)]" style={{ perspective: '1400px' }}>
            <div
              className="relative"
              role="button"
              tabIndex={0}
              aria-label="Mo phong bi"
              onClick={openEnvelope}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openEnvelope()
                }
              }}
            >
              <div
                className="absolute -bottom-2.5 left-2 right-2 h-5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.18)', filter: 'blur(10px)', zIndex: 0 }}
              />

              <div className="relative" style={{ zIndex: 1 }}>
                <div
                  className="absolute left-1/2 rounded-2xl bg-white overflow-hidden transition-transform duration-[900ms]"
                  style={{
                    top: '56px',
                    width: '264px',
                    height: '148px',
                    border: '1px solid rgba(0,0,0,0.07)',
                    transform: `translateX(-50%) translateY(${letterUp ? '-108px' : '0px'})`,
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    zIndex: 2,
                  }}
                >
                  <div className="p-4 pt-5 flex flex-col gap-2">
                    {[55, 82, 44, 70, 60].map((w, i) => (
                      <div key={i} className="h-0.5 rounded bg-gray-200" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <div
                    className="absolute bottom-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white border border-white/20"
                    style={{ background: t.sealFill }}
                  >
                    {t.stamp}
                  </div>
                </div>

                <svg
                  viewBox="0 0 320 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="block w-full"
                  style={{ position: 'relative', zIndex: 3, overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.13)" />
                    </linearGradient>
                    <linearGradient id="leftShade" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(0,0,0,0.09)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                    </linearGradient>
                    <linearGradient id="rightShade" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.09)" />
                    </linearGradient>
                  </defs>

                  <rect x="0" y="0" width="320" height="200" rx="22" ry="22" fill={t.body} stroke={t.bodyBorder} strokeWidth="1.2" />
                  <polygon points="0,200 160,108 320,200" fill={t.btmFlap} />
                  <polygon points="0,200 160,108 320,200" fill="url(#bodyShade)" />
                  <polygon points="0,0 0,200 148,108" fill={t.leftFold} />
                  <polygon points="0,0 0,200 148,108" fill="url(#leftShade)" />
                  <polygon points="320,0 320,200 172,108" fill={t.rightFold} />
                  <polygon points="320,0 320,200 172,108" fill="url(#rightShade)" />
                  <line x1="0" y1="108" x2="320" y2="108" stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
                </svg>

                <div
                  className="absolute top-0 left-0 right-0 transition-transform duration-[780ms]"
                  style={{
                    height: '148px',
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d',
                    transform: isOpening ? 'rotateX(-172deg)' : 'rotateX(0deg)',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    zIndex: 4,
                  }}
                >
                  <svg viewBox="0 0 320 148" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="flapShadeG" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                      </linearGradient>
                    </defs>
                    <path d="M10,0 L310,0 Q316,0 316,8 L172,122 Q160,132 148,122 L4,8 Q4,0 10,0 Z" fill={t.flap} />
                    <path d="M10,0 L310,0 L160,124 Z" fill="url(#flapShadeG)" opacity="0.45" />
                    <line x1="0" y1="1" x2="320" y2="1" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
                  </svg>
                </div>

                <div
                  className="absolute left-1/2 transition-all duration-300"
                  style={{
                    top: '114px',
                    transform: isOpening ? 'translateX(-50%) scale(0.5)' : 'translateX(-50%) scale(1)',
                    opacity: isOpening ? 0 : 1,
                    zIndex: 5,
                    width: '36px',
                    height: '36px',
                  }}
                >
                  <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                    <circle cx="18" cy="18" r="16" fill={t.sealFill} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <circle cx="18" cy="18" r="12" fill="rgba(255,255,255,0.12)" />
                    <text x="18" y="22" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.9)" fontFamily="serif">
                      {t.stamp}
                    </text>
                  </svg>
                </div>
              </div>

              <p className="text-center text-[11px] tracking-wide mt-2" style={{ color: t.hintText }}>
                Nhấn vào phong bì để mở thiệp
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
