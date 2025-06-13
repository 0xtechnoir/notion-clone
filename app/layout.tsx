import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Notion Clone',
  description: 'A modern note-taking app built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
