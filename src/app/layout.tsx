import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Flow Builder Enterprise',
  description: 'Professional visual tool for designing LLM application workflows - The Figma for AI',
  keywords: ['AI', 'flow builder', 'LLM', 'workflow', 'design tool', 'visual programming'],
  authors: [{ name: 'AI Flow Builder Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
