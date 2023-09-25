var express = require('express');
const Book = require('../models/Book');
const Book_Copy = require('../models/Book_Copy');
const Publisher = require('../models/Publisher');
const Librarian = require('../models/Librarian');
const Reader = require('../models/Reader');
const Borrowing = require('../models/Borrowing');
var router = express.Router();

router.get('/:id', async (req, res) => {
   const borrowing = await Borrowing.findOne({
      where: { id: req.params.id },
      include: [{
         model: Book_Copy,
         include: [Book, Publisher]
      }, Librarian, Reader]
   })
   console.log('borrowing', borrowing)
   res.json(borrowing);
})

router.get('', async (req, res) => {
   const borrowing = await Borrowing.findAll({
      include: [{
         model: Book_Copy,
         include: [Book, Publisher]
      }, Librarian, Reader]
   })
   if (req.headers['accept'] === 'application/json') {
      return res.json(borrowing)
   }
   res.render('borrowing', { borrowing });
})


module.exports = router