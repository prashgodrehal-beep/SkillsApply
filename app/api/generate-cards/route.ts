import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { anthropic, COACHING_MODEL, buildCardGenerationPrompt } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  try {
    const { adminPassword } = await req.json()

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = supabaseAdmin()

    // Fetch latest training content
    const { data: contentRows, error: contentError } = await db
      .from('training_content')
      .select('content')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (contentError || !contentRows?.length) {
      return NextResponse.json({ error: 'No training content found. Save content first.' }, { status: 400 })
    }

    const trainingContent = contentRows[0].content

    // Call Claude to generate cards
    const message = await anthropic.messages.create({
      model: COACHING_MODEL,
      max_tokens: 800,
      system: buildCardGenerationPrompt(),
      messages: [
        {
          role: 'user',
          content: `Training content:\n\n${trainingContent.slice(0, 6000)}\n\nGenerate 5 situation cards as a JSON array.`,
        },
      ],
    })

    const rawText = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')

    const clean = rawText.replace(/```json|```/g, '').trim()
    const cards: string[] = JSON.parse(clean)

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('Invalid card response from AI')
    }

    // Clear old cards, insert new ones
    await db.from('situation_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const rows = cards.map((card_text, i) => ({
      card_text,
      display_order: i,
    }))

    const { error: insertError } = await db.from('situation_cards').insert(rows)
    if (insertError) throw insertError

    return NextResponse.json({ success: true, cards })
  } catch (err) {
    console.error('[POST /api/generate-cards]', err)
    return NextResponse.json({ error: 'Failed to generate cards' }, { status: 500 })
  }
}
