import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'HNUE Invitation — Tạo thiệp kỉ yếu',
  description: 'Tạo thiệp mời kỉ yếu đẹp, dễ chia sẻ trong vài phút.',
  openGraph: {
    title: 'HNUE Invitation',
    description: 'Tạo thiệp mời kỉ yếu đẹp, dễ chia sẻ trong vài phút.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
