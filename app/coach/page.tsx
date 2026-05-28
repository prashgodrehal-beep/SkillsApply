'use client'

import { Suspense } from 'react'
import CoachForm from '@/components/CoachForm'

export default function CoachPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-sm text-gray-400">Loading...</p></div>}>
      <CoachForm />
    </Suspense>
  )
}
