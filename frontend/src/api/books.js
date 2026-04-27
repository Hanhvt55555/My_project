const BASE = '/v1/book'

export async function getAllBooks() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch books')
  return res.json()
}

export async function getBook(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Failed to fetch book')
  return res.json()
}

export async function createBook(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create book')
  return res.json()
}

export async function updateBook(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update book')
  return res.json()
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete book')
  return res.json()
}
