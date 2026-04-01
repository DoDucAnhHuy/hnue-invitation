import { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Invitation } from '@/types'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import ShareBar from './ShareBar'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const snap = await getDoc(doc(db, 'invitations', params.id))
  if (!snap.exists()) return { title: 'Thiệp không tồn tại' }
  const data = snap.data() as Invitation
  return {
    title: `Thiệp kỉ yếu của ${data.name} — ${data.class}`,
    description: data.message || `Mời bạn đến kỉ yếu của ${data.name}`,
    openGraph: {
      images: data.images?.[0] ? [data.images[0]] : [],
    },
  }
}

export default async function InvitePage({ params }: Props) {
  const snap = await getDoc(doc(db, 'invitations', params.id))

  if (!snap.exists()) notFound()

  const invitation = snap.data() as Invitation

  return (
    <>
      <TemplateRenderer {...invitation} />
      <ShareBar id={params.id} name={invitation.name} />
    </>
  )
}
