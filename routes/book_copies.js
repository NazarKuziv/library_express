var express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const Author = require('../models/Author');
const Book_Copy = require('../models/Book_Copy');
const Publisher = require('../models/Publisher');
const { Op } = require('sequelize');
var router = express.Router();
const passport = require('passport');
router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, res) => {
   const book_copy = await Book_Copy.findOne({
      where: { id: req.params.id },
      include: [{
         model: Book,
         include: [Category, { model: Author, as: 'authors' }]
      }, Publisher]
   })

   res.render('book_copy', { book_copy });
})

router.get('/get-one/:id', async (req, res) => {
   const book_copy = await Book_Copy.findOne({
      where: { id: req.params.id },
      include: [{
         model: Book,
         include: [Category, { model: Author, as: 'authors' }]
      }, Publisher]
   })
   const json = JSON.stringify(book_copy);
   res.json(json);
})

router.post('/search', async (req, res) => {
   const book_copy = await Book_Copy.findAll({
      where: {
         in_stock: {
            [Op.gt]: 0,
         },
         '$book.title$': { [Op.like]: `%${req.body.term.term}%` }
      },
      include: [{
         model: Book,
         include: [Category, { model: Author, as: 'authors' }]
      }, Publisher]
   })
   const json = JSON.stringify(book_copy);
   res.json(json);
})


router.get('', async (req, res) => {
   const level = req.cookies.level;
   console.log(level);
   if (level < 2) {
      res.redirect('/borrowing');
   }
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

router.post('', async (req, res) => {
   const { year_published, book_id, publisher_id, number_of_copies, in_stock, language } = req.body;
   await Book_Copy.create({ year_published, book_id, publisher_id, number_of_copies, in_stock, language });
   res.status(201).json({ success: `Додано Книгу` });
})

router.put('/:id', async (req, res) => {
   const row = await Book_Copy.findOne({ where: { id: req.params.id }, });
   if (row) {
      const { year_published, book_id, publisher_id, number_of_copies, in_stock, language } = req.body;
      await Book_Copy.update({ year_published, book_id, publisher_id, number_of_copies, in_stock, language }, { where: { id: req.params.id } });
      res.status(201).json({ success: `Оновлено Книгу` });
   } else {
      res.status(404).json({ error: `Книгу з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.delete('/:id', async (req, res) => {
   const row = await Book_Copy.findOne({ where: { id: req.params.id }, });

   if (row) {
      await row.destroy();
      res.status(204).json({ success: `Книгу з ідентифікатором ${req.params.id} видалено` });
   } else {
      res.status(404).json({ error: `Книгу з ідентифікатором ${req.params.id} не знайдено` });
   }
})

module.exports = router