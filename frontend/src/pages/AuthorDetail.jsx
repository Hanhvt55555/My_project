import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BookCard from '../components/BookCard'
import Modal from '../components/Modal'
import AuthorForm from '../components/AuthorForm'
import { getAuthor, updateAuthor, deleteAuthor } from '../api/authors'

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-parchment-dark border-t-amber rounded-full animate-spin" />
    </div>
  )
}

export default function AuthorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [author, setAuthor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchAuthor = useCallback(() => {
    setLoading(true)
    getAuthor(id)
      .then(setAuthor)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { fetchAuthor() }, [fetchAuthor])

  async function handleEdit(data) {
    setSaving(true)
    try {
      await updateAuthor(id, data)
      await fetchAuthor()
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
      await deleteAuthor(id)
      navigate('/authors')
    } catch (e) {
      alert(e.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="bg-parchment min-h-screen"><Spinner /></div>
  if (error || !author)
    return (
      <div className="bg-parchment min-h-screen flex items-center justify-center">
        <p className="text-ink/40">{error ?? 'Author not found.'}</p>
      </div>
    )

  const { name, year, books = [] } = author

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <>
      <div className="bg-parchment min-h-screen">
        {/* Header */}
        <div className="bg-green-deep py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              to="/authors"
              className="text-white/50 hover:text-white text-sm transition-colors mb-6 inline-flex items-center gap-1"
            >
              ← Back to Authors
            </Link>
            <div className="flex items-end justify-between gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-amber text-white font-serif font-black text-2xl flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div>
                  <h1 className="font-serif text-4xl md:text-5xl font-black text-white">{name}</h1>
                  {year && <p className="text-white/50 text-sm mt-1">Born {year}</p>}
                </div>
              </div>
              {/* Action buttons */}
              <div className="flex gap-3 shrink-0">
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

        {/* Books */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-ink">
              Books by {name}
            </h2>
            <span className="text-ink/40 text-sm">
              {books.length} {books.length === 1 ? 'book' : 'books'}
            </span>
          </div>

          {books.length === 0 ? (
            <p className="text-ink/40 py-10 text-center">No books in the collection yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {books.map((book) => (
                <BookCard
                  key={book._id ?? book}
                  book={typeof book === 'object' ? book : { _id: book, name: 'Unknown' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <Modal title="Edit Author" onClose={() => setShowEdit(false)}>
          <AuthorForm
            initial={author}
            onSubmit={handleEdit}
            onCancel={() => setShowEdit(false)}
            saving={saving}
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {showDelete && (
        <Modal title="Delete Author" onClose={() => setShowDelete(false)}>
          <p className="text-ink/70 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-ink">"{name}"</span>?
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
