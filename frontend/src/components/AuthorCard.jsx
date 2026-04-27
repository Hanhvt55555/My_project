import { Link } from 'react-router-dom'

export default function AuthorCard({ author, onEdit, onDelete }) {
  const { _id, name, year, books = [] } = author
  const hasActions = onEdit || onDelete

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="group bg-white rounded-2xl p-6 border border-parchment-dark shadow-sm hover:shadow-md hover:border-green-mid transition-all flex flex-col">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-green-deep text-white font-serif font-bold text-lg flex items-center justify-center shrink-0 group-hover:bg-amber transition-colors">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            to={`/authors/${_id}`}
            className="font-serif font-bold text-lg text-ink leading-tight truncate block hover:text-green-deep transition-colors"
          >
            {name}
          </Link>
          <p className="text-ink/50 text-sm mt-0.5">b. {year}</p>
        </div>
      </div>

      {books.length > 0 && (
        <p className="mt-4 text-ink/40 text-xs font-semibold tracking-wide uppercase">
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </p>
      )}

      {hasActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-parchment-dark">
          {onEdit && (
            <button
              onClick={() => onEdit(author)}
              className="flex-1 text-xs font-semibold text-green-deep border border-green-deep/30 hover:bg-green-deep hover:text-white py-1.5 rounded-full transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(author)}
              className="flex-1 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white py-1.5 rounded-full transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
