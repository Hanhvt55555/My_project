const BASE = '/v1/author'

export async function getAllAuthors() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch authors')
  return res.json()
}

export async function getAuthor(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Failed to fetch author')
  return res.json()
}

export async function createAuthor(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create author')
  return res.json()
}

export async function updateAuthor(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update author')
  return res.json()
}

export async function deleteAuthor(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete author')
  return res.json()
}
