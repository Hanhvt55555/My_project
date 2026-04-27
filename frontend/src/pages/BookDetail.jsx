import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import BookForm from '../components/BookForm'
import { getBook, updateBook, deleteBook } from '../api/books'

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-parchment-dark border-t-amber rounded-full animate-spin" />
    </div>
  )
}

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchBook = useCallback(() => {
    setLoading(true)
    getBook(id)
      .then(setBook)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { fetchBook() }, [fetchBook])

  async function handleEdit(data) {
    setSaving(true)
    try {
      await updateBook(id, data)
      await fetchBook()
      setShowEdit(false)
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteBook(id)
      navigate('/books')
    } catch (e) {
      alert(e.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="bg-parchment min-h-screen"><Spinner /></div>
  if (error || !book)
    return (
      <div className="bg-parchment min-h-screen flex items-center justify-center">
        <p className="text-ink/40">{error ?? 'Book not found.'}</p>
      </div>
    )

  const { name, author, genres = [], publishedDate } = book

  return (
    <>
      <div className="bg-parchment min-h-screen">
        {/* Header */}
        <div className="bg-green-deep py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              to="/books"
              className="text-white/50 hover:text-white text-sm transition-colors mb-6 inline-flex items-center gap-1"
            >
              ← Back to Books
            </Link>
            <div className="flex items-start justify-between gap-4 mt-4 flex-wrap">
              <div>
                <h1 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight">
                  {name}
                </h1>
                {publishedDate && (
                  <p className="text-white/50 mt-3 text-sm">{publishedDate}</p>
                )}
              </div>
              {/* Action buttons */}
              <div className="flex gap-3 shrink-0 self-end">
                <button
                  onClick={() => setShowEdit(true)}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="bg-rose-600/80 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              {genres.length > 0 && (
                <div>
                  <p className="text-ink/40 text-xs font-semibold uppercase tracking-widest mb-3">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="bg-amber/10 text-amber text-sm font-semibold px-4 py-1.5 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {publishedDate && (
                <div>
                  <p className="text-ink/40 text-xs font-semibold uppercase tracking-widest mb-1">Published</p>
                  <p className="text-ink font-sans">{publishedDate}</p>
                </div>
              )}
            </div>

            {author && (
              <div className="bg-white rounded-2xl p-6 border border-parchment-dark shadow-sm h-fit">
                <p className="text-ink/40 text-xs font-semibold uppercase tracking-widest mb-4">Author</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-deep text-white font-serif font-bold flex items-center justify-center shrink-0">
                    {(author.name ?? '?')
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-serif font-bold text-ink">{author.name}</p>
                    {author.year && <p className="text-ink/40 text-xs">b. {author.year}</p>}
                  </div>
                </div>
                <Link
                  to={`/authors/${author._id}`}
                  className="block text-center bg-green-deep hover:bg-green-mid text-white text-sm font-semibold py-2.5 rounded-full transition-colors"
                >
                  View Author
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <Modal title="Edit Book" onClose={() => setShowEdit(false)}>
          <BookForm
            initial={book}
            onSubmit={handleEdit}
            onCancel={() => setShowEdit(false)}
            saving={saving}
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {showDelete && (
        <Modal title="Delete Book" onClose={() => setShowDelete(false)}>
          <p className="text-ink/70 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-ink">"{name}"</span>?
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
              onClick={() => setShowDelete(false)}
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
