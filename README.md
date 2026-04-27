# Wild Reads — Book Collection App

A full-stack web application for managing a personal book collection, built with **Express + MongoDB** on the backend and **React + Tailwind CSS** on the frontend.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | Node.js, Express 5, Mongoose 9          |
| Database   | MongoDB Atlas                           |
| Frontend   | React 18, Vite, Tailwind CSS v3         |
| Routing    | React Router v6                         |

---

## Features

- Browse, search, and filter books by genre
- View author profiles and their book collections
- Full CRUD: Add / Edit / Delete books and authors
- Responsive design — works on desktop and mobile

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Hanhvt55555/My_project.git
cd My_project
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```
PORT=8000
MONGO_URI=<your MongoDB Atlas connection string>
```

> You need a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account. Create a cluster, get the connection string, and paste it as `MONGO_URI`.

### 3. Install dependencies

```bash
# Backend dependencies (project root)
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 4. Run the app

```bash
npm run dev
```

This starts both the backend (port 8000) and the frontend (port 5173) with a single command.

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
├── index.js                  # Entry point — DB connect, middleware, routes
├── model/model.js            # Mongoose schemas: Author + Book
├── routes/
│   ├── author.js
│   └── book.js
├── controllers/
│   ├── authorController.js
│   └── bookController.js
└── frontend/
    └── src/
        ├── api/              # Fetch wrappers (books.js, authors.js)
        ├── components/       # Reusable UI components
        └── pages/            # Route pages (Home, Books, Authors, ...)
```

---

## API Endpoints

Base URL: `http://localhost:8000/v1`

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| GET    | `/author`         | Get all authors                    |
| GET    | `/author/:id`     | Get a single author (with books)   |
| POST   | `/author`         | Create a new author                |
| PUT    | `/author/:id`     | Update an author                   |
| DELETE | `/author/:id`     | Delete an author                   |
| GET    | `/book`           | Get all books                      |
| GET    | `/book/:id`       | Get a single book (with author)    |
| POST   | `/book`           | Create a new book                  |
| PUT    | `/book/:id`       | Update a book                      |
| DELETE | `/book/:id`       | Delete a book                      |

---

## Data Models

**Author**
```json
{
  "name": "Nguyễn Nhật Ánh",
  "year": 1955
}
```

**Book**
```json
{
  "name": "Mắt biếc",
  "publishedDate": "1990",
  "genres": ["Romance", "Literary Fiction"],
  "author": "<author_id>"
}
```

> `author` is optional — leave it out or pass an empty string to create a book without an author.
