import { getCSRFToken, accessToken, setAccessToken, getAccessToken } from './utils.js';


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
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
         setAccessToken(data.access);

        window.location.href = '/topic/all-topics/';
    } else {
        console.log(data);
    }
});