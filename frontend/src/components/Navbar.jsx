import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-amber font-semibold'
      : 'text-white/80 hover:text-white transition-colors'

  return (
    <nav className="bg-green-deep sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-2xl font-bold text-white tracking-tight"
        >
          Wild Reads
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/books" className={linkClass}>
            Books
          </NavLink>
          <NavLink to="/authors" className={linkClass}>
            Authors
          </NavLink>
          <Link
            to="/books"
            className="bg-amber hover:bg-amber-light text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          >
            Explore
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-green-deep border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          <NavLink to="/books" className={linkClass} onClick={() => setOpen(false)}>
            Books
          </NavLink>
          <NavLink to="/authors" className={linkClass} onClick={() => setOpen(false)}>
            Authors
          </NavLink>
        </div>
      )}
    </nav>
  )
}
