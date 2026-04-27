export default function GenreFilter({ genres, active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => onSelect('')}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          active === ''
            ? 'bg-green-deep text-white'
            : 'bg-parchment-dark text-ink hover:bg-green-deep/10'
        }`}
      >
        All
      </button>

      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            active === genre
              ? 'bg-amber text-white'
              : 'bg-parchment-dark text-ink hover:bg-amber/10'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}
