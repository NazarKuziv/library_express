

function returned(id) {
   let URL = `http://localhost:3000/borrowing/return/${id}`;
   $.get(URL, function (data, status) {
      window.open("http://localhost:3000/borrowing?alert='Формуляр оновлено'", "_self")
   });
}


