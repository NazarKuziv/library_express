var URL_BOOK = 'http://localhost:3000/books';
var URL_BOOKS = 'http://localhost:3000/books/search';
var URL_CATEGORY = 'http://localhost:3000/categories/search';
var URL_AUTHORS = 'http://localhost:3000/authors/search';
var URL_PUBLISHER = 'http://localhost:3000/publishers/search';
var URL_BOOK_COPIES = 'http://localhost:3000/book_copies';

let id = null;
let numOfCopy = null;
window.addEventListener("load", (event) => {
   let url = window.location.search;
   id = url.substring(4);
   if (id) {
      $("#save").css("display", "none");
      $("#inStockBox").css("display", "block");
      $('#selectBook').attr('disabled', 'disabled');
      $('#selectСategory').attr('disabled', 'disabled');
      $('#selectAuthors').attr('disabled', 'disabled');

      let url = URL_BOOK_COPIES + '/get-one/' + id;
      $.get(url, function (data, status) {
         if (status === 'success') {
            const book_copy = JSON.parse(data);
            console.log(book_copy);

            var $newBook = $("<option selected='selected'></option>").val(book_copy.book.id).text(book_copy.book.title)
            $("#selectBook").append($newBook).trigger('change');

            var $newСategory = $("<option selected='selected'></option>").val(book_copy.book.category.id).text(book_copy.book.category.name)
            $("#selectСategory").append($newСategory).trigger('change');

            book_copy.book.authors.map(function (author) {
               var $newAuthor = $("<option selected='selected'></option>").val(author.id).text(author.name)
               $("#selectAuthors").append($newAuthor).trigger('change');
            });

            var $newPublisher = $("<option selected='selected'></option>").val(book_copy.publisher_id).text(book_copy.publisher.name)
            $("#selectPublisher").append($newPublisher).trigger('change');
            $('#language').val(book_copy.language);
            $('#yearPublished').val(book_copy.year_published);
            $('#numberOfCopies').val(book_copy.number_of_copies);
            $('#inStock').val(book_copy.in_stock);
            numOfCopy = book_copy.number_of_copies;

         }

      });

   } else {
      $("#update").css("display", "none");
   }


});



