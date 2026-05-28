import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { content, adminPassword } = await req.json()

    // Verify admin password
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!content || content.trim().length < 50) {
      return NextResponse.json({ error: 'Training content is too short.' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Delete existing content (single-row pattern) then insert
    await db.from('training_content').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const { error } = await db
      .from('training_content')
      .insert({ content: content.trim(), updated_at: new Date().toISOString() })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/save-content]', err)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
