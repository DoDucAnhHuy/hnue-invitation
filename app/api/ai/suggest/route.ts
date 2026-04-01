import { NextRequest, NextResponse } from 'next/server'
import { suggestTemplate } from '@/lib/templates'

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json()

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Thiếu input' }, { status: 400 })
    }

    const template_id = suggestTemplate(input)
    return NextResponse.json({ template_id })
  } catch (err) {
    console.error('[POST /api/ai/suggest]', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
