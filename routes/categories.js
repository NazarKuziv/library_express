var express = require('express');
const Categories = require('../models/Category');
var router = express.Router();
const { Op } = require('sequelize');

router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, res) => {
   const category = await Categories.findOne({ where: { id: req.params.id } })
   const json = JSON.stringify(category);
   console.log('category', json)
   res.json(category);
})
router.post('/search', async (req, res) => {

   const category = await Categories.findAll({ where: { name: { [Op.like]: `%${req.body.term.term}%` } } })
   const json = JSON.stringify(category);
   res.json(json);
})

router.get('', async (req, res) => {
   const categories = await Categories.findAll()
   if (req.headers['accept'] === 'application/json') {
      return res.json(categories)
   }
   res.render('categories', { categories });
})

router.post('', async (req, res) => {
   const { name } = req.body;
   await Categories.create({ name });
   res.status(201).json({ success: `Додано Жанр` });
})

router.put('/:id', async (req, res) => {
   const row = await Categories.findOne({ where: { id: req.params.id }, });
   if (row) {
      const { name } = req.body;
      await Categories.update({ name }, { where: { id: req.params.id } });
      res.status(201).json({ success: `Оновлено Жанр` });
   } else {
      res.status(404).json({ error: `Жанр з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.delete('/:id', async (req, res) => {
   const row = await Categories.findOne({ where: { id: req.params.id }, });

   if (row) {
      await row.destroy();
      res.status(204).json({ success: `Жанр з ідентифікатором ${req.params.id} видалено` });
   } else {
      res.status(404).json({ error: `Жанр з ідентифікатором ${req.params.id} не знайдено` });
   }
})


module.exports = router