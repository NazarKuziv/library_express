const express = require('express');
const bodyParser = require('body-parser');
const routerLibrarians = require('./routes/librarians');
const routerReaders = require('./routes/readers');
const routerBooks = require('./routes/books');
const routerBookCopies = require('./routes/book_copies');
const routerBorrowing = require('./routes/borrowing');
const routerForm = require('./routes/forms');
const routerAuthors = require('./routes/authors');
const routerCategories = require('./routes/categories');
const routerPublishers = require('./routes/publishers');
const routerLogin = require('./routes/login');
const routerLogout = require('./routes/logout');
const Librarian = require('./models/Librarian');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');


require('./config/db');
require('./config/initModels');
const app = express();

let _ = {};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(cookieParser());
const port = 3000

app.use((req, res, next) => {
   console.log('req.path', req.path, req.method)
   next()
})

app.use(cookieSession({
   name: 'app-auth',
   keys: ['secret-new', 'secret-old'],
   maxAge: 60 * 60 * 24
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((librarian, done) => {
   return done(null, librarian.id);
})

passport.deserializeUser(async (id, done) => {
   let librarian = await Librarian.findOne({ where: { id: id }, raw: true });
   if (librarian) {
      return done(null, { id: librarian.id, email: librarian.email });
   } else {
      return done(new Error(`User ${librarian.id} not found`));
   }
})

passport.use('local', new LocalStrategy({ passReqToCallback: true },
   async (req, username, password, done) => {
      console.log('Local strategy');
      let librarian = await Librarian.findOne({ where: { email: username }, raw: true });
      if (!librarian) {
         return done(null, false);
      }
      const result = await new Promise((resolve, reject) => {
         bcrypt.compare(password, librarian.password, (err, result) => {
            if (err) {
               reject(err);
            }
            resolve(result);
         })
      });

      if (result) {
         return done(null, librarian);
      } else {
         return done('Ел. пошта або пароль неправильні. Будь ласка, спробуйте ще раз!', null);
      }

   },
));

app.use((err, req, res, next) => {
   console.error(err.stack)
   res.status(500).send('Something broke!')
})

app.use('/', routerLogin);
app.use((req, res, next) => {
   if (req.isAuthenticated()) {
      next();
   } else {
      res.redirect('/')
   }
})
app.use('/logout', routerLogout);
app.use('/books', routerBooks);
app.use('/authors', routerAuthors);
app.use('/categories', routerCategories);
app.use('/publishers', routerPublishers);
app.use('/librarians', routerLibrarians);
app.use('/readers', routerReaders);
app.use('/book_copies', routerBookCopies);
app.use('/borrowing', routerBorrowing);
app.use('/forms', routerForm);



app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`)
})

