const { nanoid } = require('nanoid')
const { books } = require('./books')

const addBooksHandler = (requests, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = requests.payload
  if (readPage > pageCount) {
    const respons = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    respons.code(400)
    return respons
  }
  if (!name) {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    respons.code(400)
    return respons
  }
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
  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
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
  const respons = h.response({
    status: 'fail',
    message: 'gagal menambahkan Buku',
    data: {
      bookId: id
    }
  })
  respons.code(404)
  return respons
}

const getAllbooksHandler = (requests, h) => {
  const { name, reading, finished } = requests.query
  if (!name && !reading && !finished) {
    const respons = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }).code(200)
    return respons
  }
  if (name) {
    const BooksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const respons = h.response({
      status: 'success',
      data: {
        books: BooksName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }).code(200)
    return respons
  }
  if (reading) {
    const booksReading = books.filter((book) => Number(book.reading) === Number(reading))
    const respons = h.response({
      status: 'success',
      data: {
        books: booksReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }).code(200)
    return respons
  }
  const finishedBooks = books.filter((book) => book.finished === (finished === '1'))
  const respons = h.response({
    status: 'success',
    data: {
      books: finishedBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }).code(200)
  return respons
}

const getBooksbyIdHandler = (requests, h) => {
  const { bookId } = requests.params
  const book = books.filter((b) => b.id === bookId)[0]
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }
  const respons = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  respons.code(404)
  return respons
}

const editBooksByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const index = books.findIndex((book) => book.id === bookId)
  if (index === -1) {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    respons.code(404)
    return respons
  }
  if (!name) {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    respons.code(400)
    return respons
  }
  if (readPage > pageCount) {
    const respons = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    respons.code(400)
    return respons
  }

  const finished = pageCount === readPage
  const updatedAt = new Date().toDateString()
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt
  }
  const respons = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  })
  respons.code(200)
  return respons
}

const deleteBooksByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)
  if (index !== -1) {
    books.splice(index, 1)
    const respons = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    respons.code(200)
    return respons
  }

  const respons = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  respons.code(404)
  return respons
}

module.exports = { addBooksHandler, getAllbooksHandler, getBooksbyIdHandler, editBooksByIdHandler, deleteBooksByIdHandler }
