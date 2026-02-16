async function loadTopics() {
    const res = await fetch('/topic/topics-api/', {
        credentials: 'include'
    });

    if (res.status === 401 || res.status === 403) {
        window.location.href = '/user/login/';
        return;
    }

    const topics = await res.json();
    const container = document.getElementById('topicsContainer');

    container.innerHTML = '';

    topics.forEach(topic => {
        const div = document.createElement('div');
        div.className = 'topic';

        div.innerHTML = `
            <h3>${topic.title}</h3>
            <button onclick="goToTopic(${topic.id})">
                Start Quiz
            </button>
        `;

        container.appendChild(div);
    });
}

function goToTopic(topicId) {
    window.location.href = `/${topicId}/quiz/`;
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch ('/user/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRToken()
        },
        credentials: 'include'
    });

    window.location.href = '/user/login/';
})


loadTopics();