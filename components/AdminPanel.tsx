'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Status = 'idle' | 'saving' | 'generating' | 'done' | 'error'

export default function AdminPanel() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [cards, setCards] = useState<string[]>([])

  async function handleSaveAndGenerate() {
    if (!password.trim()) { setMessage('Enter the admin password.'); setStatus('error'); return }
    if (content.trim().length < 50) { setMessage('Training content is too short — paste more content.'); setStatus('error'); return }

    setStatus('saving')
    setMessage('')

    // Step 1: Save content
    const saveRes = await fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, adminPassword: password }),
    })

    if (!saveRes.ok) {
      const err = await saveRes.json()
      setMessage(err.error || 'Failed to save content. Check your password.')
      setStatus('error')
      return
    }

    // Step 2: Generate cards
    setStatus('generating')
    const genRes = await fetch('/api/generate-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPassword: password }),
    })

    if (!genRes.ok) {
      const err = await genRes.json()
      setMessage(err.error || 'Content saved but card generation failed.')
      setStatus('error')
      return
    }

    const data = await genRes.json()
    setCards(data.cards || [])
    setMessage(`Content saved and ${data.cards?.length || 0} situation cards generated successfully.`)
    setStatus('done')
  }

  const isLoading = status === 'saving' || status === 'generating'

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 transition-colors" title="Back to participant view">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-900">Admin Panel</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Training content setup</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Paste your training module content below. The AI will use it as the primary knowledge source
            and generate situation cards from it. Cards are shared with all participants.
          </p>
        </div>

        <div className="card p-6 space-y-5">
          <div>
            <label className="label">Admin password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="label">Training content</label>
            <textarea
              className="form-input resize-none"
              rows={12}
              placeholder="Paste the full training module content here — frameworks, principles, scenarios, key concepts, models..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400 mt-1.5">{content.length.toLocaleString()} characters</p>
          </div>

          {status === 'error' && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}

          {status === 'done' && (
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <p className="text-sm text-green-700 font-medium mb-3">{message}</p>
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Generated cards:</p>
              <ul className="space-y-1.5">
                {cards.map((card, i) => (
                  <li key={i} className="text-sm text-green-800 flex gap-2">
                    <span className="text-green-400 flex-shrink-0">{i + 1}.</span>
                    {card}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="btn-primary w-full"
            onClick={handleSaveAndGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {status === 'saving' ? 'Saving content...' : 'Generating situation cards...'}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Save content &amp; generate cards
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Changes take effect immediately for all participants.
        </p>
      </div>
    </main>
  )
}
