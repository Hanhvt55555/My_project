import { Link } from 'react-router-dom'

const GENRE_COLORS = [
  'bg-green-deep/10 text-green-deep',
  'bg-amber/10 text-amber',
  'bg-purple-700/10 text-purple-700',
  'bg-blue-700/10 text-blue-700',
  'bg-rose-700/10 text-rose-700',
]

function genreColor(index) {
  return GENRE_COLORS[index % GENRE_COLORS.length]
}

export default function BookCard({ book, onEdit, onDelete }) {
  const { _id, name, author, genres = [], publishedDate } = book
  const hasActions = onEdit || onDelete

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-parchment-dark flex flex-col">
      <div className="h-2 bg-green-deep group-hover:bg-amber transition-colors" />

      <div className="p-5 flex flex-col flex-1">
        <Link
          to={`/books/${_id}`}
          className="font-serif font-bold text-xl text-ink leading-snug mb-2 line-clamp-2 hover:text-green-deep transition-colors block"
        >
          {name}
        </Link>

        {author && (
          <p className="text-ink/50 text-sm mb-3 font-sans">
            {typeof author === 'object' ? author.name : 'Unknown Author'}
          </p>
        )}

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {genres.slice(0, 3).map((g, i) => (
              <span
                key={g}
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${genreColor(i)}`}
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {publishedDate && (
          <p className="text-ink/40 text-xs font-sans mt-auto">{publishedDate}</p>
        )}

        {hasActions && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-parchment-dark">
            {onEdit && (
              <button
                onClick={(e) => { e.preventDefault(); onEdit(book) }}
                className="flex-1 text-xs font-semibold text-green-deep border border-green-deep/30 hover:bg-green-deep hover:text-white py-1.5 rounded-full transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.preventDefault(); onDelete(book) }}
                className="flex-1 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white py-1.5 rounded-full transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
