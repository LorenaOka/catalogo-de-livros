const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalBooks = await Book.countDocuments({});
    const books = await Book.find().skip(skip).limit(limit);
    const totalDisplayed = books.length;
    const start = skip + 1;
    const end = skip + totalDisplayed;

    res.render('index', {
      books,
      currentPage: page,
      totalBooks,
      totalDisplayed,
      start,
      end,
      totalPages: Math.ceil(totalBooks / limit)
    });
  } catch (err) {
    res.status(500).send('Erro ao buscar livros');
  }
});

module.exports = router;