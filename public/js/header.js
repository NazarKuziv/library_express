window.addEventListener("load", (event) => {
   let url = window.location;
   let id = url.pathname.substring(1);
   document.getElementById(id).classList.add("link-active");

   let url1 = window.location.href;
   if (url1.includes('?')) {
      const searchParams = new URLSearchParams(window.location.search);
      let message = searchParams.get('alert');
      let html = `<div
      class="alert alert-success alert-dismissible fade show"
      role = "alert"
         >
         <span id="alert-text">${message}</span>
         <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
         ></button>
      </ >`
      $("#alert").html(html)
   }
});

function logout() {
   const cookies = document.cookie.split(";");

   for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
   }
   window.open(`/`, "_self")
}