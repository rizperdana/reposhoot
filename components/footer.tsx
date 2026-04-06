import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-6 text-center text-sm text-gray-500 border-t mt-8">
      <div className="flex gap-4 justify-center">
        <Link href="/terms" className="hover:underline">Terms of Service</Link>
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
      </div>
      <p className="mt-2">reposhoot - GitHub to beautiful images</p>
    </footer>
  )
}