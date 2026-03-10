export function getCSRFToken() {
     return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

export let accessToken = null;


export function getAccessToken() {
    return localStorage.getItem('accessToken');
}

export function setAccessToken(token) {
    localStorage.setItem('accessToken', token);
}

export async function apiFetch(url, options = {}) {
    options = { ...options };
    options.headers = { ...(options.headers || {}) };

    const access = getAccessToken();
    if (access) options.headers.Authorization = `Bearer ${access}`;

    options.credentials = 'include';

    let res = await fetch(url, options);


    if (res.status === 401) {
        console.log("401 detected, trying to refresh token...");

        const refreshRes = await fetch('/user/api/token/refresh/', {
            method: 'POST',
            credentials: 'include',
        });

        if (!refreshRes.ok) return res;

        const data = await refreshRes.json();
        if (!data.access) return res;

        setAccessToken(data.access);


        const retryOptions = {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${data.access}`,
            },
        };

        res = await fetch(url, retryOptions);
    }

    return res;

}
export async function initAuth() {

    const res = await fetch('/user/api/token/refresh/', {
        method: 'POST',
        credentials: 'include',
    });

    if (res.ok) {
        const data = await res.json();
        setAccessToken(data.access);
    }

}


export async function logoutUser(redirect=true) {
    try {
        await fetch ('/user/logout/', {
            method: 'POST',
            credentials:'include',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            }
        });

        setAccessToken(null);
        if(redirect) {
            window.location.href = '/user/login/';
        }

    } catch(err) {
        console.log("First fetch status:", res.status);
        console.error("Logout failed", err);
        alert("Logout failed. Please try again.");
    }
}

export function saveAnswersLocally(userAnswers, allResults) {
    localStorage.setItem('quizAnswers', JSON.stringify(userAnswers));
    localStorage.setItem('quizResults', JSON.stringify(allResults));
}

export function loadAnswersLocally() {
    const userAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
    const allResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    return { userAnswers, allResults };
}