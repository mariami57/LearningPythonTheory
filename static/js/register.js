function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

document.getElementById('registerForm').addEventListener('submit', async function(e) {
   e.preventDefault();

   const formData = {
        username: this.username.value,
        email: this.email.value,
        password: this.password.value
   };

   const res = await fetch('/user/register-api/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
    },
    body: JSON.stringify(formData),
    credentials: 'include'
   });

   const data = await res.json();
   console.log(data);

});