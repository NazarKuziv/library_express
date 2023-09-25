const deleteButtons = document.querySelectorAll('.delete-button');

deleteButtons.forEach(button => {
   button.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('data-id');
      deleteBookCopy(id);
   });
});

function deleteBookCopy(id) {
   fetch(`/librarians/${id}`, {
      method: 'DELETE',
   })
      .then(response => {
         if (response.ok) {
         } else {
            alert('Не вдалося видалити!')
         }
      })
      .catch(error => {
         alert('Не вдалося видалити!' + error)
      });
}