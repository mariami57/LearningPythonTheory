import { getCSRFToken } from './utils.js';

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        username: this.username.value,
        password: this.password.value
    };

    const res = await fetch('/user/login-api/', {
        method:'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify(formData),
        credentials: 'include'
    });

    if (res.ok) {
        window.location.href = '/topic/all-topics/';

    } else {
        const error = await res.json();
        console.log(error);
    }

});

