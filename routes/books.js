var express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const Author = require('../models/Author');
const { Op } = require('sequelize');
var router = express.Router();
const passport = require('passport');
router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.post('/search', async (req, res) => {

   const book = await Book.findAll({ where: { title: { [Op.like]: `%${req.body.term.term}%` } }, include: [Category, { model: Author, as: 'authors' }] })
   const json = JSON.stringify(book);
   res.json(json);
})

router.get('/:id', async (req, res) => {
   const book = await Book.findOne({ where: { id: req.params.id }, include: [Category, { model: Author, as: 'authors' }] })
   const json = JSON.stringify(book);
   res.json(json);
})

router.get('', async (req, res) => {
   const books = await Book.findAll({ include: [Category, { model: Author, as: 'authors' }] })
   if (req.headers['accept'] === 'application/json') {
      return res.json(books)
   }
   res.render('books', { books });
})

router.post('', async (req, res) => {
   const { title, category_id, authorIds } = req.body;
   try {
      const book = await Book.create({ title, category_id });

      // Assuming authorIds is an array of author IDs associated with the book
      if (authorIds && authorIds.length > 0) {
         const authors = await Author.findAll({
            where: {
               id: authorIds, // Assuming authorIds is an array of author IDs
            },
         });

         await book.setAuthors(authors);
      }

      res.status(201).json({ success: 'Додано Книгу', id: book.id });
   } catch (error) {
      res.status(500).json({ error: 'Помилка при додаванні книги' });
   }
})

router.put('/:id', async (req, res) => {
   const row = await Book.findOne({ where: { id: req.params.id }, });
   if (row) {
      const { title, category_id } = req.body;
      await Book.update({ title, category_id }, { where: { id: req.params.id } });
      res.status(201).json({ success: `Оновлено Книгу` });
   } else {
      res.status(404).json({ error: `Книгу з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.delete('/:id', async (req, res) => {
   const row = await Book.findOne({ where: { id: req.params.id }, });

   if (row) {
      await row.destroy();
      res.status(204).json({ success: `Книгу з ідентифікатором ${req.params.id} видалено` });
   } else {
      res.status(404).json({ error: `Книгу з ідентифікатором ${req.params.id} не знайдено` });
   }
})

module.exports = router