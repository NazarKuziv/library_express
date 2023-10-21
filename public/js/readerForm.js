var URL_READER = 'http://localhost:3000/readers';


let id = null;
window.addEventListener("load", (event) => {
   let url = window.location.search;
   id = url.substring(4);
   if (id) {
      $("#save").css("display", "none");
      $("#penaltyBox").css("display", "block");


      let url = URL_READER + '/' + id;
      $.get(url, function (data, status) {
         if (status === 'success') {
            const reader = JSON.parse(data);
            console.log(reader);
            $('#name').val(reader.name);
            $('#email').val(reader.email);
            $('#address').val(reader.address);
            $('#phone_number').val(reader.phone_number);
            $('#penalty').val(reader.penalty);

         }
      });

   } else {
      $("#update").css("display", "none");
   }


});



$(document).ready(function () {


   $('#save').on('click', function () {
      let errors = ['nameError', 'emailError', 'addressError', 'phone_numberError', 'penaltyError'];
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


      if (errors.length > 0) {
         errors.map(function (item) {
            $(`#${item}`).css('color', 'red');
         });
      } else {
         let penalty = 0;
         data = {
            name,
            email,
            address,
            phone_number,
            penalty
         };

         fetch(URL_READER, {
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
                  window.open("http://localhost:3000/readers?alert='Читача додано'", "_self")
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
      let errors = ['nameError', 'emailError', 'addressError', 'phone_numberError', 'penaltyError'];
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

      let penalty = $('#penalty').val();
      if (!penalty) {
         errors.push('penaltyError');
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
            penalty
         };
         fetch(URL_READER + '/' + id, {
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
                  window.open("http://localhost:3000/readers?alert='Читача оновлено'", "_self")
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

