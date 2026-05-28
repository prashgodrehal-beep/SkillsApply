import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('situation_cards')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ cards: data || [] })
  } catch (err) {
    console.error('[GET /api/cards]', err)
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}
