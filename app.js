const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routerLibrarians = require('./routes/librarians')
const routerReaders = require('./routes/readers')
const routerBooks = require('./routes/books')
const routerBookCopies = require('./routes/book_copies')
const routerBorrowing = require('./routes/borrowing')

require('./config/db')
require('./config/initModels')

const port = 3000

app.use('/librarians', routerLibrarians)
app.use('/readers', routerReaders)
app.use('/books', routerBooks)
app.use('/book_copies', routerBookCopies)
app.use('/borrowing', routerBorrowing)

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json())

app.use((req, res, next) => {
   console.log('req.path', req.path, req.method)
   next()
})

app.use((err, req, res, next) => {
   console.error(err.stack)
   res.status(500).send('Something broke!')
})

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`)
})

