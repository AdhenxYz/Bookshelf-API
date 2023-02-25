const { nanoid } = require('nanoid')
const books = require('./books')

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBooks)

  const isSuccess = books.filter((book) => (book.id = id)).length > 0
  if (!isSuccess) {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku'
    })
    respons.code(500)
    return respons
  } else if (readPage > pageCount) {
    const respons = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    respons.code(400)
    return respons
  } else if (name === undefined) {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    respons.code(400)
    return respons
  } else {
    const respons = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    respons.code(201)
    return respons
  }
}

const getAllbooksHandler = (request, h) => {
  const respons = h.response({
    status: 'success',
    data: {
      books
    }
  })
  respons.code(200)
  return respons
}

const getBooksbyIdHandler = (request, h) => {
  const { id } = request.params
  const bookId = books.filter((book) => book.id === id)[0]
  if (bookId !== undefined) {
    const respons = h.response({
      status: 'success',
      data: {
        bookId
      }
    })
    respons.code(200)
    return respons
  }
  const respons = h.respons({
    status: 'fail',
    message: 'Buku tidak Ditemukan'
  })
  respons.code(404)
  return respons
}

const editBooksByIdHandler = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toDateString()
  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const respons = h.response({
      status: 'success',
      message: 'Buku Berhasil diperbarui'
    })
    respons.code(200)
    return respons
  } else if (name === undefined) {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku, Mohon isi nama buku'
    })
    respons.code(400)
    return respons
  } else if (readPage > pageCount) {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCaount'
    })
    respons.code(400)
    return respons
  } else {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    respons.code(404)
    return respons
  }
}

const deleteBooksByIdHandler = (request, h) => {
  const { id } = request.params
  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    books.slice(index, 1)
    const respons = h.response({
      status: 'success',
      message: 'Buku Berhasil dihapus'
    })
    respons.code(200)
    return respons
  }
  const respons = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. id tidak ditemukan'
  })
  respons.code(404)
  return respons
}

module.exports = { addBooksHandler, getAllbooksHandler, getBooksbyIdHandler, editBooksByIdHandler, deleteBooksByIdHandler }
