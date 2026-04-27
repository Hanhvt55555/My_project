import { useState, useEffect } from 'react'
import { getAllAuthors } from '../api/authors'

export default function BookForm({ initial = {}, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    publishedDate: initial.publishedDate ?? '',
    genres: (initial.genres ?? []).join(', '),
    author: initial.author?._id ?? initial.author ?? '',
  })
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    getAllAuthors().then(setAuthors).catch(console.error)
  }, [])

  function handle(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function submit(e) {
    e.preventDefault()
    const genres = form.genres
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)
    const data = { name: form.name, publishedDate: form.publishedDate, genres }
    if (form.author) data.author = form.author
    onSubmit(data)
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-ink/50 uppercase tracking-widest mb-1.5">
          Title <span className="text-amber">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handle}
          required
          placeholder="e.g. Animal Farm"
          className="w-full border border-parchment-dark rounded-xl px-4 py-2.5 text-ink text-sm outline-none focus:border-green-mid transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink/50 uppercase tracking-widest mb-1.5">
          Author
        </label>
        <select
          name="author"
          value={form.author}
          onChange={handle}
          className="w-full border border-parchment-dark rounded-xl px-4 py-2.5 text-ink text-sm outline-none focus:border-green-mid transition-colors bg-white"
        >
          <option value="">— No author —</option>
          {authors.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink/50 uppercase tracking-widest mb-1.5">
          Published Date
        </label>
        <input
          name="publishedDate"
          value={form.publishedDate}
          onChange={handle}
          placeholder="e.g. 1945"
          className="w-full border border-parchment-dark rounded-xl px-4 py-2.5 text-ink text-sm outline-none focus:border-green-mid transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink/50 uppercase tracking-widest mb-1.5">
          Genres
        </label>
        <input
          name="genres"
          value={form.genres}
          onChange={handle}
          placeholder="Fiction, Satire, Classic"
          className="w-full border border-parchment-dark rounded-xl px-4 py-2.5 text-ink text-sm outline-none focus:border-green-mid transition-colors"
        />
        <p className="text-ink/30 text-xs mt-1">Separate with commas</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-green-deep hover:bg-green-mid text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-parchment-dark text-ink hover:bg-parchment-dark font-semibold py-2.5 rounded-full transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
