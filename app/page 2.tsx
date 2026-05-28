import { supabaseAdmin } from '@/lib/supabase'
import SituationCards from '@/components/SituationCards'

async function getCards() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('situation_cards')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const cards = await getCards()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347A3.75 3.75 0 0114.25 21h-4.5a3.75 3.75 0 01-2.646-1.097l-.347-.347z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">SkillApply AI</span>
          </div>
          <a href="/admin" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Admin
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <p className="text-xs font-medium text-brand-600 uppercase tracking-widest mb-3">
          Post-Training Coaching
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-4">
          SkillApply AI — <br className="hidden sm:block" />
          Your Workplace Coach
        </h1>
        <p className="text-base text-gray-500 leading-relaxed max-w-lg">
          Select a situation you&apos;re facing at work, add your context, and get
          practical coaching guidance based on your training.
        </p>
      </section>

      {/* Cards */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
          Choose your situation
        </p>
        <SituationCards cards={cards} />
      </section>
    </main>
  )
}
