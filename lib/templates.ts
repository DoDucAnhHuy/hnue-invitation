import { Template } from '@/types'

export const TEMPLATES: Template[] = [
  {
    id: 'cute-pink',
    name: 'Cute Pink',
    description: 'Nhẹ nhàng, đáng yêu — phù hợp nhóm bạn thân',
    keywords: ['cute', 'pink', 'bạn bè', 'vui', 'nhẹ nhàng', 'đáng yêu'],
    preview_url: '/previews/cute-pink.jpg',
    color_scheme: 'pink',
  },
  {
    id: 'elegant-blue',
    name: 'Elegant Blue',
    description: 'Trang trọng, chuyên nghiệp — phù hợp lớp lớn, hội đồng',
    keywords: ['trang trọng', 'lịch sự', 'chuyên nghiệp', 'xanh', 'formal'],
    preview_url: '/previews/elegant-blue.jpg',
    color_scheme: 'blue',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Tối giản, hiện đại — phù hợp mọi dịp',
    keywords: ['minimal', 'tối giản', 'hiện đại', 'trắng', 'sạch'],
    preview_url: '/previews/minimal-white.jpg',
    color_scheme: 'neutral',
  },
]

export function suggestTemplate(input: string): string {
  const lower = input.toLowerCase()

  let bestMatch = TEMPLATES[2] // default: minimal-white
  let bestScore = 0

  for (const template of TEMPLATES) {
    const score = template.keywords.filter(kw => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = template
    }
  }

  return bestMatch.id
}

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id)
}
