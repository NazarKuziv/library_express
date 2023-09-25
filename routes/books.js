var express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const Author = require('../models/Author');
var router = express.Router();

router.get('/:id', async (req, res) => {
   const book = await Book.findOne({ where: { id: req.params.id }, include: [Category, { model: Author, as: 'authors' }] })
   const json = JSON.stringify(book);
   console.log('book', json)
   res.json(book);
})

router.get('', async (req, res) => {
   const books = await Book.findAll({ include: [Category, { model: Author, as: 'authors' }] })
   if (req.headers['accept'] === 'application/json') {
      return res.json(books)
   }
   res.render('books', { books });
})


module.exports = router