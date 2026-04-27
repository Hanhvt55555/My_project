import { useState, useEffect, useMemo } from 'react'
import AuthorCard from '../components/AuthorCard'
import Modal from '../components/Modal'
import AuthorForm from '../components/AuthorForm'
import { getAllAuthors, createAuthor, updateAuthor, deleteAuthor } from '../api/authors'

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

const SORT_OPTIONS = [
  { value: 'name-asc',   label: 'Name A → Z' },
  { value: 'name-desc',  label: 'Name Z → A' },
  { value: 'year-asc',   label: 'Oldest born' },
  { value: 'year-desc',  label: 'Youngest born' },
  { value: 'books-desc', label: 'Most books' },
]

export default function Authors() {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name-asc')
  const [page, setPage] = useState(1)

  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function fetchAuthors() {
    return getAllAuthors().then(setAuthors).catch((e) => setError(e.message))
  }

  useEffect(() => {
    fetchAuthors().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = authors.filter((a) =>
      search ? a.name.toLowerCase().includes(search.toLowerCase()) : true
    )
    const [field, dir] = sort.split('-')
    list = [...list].sort((a, b) => {
      let va = field === 'books' ? (a.books?.length ?? 0) : field === 'year' ? (a.year ?? 0) : a.name
      let vb = field === 'books' ? (b.books?.length ?? 0) : field === 'year' ? (b.year ?? 0) : b.name
      if (va < vb) return dir === 'asc' ? -1 : 1
      if (va > vb) return dir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [authors, search, sort])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handleSort(e) {
    setSort(e.target.value)
    setPage(1)
  }

  async function handleAdd(data) {
    setSaving(true)
    try {
      await createAuthor(data)
      await fetchAuthors()
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
      await updateAuthor(editTarget._id, data)
      await fetchAuthors()
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
      await deleteAuthor(deleteTarget._id)
      setAuthors((prev) => prev.filter((a) => a._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (e) {
      alert(e.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-parchment min-h-screen">
        {/* Header */}
        <div className="bg-green-deep py-16">
          <div className="max-w-7xl mx-auto px-6 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-amber font-semibold tracking-widest text-xs uppercase mb-3">Writers</p>
              <h1 className="font-serif text-5xl md:text-6xl font-black text-white">All Authors</h1>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-amber hover:bg-amber-light text-white font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Author
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1 min-w-48 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search authors…"
                value={search}
                onChange={handleSearch}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-parchment-dark rounded-full text-sm text-ink placeholder-ink/30 outline-none focus:border-green-mid transition-colors"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-ink/40 uppercase tracking-widest shrink-0">Sort</label>
              <select
                value={sort}
                onChange={handleSort}
                className="bg-white border border-parchment-dark rounded-full px-4 py-2.5 text-sm text-ink outline-none focus:border-green-mid transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Count */}
            {!loading && !error && (
              <p className="text-ink/40 text-sm ml-auto">
                {filtered.length} {filtered.length === 1 ? 'author' : 'authors'}
              </p>
            )}
          </div>

          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-center text-ink/50 py-20">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-ink/40 py-20">No authors found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((author) => (
                  <AuthorCard
                    key={author._id}
                    author={author}
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

      {showAdd && (
        <Modal title="Add Author" onClose={() => setShowAdd(false)}>
          <AuthorForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
        </Modal>
      )}
      {editTarget && (
        <Modal title="Edit Author" onClose={() => setEditTarget(null)}>
          <AuthorForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} saving={saving} />
        </Modal>
      )}
      {deleteTarget && (
        <Modal title="Delete Author" onClose={() => setDeleteTarget(null)}>
          <p className="text-ink/70 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-ink">"{deleteTarget.name}"</span>?
            Their books will remain but author references will be removed.
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
