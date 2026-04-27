import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-green-deep text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-serif text-2xl font-bold text-white mb-2">Wild Reads</p>
            <p className="text-sm max-w-xs">
              A curated collection of books and authors for curious minds.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">
                Explore
              </p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/books" className="hover:text-white transition-colors">Books</Link></li>
                <li><Link to="/authors" className="hover:text-white transition-colors">Authors</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Wild Reads. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
