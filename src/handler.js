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
  } else if (name === undefined) {
    const respons = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    respons.code(400)
    return respons
  } else {
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
    } else {
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
  }
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
  } else if (name) {
    const BooksName = books.filter((book) => {
      const nameRegex = new RegExp(name)
      return nameRegex.test(book.name)
    })
    const respons = h.response({
      status: 'success',
      data: {
        books: BooksName.map((book) => ({
          id: books.id,
          name: books.name,
          publisher: books.publisher
        }))
      }
    }).code(200)
    return respons
  } else if (reading) {
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
  } else {
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
