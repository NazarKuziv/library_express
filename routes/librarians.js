var express = require('express');
const { Op } = require('sequelize');
const Librarian = require('../models/Librarian');
const Level = require('../models/Level');
var router = express.Router();
const passport = require('passport');
const bcrypt = require("bcryptjs");
router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.post('/search', async (req, res) => {
   const librarian = await Librarian.findAll({ where: { name: { [Op.like]: `%${req.body.term.term}%` } }, include: Level })
   const json = JSON.stringify(librarian);
   res.json(json);
})
router.get('/:id', async (req, res) => {
   const librarian = await Librarian.findOne({ where: { id: req.params.id } })
   const json = JSON.stringify(librarian);
   res.json(json);
})

router.get('', async (req, res) => {
   const level = req.cookies.level;
   console.log(level);
   if (level < 3) {
      res.redirect('/borrowing');
   }
   const librarians = await Librarian.findAll({ include: Level, raw: true })
   if (req.headers['accept'] === 'application/json') {
      return res.json(librarians)
   }
   res.render('librarians', { librarians });
})


router.post('', async (req, res) => {
   const { name, email, pass, address, phone_number, level_id } = req.body;
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
      return res.status(409).json({ success: false, error: error });
   }
   bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(pass, salt, async (err, hash) => {
         if (err) { throw err; }
         password = hash
         await Librarian.create({ name, email, password, address, phone_number, level_id });
      })
   })

   res.status(201).json({ success: true, message: `Додано бібліотекаря` });
})

router.put('/:id', async (req, res) => {
   const row = await Librarian.findOne({ where: { id: req.params.id }, });
   if (row) {
      const { name, email, password, address, phone_number, level_id } = req.body;
      let error = { email: '', phone_number: '' };

      let librarian = await Librarian.findOne({
         where:
         {
            email: email,
            id: {
               [Op.not]: req.params.id,
            },
         }
      })

      if (librarian) {
         error.email = `Бібліотекар з електронною адресою ${email} вже існує`;
      }

      librarian = await Librarian.findOne({
         where:
         {
            phone_number: phone_number,
            id: {
               [Op.not]: req.params.id,
            },
         }
      })

      if (librarian) {
         error.phone_number = `Бібліотекар з тел. ${email} вже існує`;
      }

      if (error.email || error.phone_number) {
         return res.status(409).json({ success: false, error: error });
      }

      await Librarian.update({ name, email, password, address, phone_number, level_id }, { where: { id: req.params.id } });
      res.status(201).json({ success: true, message: `Оновлено бібліотекаря` });
   } else {
      res.status(404).json({ success: false, message: `Бібліотекаря з ідентифікатором ${req.params.id} не знайдено` });
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