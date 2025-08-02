import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'EduPal AI - AI-Powered Educational Platform',
  description: 'Intelligent homework assistance and automated grading with personalized learning paths',
  keywords: 'education, AI, homework, grading, learning, OCR, mathematics, physics, chemistry',
  authors: [{ name: 'Ahmad Rifki Aryanto' }],
  openGraph: {
    title: 'EduPal AI',
    description: 'AI-Powered Educational Platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}