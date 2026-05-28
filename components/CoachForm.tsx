'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CoachingResponse } from '@/lib/types'

type Step = 'form' | 'loading' | 'response'

export default function CoachForm() {
  const router = useRouter()
  const params = useSearchParams()
  const situation = params.get('situation') || ''
  const isFreeForm = params.get('freeform') === 'true'

  const [step, setStep] = useState<Step>('form')
  const [freeFormDesc, setFreeFormDesc] = useState('')
  const [whatHappened, setWhatHappened] = useState('')
  const [desiredOutcome, setDesiredOutcome] = useState('')
  const [response, setResponse] = useState<CoachingResponse | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!whatHappened.trim() || !desiredOutcome.trim()) {
      setError('Please fill in both fields before continuing.')
      return
    }
    if (isFreeForm && !freeFormDesc.trim()) {
      setError('Please describe your situation.')
      return
    }
    setError('')
    setStep('loading')

    try {
      const res = await fetch('/api/get-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: isFreeForm ? 'My situation is different' : situation,
          whatHappened,
          desiredOutcome,
          isFreeForm,
          freeFormDescription: freeFormDesc,
        }),
      })

      const data: CoachingResponse = await res.json()

      if (!res.ok) {
        setError((data as { error?: string }).error || 'Something went wrong. Please try again.')
        setStep('form')
        return
      }

      setResponse(data)
      setStep('response')
    } catch {
      setError('Network error. Please check your connection and try again.')
      setStep('form')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-900">SkillApply AI</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Form step */}
        {(step === 'form' || step === 'loading') && (
          <div>
            <div className="mb-6">
              <span className="section-tag">
                {isFreeForm ? 'Custom situation' : situation}
              </span>
            </div>

            <div className="card p-6 space-y-5">
              {isFreeForm && (
                <div>
                  <label className="label">Describe your situation</label>
                  <textarea
                    className="form-input resize-none"
                    rows={3}
                    placeholder="Briefly describe the workplace situation you're facing..."
                    value={freeFormDesc}
                    onChange={(e) => setFreeFormDesc(e.target.value)}
                    disabled={step === 'loading'}
                  />
                </div>
              )}

              <div>
                <label className="label">What happened, in your words</label>
                <textarea
                  className="form-input resize-none"
                  rows={4}
                  placeholder="What exactly happened? Who was involved? What was said or done?"
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  disabled={step === 'loading'}
                />
              </div>

              <div>
                <label className="label">What outcome do you want?</label>
                <textarea
                  className="form-input resize-none"
                  rows={3}
                  placeholder="What would a good result look like for you?"
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                  disabled={step === 'loading'}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
              )}

              <button
                className="btn-primary w-full"
                onClick={handleSubmit}
                disabled={step === 'loading'}
              >
                {step === 'loading' ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Thinking through your situation...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347A3.75 3.75 0 0114.25 21h-4.5a3.75 3.75 0 01-2.646-1.097l-.347-.347z" />
                    </svg>
                    Get coaching guidance
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Response step */}
        {step === 'response' && response && (
          <div>
            <div className="mb-6">
              <span className="section-tag">
                {isFreeForm ? freeFormDesc || 'Custom situation' : situation}
              </span>
            </div>

            {response.guardrail ? (
              <div className="card p-6 border-amber-100 bg-amber-50">
                <p className="text-sm text-amber-800 leading-relaxed">{response.message}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <ResponseSection
                  label="Situation understanding"
                  text={response.situationUnderstanding!}
                  variant="default"
                />
                <ResponseSection
                  label="Relevant training principle"
                  text={response.trainingPrinciple!}
                  variant="default"
                />
                <ResponseSection
                  label="How to think about it"
                  text={response.howToThinkAboutIt!}
                  variant="default"
                />
                <ResponseSection
                  label="Suggested response"
                  text={response.suggestedResponse!}
                  variant="default"
                />
                <ResponseSection
                  label="Reflection question"
                  text={response.reflectionQuestion!}
                  variant="reflection"
                />
                <ResponseSection
                  label="Ethical reminder"
                  text={response.ethicalReminder!}
                  variant="ethical"
                />
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button className="btn-secondary flex-1" onClick={() => setStep('form')}>
                Edit my context
              </button>
              <button className="btn-primary flex-1" onClick={() => router.push('/')}>
                Try another situation
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function ResponseSection({
  label,
  text,
  variant,
}: {
  label: string
  text: string
  variant: 'default' | 'reflection' | 'ethical'
}) {
  const base = 'card p-5'

  if (variant === 'reflection') {
    return (
      <div className={`${base} bg-brand-50 border-brand-100`}>
        <p className="label text-brand-600">{label}</p>
        <p className="text-sm text-brand-700 leading-relaxed italic">{text}</p>
      </div>
    )
  }

  if (variant === 'ethical') {
    return (
      <div className={`${base} bg-green-50 border-green-100`}>
        <p className="label text-green-600">{label}</p>
        <p className="text-sm text-green-800 leading-relaxed">{text}</p>
      </div>
    )
  }

  return (
    <div className={base}>
      <p className="label">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  )
}
