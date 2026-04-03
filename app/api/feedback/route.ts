import { NextRequest, NextResponse } from 'next/server'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CreateFeedbackInput } from '@/types'

function isTemplateRequestData(data: unknown): data is { url: string; note?: string; image_url?: string } {
  if (!data || typeof data !== 'object') return false
  const candidate = data as Record<string, unknown>
  return typeof candidate.url === 'string'
}

function isBugReportData(data: unknown): data is { note: string; image_url?: string } {
  if (!data || typeof data !== 'object') return false
  const candidate = data as Record<string, unknown>
  return typeof candidate.note === 'string'
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateFeedbackInput = await req.json()

    if (!body?.type || !body?.data) {
      return NextResponse.json({ error: 'Thiếu dữ liệu gửi lên' }, { status: 400 })
    }

    if (body.type !== 'template_request' && body.type !== 'bug_report') {
      return NextResponse.json({ error: 'Loại feedback không hợp lệ' }, { status: 400 })
    }

    if (body.type === 'template_request') {
      if (!isTemplateRequestData(body.data) || body.data.url.trim().length === 0) {
        return NextResponse.json({ error: 'URL template là bắt buộc' }, { status: 400 })
      }

      const payload = {
        type: 'template_request' as const,
        data: {
          url: body.data.url.trim(),
          note: (body.data.note ?? '').trim(),
          image_url: (body.data.image_url ?? '').trim(),
        },
        created_at: serverTimestamp(),
      }

      await addDoc(collection(db, 'feedbacks'), payload)
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    if (!isBugReportData(body.data) || body.data.note.trim().length === 0) {
      return NextResponse.json({ error: 'Mô tả lỗi là bắt buộc' }, { status: 400 })
    }

    const payload = {
      type: 'bug_report' as const,
      data: {
        note: body.data.note.trim(),
        image_url: (body.data.image_url ?? '').trim(),
      },
      created_at: serverTimestamp(),
    }

    await addDoc(collection(db, 'feedbacks'), payload)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/feedback]', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
