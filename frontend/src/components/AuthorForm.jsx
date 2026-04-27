import { useState } from 'react'

export default function AuthorForm({ initial = {}, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    year: initial.year ?? '',
  })

  function handle(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function submit(e) {
    e.preventDefault()
    onSubmit({ name: form.name, year: Number(form.year) })
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-ink/50 uppercase tracking-widest mb-1.5">
          Name <span className="text-amber">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handle}
          required
          placeholder="e.g. George Orwell"
          className="w-full border border-parchment-dark rounded-xl px-4 py-2.5 text-ink text-sm outline-none focus:border-green-mid transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink/50 uppercase tracking-widest mb-1.5">
          Birth Year <span className="text-amber">*</span>
        </label>
        <input
          name="year"
          type="number"
          value={form.year}
          onChange={handle}
          required
          placeholder="e.g. 1903"
          className="w-full border border-parchment-dark rounded-xl px-4 py-2.5 text-ink text-sm outline-none focus:border-green-mid transition-colors"
        />
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
