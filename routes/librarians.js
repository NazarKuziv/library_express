var express = require('express');
const Librarian = require('../models/Librarian');
const Level = require('../models/Level');
var router = express.Router();

router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, res) => {
   const librarian = await Librarian.findOne({ where: { id: req.params.id }, include: Level, raw: true })
   console.log('librarian', librarian)
   res.json(librarian);
})

router.get('', async (req, res) => {
   const librarians = await Librarian.findAll({ include: Level, raw: true })
   if (req.headers['accept'] === 'application/json') {
      return res.json(librarians)
   }
   res.render('librarians', { librarians });
})


router.post('', async (req, res) => {
   const { name, email, password, address, phone_number, level_id } = req.body;
   let error = { email: '', phone_number: '' };
   let librarian = await Librarian.findOne({ where: { email: email } })

   if (librarian) {
      error.email = `Бібліотекар з електронною адресою ${email} вже існує`;
   }

   librarian = await Librarian.findOne({ where: { phone_number: phone_number } })
   if (librarian) {
      error.phone_number = `Бібліотекар з тел. ${email} вже існує`;
   }

   if (error.email || error.phone_number) {
      return res.status(409).json(error);
   }

   await Librarian.create({ name, email, password, address, phone_number, level_id });
   res.status(201).json({ success: `Додано бібліотекаря` });
})

router.put('/:id', async (req, res) => {
   const row = await Librarian.findOne({ where: { id: req.params.id }, });
   if (row) {

      res.send('Бібліотекаря з id ' + req.params.id + ' оновлено')
   } else {
      res.status(404).json({ error: `Бібліотекаря з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.delete('/:id', async (req, res) => {
   const row = await Librarian.findOne({ where: { id: req.params.id }, });

   if (row) {
      await row.destroy();
      res.status(204).json({ success: `Бібліотекаря з ідентифікатором ${req.params.id} видалено` });
   } else {
      res.status(404).json({ error: `Бібліотекаря з ідентифікатором ${req.params.id} не знайдено` });
   }
})

module.exports = router