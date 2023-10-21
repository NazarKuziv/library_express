var express = require('express');
const Author = require('../models/Author');
var router = express.Router();
const { Op } = require('sequelize');

router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, res) => {
   const author = await Author.findOne({ where: { id: req.params.id } })
   const json = JSON.stringify(author);
   console.log('author', json)
   res.json(author);
})

router.post('/search', async (req, res) => {

   const author = await Author.findAll({ where: { name: { [Op.like]: `%${req.body.term.term}%` } } })
   const json = JSON.stringify(author);
   res.json(json);
})

router.get('', async (req, res) => {
   const authors = await Author.findAll()
   if (req.headers['accept'] === 'application/json') {
      return res.json(authors)
   }
   res.render('authors', { authors });
})

router.post('', async (req, res) => {
   const { name } = req.body;
   await Author.create({ name });
   res.status(201).json({ success: `Додано автора` });
})

router.put('/:id', async (req, res) => {
   const row = await Author.findOne({ where: { id: req.params.id }, });
   if (row) {
      const { name } = req.body;
      await Author.update({ name }, { where: { id: req.params.id } });
      res.status(201).json({ success: `Оновлено автора` });
   } else {
      res.status(404).json({ error: `Автора з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.delete('/:id', async (req, res) => {
   const row = await Author.findOne({ where: { id: req.params.id }, });

   if (row) {
      await row.destroy();
      res.status(204).json({ success: `Автора з ідентифікатором ${req.params.id} видалено` });
   } else {
      res.status(404).json({ error: `Автора з ідентифікатором ${req.params.id} не знайдено` });
   }
})


module.exports = router