import { NextRequest, NextResponse } from 'next/server'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CreateInvitationInput } from '@/types'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)

export async function POST(req: NextRequest) {
  try {
    const body: CreateInvitationInput = await req.json()

    // Basic validation
    if (!body.name || !body.class || !body.template_id) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    if (body.images && body.images.length > 3) {
      return NextResponse.json({ error: 'Tối đa 3 ảnh' }, { status: 400 })
    }

    const id = nanoid()

    await setDoc(doc(db, 'invitations', id), {
      ...body,
      id,
      created_at: serverTimestamp(),
    })

    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/invite]', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
