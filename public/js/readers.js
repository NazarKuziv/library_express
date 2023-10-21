

function deleteReader(id) {
   let URL = `http://localhost:3000/readers/${id}`;
   $.ajax({
      url: URL,
      type: 'DELETE',
      success: function (result) {
         window.open("http://localhost:3000/readers?alert='Читача видалено'", "_self")
      },
      error: function (error, status) {
         alert(error.statusText);
      },

   });
}