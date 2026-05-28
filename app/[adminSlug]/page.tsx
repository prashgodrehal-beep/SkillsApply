import { notFound } from 'next/navigation'
import AdminPanel from '@/components/AdminPanel'

interface Props {
  params: Promise<{ adminSlug: string }>
}

export default async function AdminRoute({ params }: Props) {
  const { adminSlug } = await params
  const validSlug = process.env.ADMIN_SLUG

  // If slug doesn't match env var → render 404, not a redirect
  // (avoids leaking that an admin route exists at all)
  if (!validSlug || adminSlug !== validSlug) {
    notFound()
  }

  return <AdminPanel />
}
