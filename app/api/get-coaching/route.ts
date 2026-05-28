import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { anthropic, COACHING_MODEL, buildCoachingSystemPrompt } from '@/lib/anthropic'
import { CoachingRequest, CoachingResponse } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body: CoachingRequest = await req.json()
    const { situation, whatHappened, desiredOutcome, isFreeForm, freeFormDescription } = body

    if (!whatHappened?.trim() || !desiredOutcome?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Fetch training content
    const { data: contentRows, error: contentError } = await db
      .from('training_content')
      .select('content')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (contentError || !contentRows?.length) {
      return NextResponse.json(
        { error: 'Training content not configured. Contact your administrator.' },
        { status: 503 }
      )
    }

    const trainingContent = contentRows[0].content
    const systemPrompt = buildCoachingSystemPrompt(trainingContent)

    const situationText = isFreeForm
      ? `Custom situation: ${freeFormDescription || 'Not specified'}`
      : situation

    const userMessage = `Situation: ${situationText}
What happened: ${whatHappened}
Desired outcome: ${desiredOutcome}`

    // Call Claude
    const message = await anthropic.messages.create({
      model: COACHING_MODEL,
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const rawText = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')

    const clean = rawText.replace(/```json|```/g, '').trim()
    const response: CoachingResponse = JSON.parse(clean)

    // Log session (non-blocking — ignore errors)
    db.from('coaching_sessions')
      .insert({
        situation: situationText,
        what_happened: whatHappened,
        desired_outcome: desiredOutcome,
        ai_response: response,
      })
      .then(() => {})
      .catch(() => {})

    return NextResponse.json(response)
  } catch (err) {
    console.error('[POST /api/get-coaching]', err)
    return NextResponse.json({ error: 'Failed to get coaching response. Please try again.' }, { status: 500 })
  }
}
