const { addBooksHandler, getAllbooksHandler, getBooksbyIdHandler, editBooksByIdHandler, deleteBooksByIdHandler } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllbooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBooksbyIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBooksByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBooksByIdHandler
  }

]

module.exports = routes