$(document).ready(function () {


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
            return {
               results: results.map(function (item) {
                  return {
                     id: item.id,
                     text: `${item.title} автор(и):${item.authors.map((author) => { return ` ${author.name}` })}`
                  };
               })
            };
         }
      }
   });

   $('#selectСategory').select2({
      minimumInputLength: 3,
      tags: [],
      ajax: {
         url: URL_CATEGORY,
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
                     text: item.name
                  };
               })
            };
         }
      }
   });

   $('#selectAuthors').select2({
      minimumInputLength: 3,
      tags: [],
      ajax: {
         url: URL_AUTHORS,
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
                     text: item.name
                  };
               })
            };
         }
      }
   });

   $('#selectPublisher').select2({
      minimumInputLength: 3,
      tags: [],
      ajax: {
         url: URL_PUBLISHER,
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
                     text: item.name
                  };
               })
            };
         }
      }
   });
   $('#selectBook').on("select2:selecting", function (e) {
      let book_id = e.params.args.data.id;
      if (book_id && !isNaN(book_id)) {
         let url = URL_BOOK + '/' + book_id;
         console.log(url);
         $.get(url, function (data, status) {
            if (status === 'success') {
               const book = JSON.parse(data);
               console.log(book);
               var $newСategory = $("<option selected='selected'></option>").val(book.category.id).text(book.category.name)
               $("#selectСategory").append($newСategory).trigger('change');

               book.authors.map(function (author) {
                  var $newAuthor = $("<option selected='selected'></option>").val(author.id).text(author.name)
                  $("#selectAuthors").append($newAuthor).trigger('change');
               });
               $('#selectAuthors').prop('disabled', 'disabled');
               $('#selectСategory').prop('disabled', 'disabled');
            }

         });
      } else {
         $('#selectAuthors').prop('disabled', false);
         $("#selectAuthors").val([]).text('');
         $('#selectСategory').prop('disabled', false);
         $("#selectСategory").val(-1).text('');
      }

   });

   $('#save').on('click', function () {
      let errors = ['bookError', 'categoryError', 'authorsError', 'publisherError', 'languageError', 'yearPublishedError', 'numberOfCopiesError'];
      errors.map(function (item) {
         $(`#${item}`).css('color', 'black');
      });
      errors.length = 0;

      let book_id = $('#selectBook').val();
      if (!book_id) {
         errors.push('bookError');
      }

      let category_id = $('#selectСategory').val();
      if (!category_id || isNaN(category_id)) {
         errors.push('categoryError');
      }

      let authorIds = $('#selectAuthors').val();
      if (authorIds.length === 0) {
         errors.push('authorsError');
      } else {
         authorIds.every((author) => {
            if (isNaN(author)) {
               errors.push('authorsError');
               return false
            }
            return true
         })
      }


      let publisher_id = $('#selectPublisher').val();
      if (!publisher_id || isNaN(publisher_id)) {
         errors.push('publisherError');
      }

      let language = $('#language').val();
      if (!language) {
         errors.push('languageError');
      }

      let year_published = $('#yearPublished').val();
      if (!year_published) {
         errors.push('yearPublishedError');
      }

      let number_of_copies = $('#numberOfCopies').val();
      if (!number_of_copies) {
         errors.push('numberOfCopiesError');
      }


      if (errors.length > 0) {
         errors.map(function (item) {
            $(`#${item}`).css('color', 'red');
         });
      } else {


         if (isNaN(book_id)) {
            let newBook = {
               title: book_id,
               authorIds,
               category_id,
            };
            console.log(newBook);
            $.ajax({
               method: "POST",
               url: URL_BOOK,
               data: newBook,
               success: function (data, status) {
                  console.log(data.success);
                  book_id = data.id;

                  // After receiving the book_id, make the second request
                  let in_stock = number_of_copies;
                  data = {
                     year_published,
                     book_id,
                     publisher_id,
                     number_of_copies,
                     in_stock,
                     language,
                  };

                  $.ajax({
                     method: "POST",
                     url: URL_BOOK_COPIES,
                     data: data,
                     success: function (data, status) {
                        alert(data.success);
                     },
                     error: function (error, status) {
                        alert(error.statusText);
                     },
                  });
               },
               error: function (error, status) {
                  alert(error.statusText);
                  return;
               },
            });
         } else {
            // Use the existing book_id to make the second request
            let in_stock = number_of_copies;
            data = {
               year_published,
               book_id,
               publisher_id,
               number_of_copies,
               in_stock,
               language,
            };

            $.ajax({
               method: "POST",
               url: URL_BOOK_COPIES,
               data: data,
               success: function (data, status) {
                  window.open("http://localhost:3000/book_copies?alert='Книгу додано'", "_self")
               },
               error: function (error, status) {
                  alert(error.statusText);
               },
            });
         }
      }
   })

   $('#update').on('click', function () {
      let errors = ['publisherError', 'languageError', 'yearPublishedError', 'numberOfCopiesError'];
      errors.map(function (item) {
         $(`#${item}`).css('color', 'black');
      });
      errors.length = 0;
      let publisher_id = $('#selectPublisher').val();
      if (!publisher_id || isNaN(publisher_id)) {
         errors.push('publisherError');
      }

      let language = $('#language').val();
      if (!language) {
         errors.push('languageError');
      }

      let year_published = $('#yearPublished').val();
      if (!year_published) {
         errors.push('yearPublishedError');
      }

      let number_of_copies = $('#numberOfCopies').val();
      let in_stock = $('#inStock').val();
      if (!number_of_copies) {
         errors.push('numberOfCopiesError');
      }
      else {
         number_of_copies = parseInt(number_of_copies)
         in_stock = parseInt(in_stock)
         if (number_of_copies > numOfCopy) {
            in_stock = in_stock + (number_of_copies - parseInt(numOfCopy))
         } else {
            in_stock = in_stock - (parseInt(numOfCopy) - number_of_copies)
         }
      }
      if (in_stock < 0) {
         alert("В наявності не може бути менше нуля!")
         errors.push('inStockError');
      }

      if (errors.length > 0) {
         errors.map(function (item) {
            $(`#${item}`).css('color', 'red');
         });
      } else {
         let book_id = $('#selectBook').val();
         let data = {
            year_published,
            book_id,
            publisher_id,
            number_of_copies,
            in_stock,
            language,
         };
         console.log(data)

         $.ajax({
            method: "PUT",
            url: URL_BOOK_COPIES + '/' + id,
            data: data,
            success: function (data, status) {
               window.open("http://localhost:3000/book_copies?alert='Книгу оновлено'", "_self")
            },
            error: function (error, status) {
               alert(error.statusText);
            },
         });
      }


   })

   // $('#bookBox').on('click', function () {

   //    console.log($('#selectBook').val());
   // });


});

