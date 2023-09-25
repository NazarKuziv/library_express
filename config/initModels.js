const Level = require('../models/Level');
const Librarian = require('../models/Librarian');
const Category = require('../models/Category');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Publisher = require('../models/Publisher');
const Book_Copy = require('../models/Book_Copy');
const Borrowing = require('../models/Borrowing');
const Reader = require('../models/Reader');

Level.hasMany(Librarian, {
   foreignKey: 'level_id'
});

Librarian.belongsTo(Level, {
   foreignKey: 'level_id'
});

Category.hasMany(Book, {
   foreignKey: 'category_id'
});

Book.belongsTo(Category, {
   foreignKey: 'category_id'
});

Book.belongsToMany(Author, {
   through: "book_author",
   as: "authors",
   foreignKey: "book_id",
});

Author.belongsToMany(Book, {
   through: "book_author",
   as: "books",
   foreignKey: "author_id",
});

Publisher.hasMany(Book_Copy, {
   foreignKey: 'publisher_id'
});

Book_Copy.belongsTo(Publisher, {
   foreignKey: 'publisher_id'
});

Book.hasMany(Book_Copy, {
   foreignKey: 'book_id'
});

Book_Copy.belongsTo(Book, {
   foreignKey: 'book_id'
});

Librarian.hasMany(Borrowing, {
   foreignKey: 'librarian_id'
});

Borrowing.belongsTo(Librarian, {
   foreignKey: 'librarian_id'
});

Reader.hasMany(Borrowing, {
   foreignKey: 'reader_id'
});

Borrowing.belongsTo(Reader, {
   foreignKey: 'reader_id'
});

Book_Copy.hasMany(Borrowing, {
   foreignKey: 'book_id'
});

Borrowing.belongsTo(Book_Copy, {
   foreignKey: 'book_id'
});


module.exports = {}