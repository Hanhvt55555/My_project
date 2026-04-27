import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import BookCard from '../components/BookCard'
import AuthorCard from '../components/AuthorCard'
import GenreFilter from '../components/GenreFilter'
import { getAllBooks } from '../api/books'
import { getAllAuthors } from '../api/authors'

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-parchment-dark border-t-amber rounded-full animate-spin" />
    </div>
  )
}

export default function Home() {
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState('')

  useEffect(() => {
    Promise.all([getAllBooks(), getAllAuthors()])
      .then(([b, a]) => {
        setBooks(b)
        setAuthors(a)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const allGenres = [...new Set(books.flatMap((b) => b.genres ?? []))]

  const featured = activeGenre
    ? books.filter((b) => b.genres?.includes(activeGenre))
    : books.slice(0, 6)

  return (
    <>
      <Hero />

      {/* Featured Books */}
      <section className="bg-parchment py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-amber font-semibold tracking-widest text-xs uppercase mb-2">Collection</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink">Explore Books</h2>
            </div>
            <Link
              to="/books"
              className="text-green-deep font-semibold hover:underline text-sm"
            >
              View all →
            </Link>
          </div>

          {allGenres.length > 0 && (
            <div className="mb-8">
              <GenreFilter genres={allGenres} active={activeGenre} onSelect={setActiveGenre} />
            </div>
          )}

          {loading ? (
            <Spinner />
          ) : featured.length === 0 ? (
            <p className="text-ink/40 text-center py-10">No books found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.slice(0, 6).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Author Spotlight */}
      <section className="bg-green-deep py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#2C6B4A44,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-amber font-semibold tracking-widest text-xs uppercase mb-2">Authors</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Meet the Writers</h2>
            </div>
            <Link
              to="/authors"
              className="text-amber font-semibold hover:underline text-sm"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {authors.slice(0, 3).map((author) => (
                <AuthorCard key={author._id} author={author} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-parchment-dark py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-serif text-5xl font-black text-green-deep">{books.length}</p>
            <p className="text-ink/60 text-sm font-semibold mt-1 uppercase tracking-widest">Books</p>
          </div>
          <div>
            <p className="font-serif text-5xl font-black text-green-deep">{authors.length}</p>
            <p className="text-ink/60 text-sm font-semibold mt-1 uppercase tracking-widest">Authors</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-5xl font-black text-green-deep">{allGenres.length}</p>
            <p className="text-ink/60 text-sm font-semibold mt-1 uppercase tracking-widest">Genres</p>
          </div>
        </div>
      </section>
    </>
  )
}
