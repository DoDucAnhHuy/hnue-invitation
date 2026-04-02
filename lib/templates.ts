import { Template } from '@/types'

export const TEMPLATES: Template[] = [
  {
    id: 'red-white-invitation',
    name: 'Red White Invitation',
    description: 'Poster do-trang, style vintage cho le tot nghiep',
    keywords: ['red', 'white', 'vintage', 'graduation', 'poster', 'polaroid'],
    preview_url: '/previews/red-white-invitation.png',
    color_scheme: 'neutral',
    fieldLimits: { name: 18, time: 28, location: 28, message: 200 },
  },
  {
    id: 'blue-yellow-scrapbook',
    name: 'Blue Yellow Scrapbook',
    description: 'Scrapbook nang dong, tone vang-xanh theo poster tot nghiep',
    keywords: ['scrapbook', 'blue', 'yellow', 'poster', 'graduation', 'notebook'],
    preview_url: '/previews/blue-yellow-scrapbook.png',
    color_scheme: 'blue',
    fieldLimits: { name: 20, time: 30, location: 30, message: 40 },
  },
  {
    id: 'cute-pink',
    name: 'Cute Pink',
    description: 'Nhẹ nhàng, đáng yêu — phù hợp nhóm bạn thân',
    keywords: ['cute', 'pink', 'bạn bè', 'vui', 'nhẹ nhàng', 'đáng yêu'],
    preview_url: '/previews/cute-pink.png',
    color_scheme: 'pink',
    fieldLimits: { name: 25, time: 35, location: 40, message: 60 },
  },
  {
    id: 'elegant-blue',
    name: 'Elegant Blue',
    description: 'Trang trọng, chuyên nghiệp — phù hợp lớp lớn, hội đồng',
    keywords: ['trang trọng', 'lịch sự', 'chuyên nghiệp', 'xanh', 'formal'],
    preview_url: '/previews/elegant-blue.png',
    color_scheme: 'blue',
    fieldLimits: { name: 30, time: 40, location: 50, message: 80 },
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Tối giản, hiện đại — phù hợp mọi dịp',
    keywords: ['minimal', 'tối giản', 'hiện đại', 'trắng', 'sạch'],
    preview_url: '/previews/minimal-white.png',
    color_scheme: 'neutral',
    fieldLimits: { name: 28, time: 38, location: 48, message: 70 },
  },
  {
    id: 'grunge-silver',
    name: 'Grunge Silver',
    description: 'Monochrome, cổ điển — cảm hứng lễ tốt nghiệp',
    keywords: ['graduation', 'grunge', 'silver', 'monochrome', 'co dien', 'classy'],
    preview_url: '/previews/grunge-silver.png',
    color_scheme: 'neutral',
    fieldLimits: { name: 24, time: 34, location: 40, message: 55 },
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
