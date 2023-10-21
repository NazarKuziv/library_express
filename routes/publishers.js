var express = require('express');
const Publisher = require('../models/Publisher');
const { Op } = require('sequelize');
var router = express.Router();

router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, res) => {
   const publisher = await Publisher.findOne({ where: { id: req.params.id } })
   const json = JSON.stringify(publisher);
   console.log('publishers', json)
   res.json(publisher);
})

router.post('/search', async (req, res) => {
   console.log(req.body)
   const publisher = await Publisher.findAll({ where: { name: { [Op.like]: `%${req.body.term.term}%` } } })
   const json = JSON.stringify(publisher);
   res.json(json);
})

router.get('', async (req, res) => {
   const publishers = await Publisher.findAll()
   if (req.headers['accept'] === 'application/json') {
      return res.json(publishers)
   }
   res.render('publishers', { publishers });
})

router.post('', async (req, res) => {
   const { name } = req.body;
   await Publisher.create({ name });
   res.status(201).json({ success: `Додано видавництво` });
})

router.put('/:id', async (req, res) => {
   const row = await Publisher.findOne({ where: { id: req.params.id }, });
   if (row) {
      const { name } = req.body;
      await Publisher.update({ name }, { where: { id: req.params.id } });
      res.status(201).json({ success: `Оновлено вилавництво` });
   } else {
      res.status(404).json({ error: `Вилавництво з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.delete('/:id', async (req, res) => {
   const row = await Publisher.findOne({ where: { id: req.params.id }, });

   if (row) {
      await row.destroy();
      res.status(204).json({ success: `Вилавництво з ідентифікатором ${req.params.id} видалено` });
   } else {
      res.status(404).json({ error: `Вилавництво з ідентифікатором ${req.params.id} не знайдено` });
   }
})


module.exports = router