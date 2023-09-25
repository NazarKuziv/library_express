var express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const Author = require('../models/Author');
const Book_Copy = require('../models/Book_Copy');
const Publisher = require('../models/Publisher');
var router = express.Router();

router.get('/:id', async (req, res) => {
   const book_copy = await Book_Copy.findOne({
      where: { id: req.params.id },
      include: [{
         model: Book,
         include: [Category, { model: Author, as: 'authors' }]
      }, Publisher]
   })
   console.log('book_copy', book_copy)
   res.json(book_copy);
})

router.get('', async (req, res) => {
   const book_copies = await Book_Copy.findAll({
      include: [{
         model: Book,
         include: [Category, { model: Author, as: 'authors' }]
      }, Publisher]
   })
   if (req.headers['accept'] === 'application/json') {
      return res.json(book_copies)
   }
   res.render('book_copies', { book_copies });
})


module.exports = router