import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabase'
import SituationCards from '@/components/SituationCards'
import { clientConfig } from '@/client.config'

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
  const cfg = clientConfig

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Top bar — logos only */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="relative h-8 w-32">
            <Image
              src={cfg.growthAspireLogo}
              alt="GrowthAspire"
              fill
              className="object-contain object-left"
            />
          </div>
          <div className="relative h-8 w-32">
            <Image
              src={cfg.clientLogo}
              alt={cfg.clientCompanyName}
              fill
              className="object-contain object-right"
            />
          </div>
        </div>
      </header>

      {/* Welcome banner */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* Training badge */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="section-tag">{cfg.trainingName}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">Completed {cfg.trainingDate}</span>
          </div>

          {/* Trainer card */}
          <div className="flex gap-5 items-start">
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={cfg.trainerPhoto}
                  alt={cfg.trainerName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{cfg.trainerName}</p>
              <p className="text-xs text-gray-400 mb-3">{cfg.trainerTitle}</p>

              {/* Welcome message */}
              <div className="bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100 relative">
                {/* speech bubble tail */}
                <div className="absolute -left-2 top-4 w-0 h-0
                  border-t-[6px] border-t-transparent
                  border-r-[8px] border-r-gray-100
                  border-b-[6px] border-b-transparent" />
                {cfg.welcomeMessage.split('\n\n').map((para, i) => (
                  <p key={i} className={`text-sm text-gray-700 leading-relaxed ${i > 0 ? 'mt-3' : ''}`}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Situation cards */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
          {cfg.pageSubtitle}
        </p>
        <SituationCards cards={cards} />
      </section>

    </main>
  )
}
