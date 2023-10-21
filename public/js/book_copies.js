

function deleteBook(id) {
   let URL = `http://localhost:3000/book_copies/${id}`;
   $.ajax({
      url: URL,
      type: 'DELETE',
      success: function (result) {
         window.open("http://localhost:3000/book_copies?alert='Книгу видалено'", "_self")
      },
      error: function (error, status) {
         alert(error.statusText);
      },

   });
}