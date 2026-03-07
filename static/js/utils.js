export function getCSRFToken() {
     return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

export let accessToken = null;

export function setAccessToken(token) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}


export async function apiFetch(url, options = {}) {
    let access = getAccessToken();

    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
    };

    options.credentials = 'include';

    let res = await fetch(url,options);

    if (res.status === 401) {
        const refreshRes = await fetch(`/user/api/token/refresh/`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!refreshRes.ok) {
            return res;
        }

        const data = await refreshRes.json();
        setAccessToken(data.access);

        options.header.Authorization = `Bearer ${data.access}`;
        res = await fetch(url, options);
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