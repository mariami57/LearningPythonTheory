import { getCSRFToken } from './utils.js';

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        username: this.username.value,
        password: this.password.value
    };

    const res = await fetch('/user/login-api/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        window.location.href = '/topic/all-topics/';
    } else {
        console.log(data);
    }
});