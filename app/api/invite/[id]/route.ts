import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const snap = await getDoc(doc(db, 'invitations', params.id))

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Không tìm thấy thiệp' }, { status: 404 })
    }

    return NextResponse.json(snap.data())
  } catch (err) {
    console.error('[GET /api/invite/[id]]', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
