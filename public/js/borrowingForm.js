var URL_BOOKS = 'http://localhost:3000/book_copies/search';
var URL_READERS = 'http://localhost:3000/readers/search';
var URL_LIBRARIANS = 'http://localhost:3000/librarians/search';
var URL_BORROWING = 'http://localhost:3000/borrowing';


$(document).ready(function () {

   var currentDate = new Date().toISOString().slice(0, 10);
   $('#borrowedDate').val(currentDate);

   $('#selectBook').select2({
      minimumInputLength: 3,
      tags: [],
      ajax: {
         url: URL_BOOKS,
         dataType: 'json',
         type: "POST",
         quietMillis: 50,
         data: function (term) {
            return {
               term: term
            };
         },
         processResults: function (data) {
            const results = JSON.parse(data);
            console.log(results);
            return {
               results: results.map(function (item) {
                  return {
                     id: item.id,
                     text: `${item.book.title} автор(и):${item.book.authors.map((author) => { return ` ${author.name}` })}  видавець: ${item.publisher.name} мова: ${item.language} рік: ${item.year_published} `
                  };
               })
            };
         }
      }
   });

   $('#selectReader').select2({
      minimumInputLength: 3,
      tags: [],
      ajax: {
         url: URL_READERS,
         dataType: 'json',
         type: "POST",
         quietMillis: 50,
         data: function (term) {
            return {
               term: term
            };
         },
         processResults: function (data) {
            const results = JSON.parse(data);
            return {
               results: results.map(function (item) {
                  return {
                     id: item.id,
                     text: `${item.name} тел. ${item.phone_number}`
                  };
               })
            };
         }
      }
   });
   $('#selectLibrarian').select2({
      minimumInputLength: 3,
      tags: [],
      ajax: {
         url: URL_LIBRARIANS,
         dataType: 'json',
         type: "POST",
         quietMillis: 50,
         data: function (term) {
            return {
               term: term
            };
         },
         processResults: function (data) {
            const results = JSON.parse(data);
            console.log(results);
            return {
               results: results.map(function (item) {
                  return {
                     id: item.id,
                     text: `${item.name} тел. ${item.phone_number}`
                  };
               })
            };
         }
      }
   });

   $('#save').on('click', function () {
      let errors = ['bookError', 'readerError', 'librarianError'];
      errors.map(function (item) {
         $(`#${item}`).css('color', 'black');
      });
      errors.length = 0;

      let book_id = $('#selectBook').val();
      if (!book_id || isNaN(book_id)) {
         errors.push('bookError');
      }

      let reader_id = $('#selectReader').val();
      if (!reader_id || isNaN(reader_id)) {
         errors.push('readerError');
      }

      let librarian_id = $('#selectLibrarian').val();
      if (!librarian_id || isNaN(librarian_id)) {
         errors.push('librarianError');
      }

      if (errors.length > 0) {
         errors.map(function (item) {
            $(`#${item}`).css('color', 'red');
         });
      } else {
         borrowed_date = $('#borrowedDate').val();
         let return_date = null;
         let returned = false;
         const data = {
            book_id,
            reader_id,
            librarian_id,
            borrowed_date,
            return_date,
            returned
         };
         $.ajax({
            method: "POST",
            url: URL_BORROWING,
            data: data,
            success: function (data, status) {
               window.open("http://localhost:3000/borrowing?alert='Запис додано до формуляру'", "_self")
            },
            error: function (error, status) {
               alert(error.statusText);
            }
         });

      }

   })


});

