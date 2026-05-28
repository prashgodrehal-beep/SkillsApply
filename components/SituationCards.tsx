'use client'

import { useRouter } from 'next/navigation'
import { SituationCard } from '@/lib/types'

const CARD_ICONS = ['💬', '🤝', '🎯', '⚡', '🔄']

interface Props {
  cards: SituationCard[]
}

export default function SituationCards({ cards }: Props) {
  const router = useRouter()

  function selectCard(cardText: string) {
    const params = new URLSearchParams({ situation: cardText })
    router.push(`/coach?${params.toString()}`)
  }

  function selectFreeForm() {
    router.push('/coach?freeform=true')
  }

  if (cards.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">No situations loaded yet</p>
        <p className="text-sm text-gray-400">
          The admin needs to add training content and generate situation cards first.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <button
          key={card.id}
          onClick={() => selectCard(card.card_text)}
          className="card p-5 text-left hover:shadow-md hover:border-gray-200 active:scale-[0.99] transition-all group cursor-pointer"
        >
          <span className="text-xl mb-3 block">{CARD_ICONS[i % CARD_ICONS.length]}</span>
          <p className="text-sm font-medium text-gray-800 leading-relaxed group-hover:text-gray-900">
            {card.card_text}
          </p>
        </button>
      ))}

      {/* Always-present free-form card */}
      <button
        onClick={selectFreeForm}
        className="card p-5 text-left border-dashed hover:shadow-md hover:border-gray-300 active:scale-[0.99] transition-all group cursor-pointer"
      >
        <span className="text-xl mb-3 block">✏️</span>
        <p className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-gray-700 italic">
          My situation is different.
        </p>
      </button>
    </div>
  )
}
