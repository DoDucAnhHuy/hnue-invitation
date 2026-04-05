import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { TEMPLATES } from '@/lib/templates'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const limitParam = Number(req.nextUrl.searchParams.get('limit') || '4')
    const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(10, limitParam)) : 4

    const snap = await getDocs(collection(db, 'invitations'))
    const usageMap = new Map<string, number>()

    for (const docSnap of snap.docs) {
      const data = docSnap.data() as { template_id?: string }
      const key = data.template_id
      if (!key) continue
      usageMap.set(key, (usageMap.get(key) || 0) + 1)
    }

    const popular = TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      preview_url: t.preview_url,
      color_scheme: t.color_scheme,
      usageCount: usageMap.get(t.id) || 0,
    }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)

    return NextResponse.json({ items: popular })
  } catch (err) {
    console.error('[GET /api/templates/popular]', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
