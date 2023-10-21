const aletr = document.getElementById('alert')

async function login() {

   let email = document.getElementById('email').value;
   let password = document.getElementById('password').value;
   let data = { username: email, password: password }
   const rawResponse = await fetch(`http://localhost:3000/`, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   });
   const content = await rawResponse.json();

   if (!content.success) {

      if (aletr) {
         aletr.innerHTML = `<div
         class="alert alert-danger alert-dismissible fade show"
         role="alert"
      >
         <span id="alert-text">${content.message}</span>
         <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
         ></button>
      </div>`;
      } else {
         alert(content.message);
      }

   } else {
      console.log(content);
      setCookie('name', content.librarian.name);
      setCookie('level', content.librarian.level);
      window.open(`/borrowing`, "_self")

   }

}
function setCookie(name, value) {
   var expires = "";
   var date = new Date();
   date.setTime(date.getTime() + (60 * 60 * 24));
   expires = "; expires=" + date.toUTCString();
   document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

