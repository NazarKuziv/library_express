const express = require('express');
const router = express.Router();
const Librarian = require('../models/Librarian');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const path = require('path');
const passport = require('passport');

router.use(express.json()); // Add this line to enable JSON parsing
router.use(express.urlencoded({ extended: true }));

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

router.get('', async (req, res) => {
   res.render('login');
})

router.post('', async (req, res, next) => {
   passport.authenticate('local', (err, librarian) => {
      if (err) {
         console.error(err);
         return res.status(401).json({ success: false, message: `Електронна пошта або пароль неправильні` });
      }
      if (!librarian) {
         return res.status(401).json(
            {
               success: false,
               message: `Бібліотекаря з такою eл. пошта не знайдено `

            });
      }
      req.logIn(librarian, (err) => {
         if (err) {
            return next(err);
         }
         res.status(200).json(
            {
               success: true,
               message: `Електронна пошта або пароль неправильні`,
               librarian: { id: librarian.id, name: librarian.name, level: librarian.level_id }
            }
         )
      })
   })(req, res, next)
})






module.exports = router