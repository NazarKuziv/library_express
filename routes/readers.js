var express = require('express');
const Readers = require('../models/Reader');
var router = express.Router();

router.get('/:id', async (req, res) => {
   const reader = await Readers.findOne({ where: { id: req.params.id }, raw: true })
   console.log('reader', reader)
   res.json(reader);
})

router.get('', async (req, res) => {
   const readers = await Readers.findAll({ raw: true })
   if (req.headers['accept'] === 'application/json') {
      return res.json(readers)
   }
   res.render('readers', { readers });
})


module.exports = router