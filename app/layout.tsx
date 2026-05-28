import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillApply AI — Your Post-Training Workplace Coach',
  description: 'Apply your training to real workplace situations with AI coaching guidance.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
