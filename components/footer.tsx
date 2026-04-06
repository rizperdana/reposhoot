export function Footer() {
  return (
    <footer className="py-6 text-center text-white/20 text-xs">
      <nav className="flex justify-center gap-4 mb-2">
        <a href="/terms" className="hover:text-white/60">Terms</a>
        <a href="/privacy" className="hover:text-white/60">Privacy</a>
        <a href="https://github.com/rizperdana/reposhoot" target="_blank" className="hover:text-white/60">GitHub</a>
      </nav>
      <p>reposhoot</p>
    </footer>
  )
}