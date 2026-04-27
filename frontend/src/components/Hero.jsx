import { Link } from 'react-router-dom'

function BotanicalSvg({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main stem */}
      <path
        d="M130 380 C125 300 115 260 95 210 C75 160 40 90 10 30"
        stroke="#2C6B4A" strokeWidth="5" fill="none" strokeLinecap="round"
      />
      {/* Left branch */}
      <path
        d="M95 210 C70 195 30 190 5 200"
        stroke="#2C6B4A" strokeWidth="3.5" fill="none" strokeLinecap="round"
      />
      {/* Left branch leaf */}
      <ellipse cx="4" cy="200" rx="14" ry="8" fill="#2C6B4A" transform="rotate(-20 4 200)" />
      {/* Right branch mid */}
      <path
        d="M75 165 C100 145 130 140 155 148"
        stroke="#2C6B4A" strokeWidth="3" fill="none" strokeLinecap="round"
      />
      <ellipse cx="157" cy="148" rx="14" ry="7" fill="#2C6B4A" transform="rotate(15 157 148)" />
      {/* Small left twig */}
      <path
        d="M40 90 C20 75 5 75 0 80"
        stroke="#2C6B4A" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <ellipse cx="0" cy="80" rx="10" ry="6" fill="#2C6B4A" transform="rotate(-35 0 80)" />
      {/* Top leaf cluster */}
      <path
        d="M10 30 C-5 15 -5 0 5 0"
        stroke="#2C6B4A" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      <ellipse cx="5" cy="0" rx="10" ry="6" fill="#2C6B4A" transform="rotate(-50 5 0)" />
      {/* Right accent branch */}
      <path
        d="M115 260 C145 248 170 250 185 260"
        stroke="#2C6B4A" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <ellipse cx="186" cy="261" rx="13" ry="7" fill="#2C6B4A" transform="rotate(20 186 261)" />
      {/* Small dot accent */}
      <circle cx="115" cy="130" r="5" fill="#2C6B4A" opacity="0.5" />
      <circle cx="60" cy="55" r="4" fill="#2C6B4A" opacity="0.4" />
      <circle cx="155" cy="200" r="3" fill="#2C6B4A" opacity="0.3" />
    </svg>
  )
}

export default function Hero({ title, subtitle, ctaLabel, ctaTo }) {
  return (
    <section className="relative bg-green-deep overflow-hidden min-h-[88vh] flex items-center">
      {/* Botanical decorations */}
      <BotanicalSvg className="absolute left-0 bottom-0 w-48 md:w-72 opacity-60 pointer-events-none select-none" />
      <BotanicalSvg className="absolute right-0 top-0 w-40 md:w-64 opacity-40 pointer-events-none select-none rotate-180" />

      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#2C6B4A33,_transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
        <p className="text-amber font-semibold tracking-widest text-sm uppercase mb-6">
          Book Collection
        </p>

        <h1 className="font-serif text-white font-black leading-none mb-8">
          <span className="block text-6xl md:text-8xl lg:text-9xl">
            {title ?? 'Wild'}
          </span>
          <span className="block text-6xl md:text-8xl lg:text-9xl italic text-amber">
            {subtitle ?? 'Reads.'}
          </span>
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-md mb-10 font-sans">
          Discover authors, explore genres, and dive into stories that take you somewhere wild.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to={ctaTo ?? '/books'}
            className="bg-amber hover:bg-amber-light text-white font-semibold px-8 py-4 rounded-full text-base transition-colors"
          >
            {ctaLabel ?? 'Browse Books'}
          </Link>
          <Link
            to="/authors"
            className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-full text-base transition-colors"
          >
            Meet Authors
          </Link>
        </div>
      </div>
    </section>
  )
}
