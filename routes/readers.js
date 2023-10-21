var express = require('express');
const { Op } = require('sequelize');
const Readers = require('../models/Reader');
var router = express.Router();
const passport = require('passport');
router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.post('/search', async (req, res) => {
   const reader = await Readers.findAll({ where: { name: { [Op.like]: `%${req.body.term.term}%` } } })
   const json = JSON.stringify(reader);
   res.json(json);
})

router.get('/:id', async (req, res) => {
   console.log(req.params.id);
   const reader = await Readers.findOne({ where: { id: req.params.id } })
   const json = JSON.stringify(reader);
   res.json(json);
})

router.get('', async (req, res) => {
   const readers = await Readers.findAll({ raw: true })
   if (req.headers['accept'] === 'application/json') {
      return res.json(readers)
   }
   res.render('readers', { readers });
})

router.post('', async (req, res) => {
   const { name, email, address, phone_number, penalty } = req.body;

   console.log(req.body);
   let error = { email: '', phone_number: '' };

   let reader = await Readers.findOne({ where: { email: email } })
   if (reader) {
      error.email = `Читач з електронною адресою ${email} вже існує`;
   }

   reader = await Readers.findOne({ where: { phone_number: phone_number } })
   if (reader) {
      error.phone_number = `Читач з тел. ${email} вже існує`;
   }

   if (error.email || error.phone_number) {
      return res.status(409).json({ success: false, error: error });
   }

   await Readers.create({ name, email, address, phone_number, penalty });
   res.status(201).json({ success: true, message: `Додано читача` });
})

router.put('/:id', async (req, res) => {
   const row = await Readers.findOne({ where: { id: req.params.id }, });
   if (row) {
      const { name, email, address, phone_number, penalty } = req.body;
      let error = { email: '', phone_number: '' };

      let reader = await Readers.findOne({
         where:
         {
            email: email,
            id: {
               [Op.not]: req.params.id,
            },
         }
      })

      if (reader) {
         error.email = `Читач з електронною адресою ${email} вже існує`;
      }

      reader = await Readers.findOne({
         where:
         {
            phone_number: phone_number,
            id: {
               [Op.not]: req.params.id,
            },
         }
      })

      if (reader) {
         error.phone_number = `Читач з тел. ${email} вже існує`;
      }

      if (error.email || error.phone_number) {
         return res.status(409).json({ success: false, error: error });
      }

      await Readers.update({ name, email, address, phone_number, penalty }, { where: { id: req.params.id } });
      res.status(201).json({ success: true, message: `Оновлено читача` });
   } else {
      res.status(404).json({ success: false, message: `Читача з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.delete('/:id', async (req, res) => {
   const row = await Readers.findOne({ where: { id: req.params.id }, });

   if (row) {
      await row.destroy();
      res.status(204).json({ success: `Читача з ідентифікатором ${req.params.id} видалено` });
   } else {
      res.status(404).json({ error: `Читача з ідентифікатором ${req.params.id} не знайдено` });
   }
})

module.exports = router