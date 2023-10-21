var express = require('express');
var router = express.Router();
const passport = require('passport');
router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));


router.get('/borrowingForm', async (req, res) => {
   res.render('borrowingForm');
})

router.get('/booksForm', async (req, res) => {
   const level = req.cookies.level;
   console.log(level);
   if (level < 2) {
      res.redirect('/borrowing');
   }
   res.render('booksForm');
})

router.get('/readersForm', async (req, res) => {
   res.render('readersForm');
})

router.get('/librariansForm', async (req, res) => {
   const level = req.cookies.level;
   console.log(level);
   if (level < 3) {
      res.redirect('/borrowing');
   }
   res.render('librariansForm');
})


module.exports = router