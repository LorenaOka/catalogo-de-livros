const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    // log para verificar a solicitacao recebida
    console.log('Page:', page, 'Limit:', limit);

    // aqui ele busca livros do banco de dados
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit);

    // conta o numero total de documentos na colecao "books"
    const count = await Book.countDocuments();
    
    // aqui ele calcula o total de livros exibidos ate a pagina atual
    const totalDisplayed = page * limit;

    // log dos livros recuperados e o total de livros
    console.log('Books:', books);
    console.log('Total Books:', count);

    // renderiza a view "index", passando os livros buscados e informacoes de paginacao
    res.render('index', {
      books: books,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalBooks: count,
      totalDisplayed: Math.min(totalDisplayed, count)
    });
  } catch (err) {
    // log do erro
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
