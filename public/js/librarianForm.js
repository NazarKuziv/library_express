var URL_LIBRARIAN = 'http://localhost:3000/librarians';


let id = null;
window.addEventListener("load", (event) => {
   let url = window.location.search;
   id = url.substring(4);
   if (id) {
      $("#save").css("display", "none");

      let url = URL_LIBRARIAN + '/' + id;
      $.get(url, function (data, status) {
         if (status === 'success') {
            const librarian = JSON.parse(data);
            console.log(librarian);
            $('#name').val(librarian.name);
            $('#email').val(librarian.email);
            $('#address').val(librarian.address);
            $('#phone_number').val(librarian.phone_number);

            $("#level").val(librarian.level_id).change();

         }
      });

   } else {
      $("#update").css("display", "none");
   }


});



$(document).ready(function () {


   $('#save').on('click', function () {
      let errors = ['nameError', 'emailError', 'addressError', 'phone_numberError', 'passwordError', 'levelError'];
      errors.map(function (item) {
         $(`#${item}`).css('color', 'black');
      });
      errors.length = 0;

      let name = $('#name').val();
      if (!name) {
         errors.push('nameError');
      }

      let email = $('#email').val();
      if (!email) {
         errors.push('emailError');
      }
      let address = $('#address').val();
      if (!address) {
         errors.push('addressError');
      }

      let phone_number = $('#phone_number').val();
      if (!phone_number) {
         errors.push('phone_numberError');
      }

      let pass = $('#password').val();
      if (!pass) {
         errors.push('passwordError');
      }

      let level_id = $('#level').val();
      if (!level_id) {
         errors.push('levelError');
      }


      if (errors.length > 0) {
         errors.map(function (item) {
            $(`#${item}`).css('color', 'red');
         });
      } else {
         data = {
            name,
            email,
            address,
            phone_number,
            pass,
            level_id
         };

         fetch(URL_LIBRARIAN, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json', // Set the appropriate content type for your data
               // You may also need to set other headers like authorization tokens
            },
            body: JSON.stringify(data) // Convert the data object to a JSON string
         })
            .then(response => {
               return response.json(); // Parse the response body as JSON
            })
            .then(data => {
               if (data.success) {
                  window.open("http://localhost:3000/librarians?alert='Бібліотекаря додано'", "_self")
               } else {
                  if (data.error.email) {
                     alert(data.error.email)
                  }
                  if (data.error.phone_number) {
                     alert(data.error.phone_number)
                  }

               }
            })
            .catch(error => {
               console.error('Error:', error);
               alert("Error:", error);
            });
      }
   })

   $('#update').on('click', function () {
      let errors = ['nameError', 'emailError', 'addressError', 'phone_numberError', 'passwordError', 'levelError'];
      errors.map(function (item) {
         $(`#${item}`).css('color', 'black');
      });
      errors.length = 0;

      let name = $('#name').val();
      if (!name) {
         errors.push('nameError');
      }

      let email = $('#email').val();
      if (!email) {
         errors.push('emailError');
      }
      let address = $('#address').val();
      if (!address) {
         errors.push('addressError');
      }

      let phone_number = $('#phone_number').val();
      if (!phone_number) {
         errors.push('phone_numberError');
      }



      let level_id = $('#level').val();
      if (!level_id) {
         errors.push('levelError');
      }
      if (errors.length > 0) {
         errors.map(function (item) {
            $(`#${item}`).css('color', 'red');
         });
      } else {

         let pass = $('#password').val();
         let data = {};
         if (!pass) {
            data = {
               name,
               email,
               address,
               phone_number,
               level_id
            };
         } else {
            data = {
               name,
               email,
               address,
               phone_number,
               pass,
               level_id
            };
         }

         fetch(URL_LIBRARIAN + '/' + id, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json', // Set the appropriate content type for your data
               // You may also need to set other headers like authorization tokens
            },
            body: JSON.stringify(data) // Convert the data object to a JSON string
         })
            .then(response => {
               return response.json(); // Parse the response body as JSON
            })
            .then(data => {
               if (data.success) {
                  window.open("http://localhost:3000/librarians?alert='Бібліотекаря оновлено'", "_self")
               } else {
                  if (data.error.email) {
                     alert(data.error.email)
                  }
                  if (data.error.phone_number) {
                     alert(data.error.phone_number)
                  }

               }
            })
            .catch(error => {
               console.error('Error:', error);
               alert("Error:", error);
            });
      }


   })

   // $('#bookBox').on('click', function () {

   //    console.log($('#selectBook').val());
   // });


});

