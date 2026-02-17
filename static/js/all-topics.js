import { getCSRFToken } from './utils.js';

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

    if (topics && topics.length > 0) {
        topics.forEach(topic => {
            const div = document.createElement('div');
            div.className = 'topic';

            div.innerHTML = `
                <div class=topic-info>
                    <h3>${topic.title}</h3>
                    <h4>${topic.description}</h4>
                </div>
                <button onclick="goToTopic(${topic.id})">
                    Start Quiz
                </button>
            `;

            container.appendChild(div);
        });
    } else {

        const message = document.createElement('p');
        message.textContent = 'No topics available at the moment.';
        container.appendChild(message);
    }

}

function goToTopic(topicId) {
    window.location.href = `/${topicId}/quiz/`;
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch ('/user/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        },
        credentials: 'include'
    });

    window.location.href = '/user/login/';
})


loadTopics();