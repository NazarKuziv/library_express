var express = require('express');
const Book = require('../models/Book');
const Book_Copy = require('../models/Book_Copy');
const Publisher = require('../models/Publisher');
const Librarian = require('../models/Librarian');
const Reader = require('../models/Reader');
const Borrowing = require('../models/Borrowing');
const passport = require('passport');
var router = express.Router();
const ejs = require('ejs');
const path = require('path');


router.use(passport.initialize());
router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, res) => {
   const borrowing = await Borrowing.findOne({
      where: { id: req.params.id },
      include: [{
         model: Book_Copy,
         include: [Book, Publisher]
      }, Librarian, Reader]
   })
   console.log('borrowing', borrowing)
   res.json(borrowing);
})

router.get('', async (req, res) => {

   const borrowing = await Borrowing.findAll({
      include: [{
         model: Book_Copy,
         include: [Book, Publisher]
      }, Librarian, Reader]
   })
   console.log('borrowing')
   res.render('borrowing', { borrowing });

})

router.get('/form', async (req, res) => {
   res.render('form');
})

router.post('', async (req, res) => {

   const { book_id, reader_id, librarian_id, borrowed_date, return_date, returned } = req.body;
   await Borrowing.create({ book_id, reader_id, librarian_id, borrowed_date, return_date, returned });
   Book_Copy.findByPk(book_id)
      .then((recordBook) => {
         if (recordBook) {
            const in_stock = recordBook.in_stock - 1;

            return recordBook.update({ in_stock: in_stock });
         } else {
            console.log('Record not found.'); // Handle the case where the record doesn't exist

         }
      })
      .then((updatedRecordBook) => {
         if (updatedRecordBook) {
            console.log('Record updated successfully.');
         }
      })
   res.status(201).json({ success: `Додано запис до формуляру` });
})

router.put('/:id', async (req, res) => {
   const row = await Borrowing.findOne({ where: { id: req.params.id }, });
   if (row) {
      const { book_id, reader_id, librarian_id, borrowed_date, return_date, returned } = req.body;
      await Borrowing.update({ book_id, reader_id, librarian_id, borrowed_date, return_date, returned }, { where: { id: req.params.id } });
      res.status(201).json({ success: `Оновлено запис формуляру` });
   } else {
      res.status(404).json({ error: `Запис формуляру з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.delete('/:id', async (req, res) => {
   const row = await Borrowing.findOne({ where: { id: req.params.id }, });

   if (row) {
      await row.destroy();
      res.status(204).json({ success: `Запис формуляру з ідентифікатором ${req.params.id} видалено` });
   } else {
      res.status(404).json({ error: `Запис формуляру з ідентифікатором ${req.params.id} не знайдено` });
   }
})

router.get('/return/:id', async (req, res) => {

   // Retrieve the record by its ID, update it, and get the book_id
   const recordIdToUpdate = req.params.id; // Replace with the actual ID you want to update
   const updatedValues = {
      return_date: new Date(), // Set the return_date to the current date
      returned: true, // Set returned to true
   };

   // Use Sequelize to retrieve the record by its ID
   Borrowing.findByPk(recordIdToUpdate)
      .then((record) => {
         if (record) {
            // Get the book_id from the record
            const bookId = record.book_id;
            Book_Copy.findByPk(bookId)
               .then((recordBook) => {
                  if (recordBook) {
                     const in_stock = recordBook.in_stock + 1;

                     return recordBook.update({ in_stock: in_stock });
                  } else {
                     console.log('Record not found.'); // Handle the case where the record doesn't exist

                  }
               })
               .then((updatedRecordBook) => {
                  if (updatedRecordBook) {
                     console.log('Record updated successfully.');
                  }
               })
            // Update the record with the new values
            return record.update(updatedValues);
         } else {
            res.status(404).json({ error: `Запис формуляру з ідентифікатором ${req.params.id} не знайдено` });
            return null;
         }
      })
      .then((updatedRecord) => {
         if (updatedRecord) {
            res.status(204).json({ success: `Запис формуляру з ідентифікатором ${req.params.id} оновлено` });
         }
      })
      .catch((error) => {
         res.status(500).json({ error: error });
      });

})

module.exports = router