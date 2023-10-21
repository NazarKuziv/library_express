

function deleteLibrarian(id) {
   let URL = `http://localhost:3000/librarians/${id}`;
   $.ajax({
      url: URL,
      type: 'DELETE',
      success: function (result) {
         window.open("http://localhost:3000/librarians?alert='Бібліотекаря видалено'", "_self")
      },
      error: function (error, status) {
         alert(error.statusText);
      },

   });
}