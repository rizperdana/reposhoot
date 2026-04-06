import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'reposhoot - GitHub Repo to Beautiful Image',
  description: 'Transform GitHub repositories into beautiful shareable images for social media',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}