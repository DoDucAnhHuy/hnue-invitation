/**
 * Chạy 1 lần để seed dữ liệu templates lên Firestore:
 *   node scripts/seed-templates.js
 *
 * Cần: GOOGLE_APPLICATION_CREDENTIALS hoặc Firebase Admin SDK key
 */

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

// Dùng service account key (download từ Firebase Console > Project Settings > Service accounts)
const serviceAccount = require('../firebase-service-account.json')

initializeApp({ credential: cert(serviceAccount) })

const db = getFirestore()

const TEMPLATES = [
  {
    id: 'cute-pink',
    name: 'Cute Pink',
    description: 'Nhẹ nhàng, đáng yêu — phù hợp nhóm bạn thân',
    keywords: ['cute', 'pink', 'bạn bè', 'vui', 'nhẹ nhàng', 'đáng yêu'],
    preview_url: '',
    color_scheme: 'pink',
  },
  {
    id: 'elegant-blue',
    name: 'Elegant Blue',
    description: 'Trang trọng, chuyên nghiệp — phù hợp lớp lớn, hội đồng',
    keywords: ['trang trọng', 'lịch sự', 'chuyên nghiệp', 'xanh', 'formal'],
    preview_url: '',
    color_scheme: 'blue',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Tối giản, hiện đại — phù hợp mọi dịp',
    keywords: ['minimal', 'tối giản', 'hiện đại', 'trắng', 'sạch'],
    preview_url: '',
    color_scheme: 'neutral',
  },
]

async function seed() {
  for (const t of TEMPLATES) {
    await db.collection('templates').doc(t.id).set(t)
    console.log(`✓ Seeded template: ${t.name}`)
  }
  console.log('Done!')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
