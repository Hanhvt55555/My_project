# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A book collection web application — Express + MongoDB (Atlas) backend with two resources: `Author` and `Book`, paired with a React frontend. Visual direction is inspired by **Wild Cities** (godly.website): bold serif typography, deep forest-green palette, warm parchment backgrounds, and organic botanical motifs — adapted into a literary aesthetic called **Wild Reads**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (CommonJS) |
| Backend | Express 5, Mongoose 9 |
| Database | MongoDB Atlas |
| Backend middleware | body-parser, cors, morgan, dotenv |
| Frontend | React 18 (Vite), React Router v6 |
| Styling | Tailwind CSS v3 |
| HTTP client | fetch (native) |

---

## Key Commands

```bash
# Backend (project root)
npm install          # install backend dependencies
npm start            # start API server on port 8000 (node index.js)

# Frontend (frontend/ directory)
cd frontend
npm install          # install frontend dependencies
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # production build → frontend/dist/
```

No `nodemon` / `npm run dev` script is configured for the backend — add it manually if needed.

---

## Project Structure

```
index.js                            # Entry: DB connect, middleware, route mounting
model/model.js                      # Mongoose schemas: Author + Book (one file)
routes/author.js                    # /v1/author → authorController
routes/book.js                      # /v1/book   → bookController
controllers/authorController.js
controllers/bookController.js

frontend/
  index.html
  vite.config.js
  tailwind.config.js
  src/
    main.jsx                        # React entry, wraps <App> in BrowserRouter
    App.jsx                         # Route definitions
    api/
      books.js                      # fetch wrappers for /v1/book
      authors.js                    # fetch wrappers for /v1/author
    pages/
      Home.jsx                      # Hero + featured books + author spotlight
      Books.jsx                     # Browse all books with genre filter + search
      Authors.jsx                   # Authors grid
      BookDetail.jsx                # Single book + populated author
      AuthorDetail.jsx              # Single author + their books grid
    components/
      Navbar.jsx                    # Top nav: logo, links, search icon
      Hero.jsx                      # Full-bleed hero with large heading + CTA
      BookCard.jsx                  # Book thumbnail, title, author, genre chips
      AuthorCard.jsx                # Author name, birth year, book count
      GenreFilter.jsx               # Horizontal scrollable genre pill buttons
      Footer.jsx                    # Links, copyright
```

---

## REST API Endpoints

Base path: `/v1`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/author` | Create author |
| GET | `/v1/author` | All authors |
| GET | `/v1/author/:id` | Single author (populates `books`) |
| PUT | `/v1/author/:id` | Update author |
| DELETE | `/v1/author/:id` | Delete author + nullifies book references |
| POST | `/v1/book` | Create book; pushes ID onto `author.books` |
| GET | `/v1/book` | All books |
| GET | `/v1/book/:id` | Single book (populates `author`) |
| PUT | `/v1/book/:id` | Update book |
| DELETE | `/v1/book/:id` | Delete book; pulls ID from all `author.books` |

---

## Data Models (`model/model.js`)

Both schemas live in one file and export `{ Book, Author }`.

**Author**: `name` (String, required), `year` (Number, required), `books` ([ObjectId → Book])

**Book**: `name` (String, required), `publishedDate` (String), `genres` ([String]), `author` (ObjectId → Author)

The relationship is bidirectional and manually maintained: creating a book pushes its `_id` into the author's `books` array; deleting a book pulls its `_id` back out.

---

## Frontend Design System (Wild Reads)

Inspired by the **Wild Cities** design on godly.website: large bold serif headings, deep forest green, warm parchment, amber CTAs, and organic botanical decorations translated into a literary bookstore feel.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `green-deep` | `#1A3D2B` | Primary background (hero, navbar, footer) |
| `green-mid` | `#2C6B4A` | Hover states, section accents |
| `parchment` | `#F5F0E8` | Page background, card backgrounds |
| `parchment-dark` | `#EAE3D2` | Borders, subtle dividers |
| `amber` | `#E8844A` | CTA buttons, genre pill active state |
| `amber-light` | `#F5A96B` | Button hover |
| `ink` | `#1C1C1C` | Body text |
| `white` | `#FFFFFF` | Text on dark backgrounds |

### Typography

| Role | Font | Weight | Size (desktop) |
|------|------|--------|---------------|
| Display heading | Playfair Display (serif) | 700–900 | 4–7rem |
| Section heading | Playfair Display | 600 | 2–3rem |
| Body / UI | DM Sans | 400–500 | 1rem |
| Label / chip | DM Sans | 600 | 0.75rem |

Load both fonts from Google Fonts in `index.html`.

### Page Layouts

**Home (`/`)**
- Full-bleed hero: `green-deep` background, large Playfair heading ("Explore Wild Reads"), botanical SVG decoration (branch/leaf), amber "Browse Books" CTA button.
- Featured Books row: 3–4 `BookCard` components on `parchment` background.
- Author Spotlight: single `AuthorCard` with quote / book count, green accent section.
- Genre strip: `GenreFilter` with all unique genres from API.

**Books (`/books`)**
- `GenreFilter` tabs at top; clicking a genre filters the grid client-side.
- Search input (filter by book name).
- Responsive grid of `BookCard` components (3 cols desktop → 2 tablet → 1 mobile).

**Authors (`/authors`)**
- Responsive grid of `AuthorCard` components.

**Book Detail (`/books/:id`)**
- Large title (Playfair), published date, genre chips.
- Author section: name links to `/authors/:id`.
- "Back to books" link.

**Author Detail (`/authors/:id`)**
- Author name + birth year.
- Grid of their books using `BookCard`.

### Component Conventions

- All components are functional with hooks; no class components.
- Fetch calls live in `src/api/` (not inside components) and return the parsed JSON.
- Loading state: show a parchment-colored skeleton or spinner.
- Error state: show a minimal inline message (no full-page crash).
- `GenreFilter` receives `genres: string[]` and `active: string` as props, emits `onSelect(genre)`.
- `BookCard` and `AuthorCard` wrap in a `<Link>` from React Router for navigation.

---

## Known Bugs

- **`controllers/bookController.js` line 10**: `Author.findById(req.body.author)` is missing `await`, so `author` is a Promise and the subsequent `updateOne` call fails silently when an author ID is supplied.
- **`controllers/authorController.js` line 50**: The `updateMany` filter uses `{authors: req.params.id}` but the Book schema field is `author` (singular), so book author references are never nullified on author deletion.

---

## Configuration

The MongoDB Atlas connection string is currently hardcoded in `index.js`. Move it to `.env` and reference it via `process.env.MONGO_URI`. `dotenv` is already imported and `dotenv.config()` is already called — only the connection string needs updating.

`.env` file (create at project root):
```
PORT=8000
MONGO_URI=<your Atlas connection string>
```

Vite proxies API calls in development so the frontend can call `/v1/...` without hardcoding the port. Add to `frontend/vite.config.js`:
```js
server: {
  proxy: {
    '/v1': 'http://localhost:8000'
  }
}
```
