import { useState, useEffect, useMemo } from 'react'
import BookCard from '../components/BookCard'
import Modal from '../components/Modal'
import BookForm from '../components/BookForm'
import { getAllBooks, createBook, updateBook, deleteBook } from '../api/books'

const PAGE_SIZE = 12

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-parchment-dark border-t-amber rounded-full animate-spin" />
    </div>
  )
}

function Pagination({ page, total, pageSize, onChange }) {
  const pages = Math.ceil(total / pageSize)
  if (pages <= 1) return null

  function getNumbers() {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '…', pages]
    if (page >= pages - 3) return [1, '…', pages - 4, pages - 3, pages - 2, pages - 1, pages]
    return [1, '…', page - 1, page, page + 1, '…', pages]
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg border border-parchment-dark text-ink/50 hover:border-green-mid hover:text-green-deep disabled:opacity-30 text-sm transition-colors"
      >
        ← Prev
      </button>
      {getNumbers().map((n, i) =>
        n === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-ink/30 text-sm select-none">…</span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
              n === page
                ? 'bg-green-deep text-white'
                : 'border border-parchment-dark text-ink/60 hover:border-green-mid hover:text-green-deep'
            }`}
          >
            {n}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1.5 rounded-lg border border-parchment-dark text-ink/50 hover:border-green-mid hover:text-green-deep disabled:opacity-30 text-sm transition-colors"
      >
        Next →
      </button>
    </div>
  )
}

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeGenre, setActiveGenre] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function fetchBooks() {
    return getAllBooks().then(setBooks).catch((e) => setError(e.message))
  }

  useEffect(() => {
    fetchBooks().finally(() => setLoading(false))
  }, [])

  const allGenres = useMemo(
    () => [...new Set(books.flatMap((b) => b.genres ?? []))].sort(),
    [books]
  )

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchGenre = activeGenre ? b.genres?.includes(activeGenre) : true
      const matchSearch = search
        ? b.name.toLowerCase().includes(search.toLowerCase())
        : true
      return matchGenre && matchSearch
    })
  }, [books, activeGenre, search])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  function handleGenre(g) {
    setActiveGenre((prev) => (prev === g ? '' : g))
    setPage(1)
  }

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  async function handleAdd(data) {
    setSaving(true)
    try {
      await createBook(data)
      await fetchBooks()
      setShowAdd(false)
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(data) {
    setSaving(true)
    try {
      await updateBook(editTarget._id, data)
      await fetchBooks()
      setEditTarget(null)
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteBook(deleteTarget._id)
      setBooks((prev) => prev.filter((b) => b._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (e) {
      alert(e.message)
    } finally {
      setDeleting(false)
    }
  }

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-2">Search</p>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search books…"
            value={search}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2.5 bg-parchment border border-parchment-dark rounded-xl text-sm text-ink placeholder-ink/30 outline-none focus:border-green-mid transition-colors"
          />
        </div>
      </div>

      {allGenres.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Genres</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleGenre('')}
              className={`text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                !activeGenre
                  ? 'bg-green-deep text-white'
                  : 'text-ink/60 hover:bg-parchment-dark hover:text-ink'
              }`}
            >
              All genres
            </button>
            {allGenres.map((g) => (
              <button
                key={g}
                onClick={() => handleGenre(g)}
                className={`text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeGenre === g
                    ? 'bg-amber/15 text-amber font-semibold'
                    : 'text-ink/60 hover:bg-parchment-dark hover:text-ink'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {(search || activeGenre) && (
        <button
          onClick={() => { setSearch(''); setActiveGenre(''); setPage(1) }}
          className="w-full text-sm text-ink/50 hover:text-ink border border-parchment-dark rounded-xl py-2 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  )

  return (
    <>
      <div className="bg-parchment min-h-screen">
        {/* Header */}
        <div className="bg-green-deep py-16">
          <div className="max-w-7xl mx-auto px-6 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-amber font-semibold tracking-widest text-xs uppercase mb-3">Library</p>
              <h1 className="font-serif text-5xl md:text-6xl font-black text-white">All Books</h1>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-amber hover:bg-amber-light text-white font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Book
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex gap-8 items-start">

            {/* Sidebar — desktop */}
            <aside className="hidden md:block w-56 lg:w-64 shrink-0">
              <div className="sticky top-6 bg-white rounded-2xl border border-parchment-dark p-5">
                <FilterPanel />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile: filter toggle + search row */}
              <div className="md:hidden mb-4 flex gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search books…"
                    value={search}
                    onChange={handleSearch}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-parchment-dark rounded-full text-sm text-ink placeholder-ink/30 outline-none focus:border-green-mid transition-colors"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-semibold transition-colors ${
                    activeGenre ? 'bg-amber text-white border-amber' : 'border-parchment-dark text-ink hover:border-green-mid'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
                  </svg>
                  Filters {activeGenre && '·'}
                </button>
              </div>

              {/* Mobile: expanded filter panel */}
              {showFilters && (
                <div className="md:hidden mb-5 bg-white rounded-2xl border border-parchment-dark p-5">
                  <FilterPanel />
                </div>
              )}

              {/* Results count */}
              {!loading && !error && (
                <p className="text-ink/40 text-sm mb-5">
                  {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
                  {activeGenre && <span> in <span className="text-amber font-medium">{activeGenre}</span></span>}
                </p>
              )}

              {loading ? (
                <Spinner />
              ) : error ? (
                <p className="text-center text-ink/50 py-20">{error}</p>
              ) : filtered.length === 0 ? (
                <p className="text-center text-ink/40 py-20">No books match your search.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginated.map((book) => (
                      <BookCard
                        key={book._id}
                        book={book}
                        onEdit={setEditTarget}
                        onDelete={setDeleteTarget}
                      />
                    ))}
                  </div>
                  <Pagination
                    page={page}
                    total={filtered.length}
                    pageSize={PAGE_SIZE}
                    onChange={setPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <Modal title="Add Book" onClose={() => setShowAdd(false)}>
          <BookForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
        </Modal>
      )}
      {editTarget && (
        <Modal title="Edit Book" onClose={() => setEditTarget(null)}>
          <BookForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} saving={saving} />
        </Modal>
      )}
      {deleteTarget && (
        <Modal title="Delete Book" onClose={() => setDeleteTarget(null)}>
          <p className="text-ink/70 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-ink">"{deleteTarget.name}"</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 border border-parchment-dark text-ink hover:bg-parchment-dark font-semibold py-2.5 rounded-full transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
