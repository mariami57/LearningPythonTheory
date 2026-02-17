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


            div.className = 'topic flex items-center justify-between p-4 border-2 border-green-500 rounded-lg w-full bg-gray-50 mb-4';


            div.innerHTML = `
                <div class="topic-info flex flex-col flex-1">
                    <h3 class="text-lg font-bold text-gray-800">${topic.title}</h3>
                    <h5 class="text-sm text-gray-600 mt-1">${topic.description}</h5>
                </div>
                <button
                    class="ml-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
                    onclick="goToTopic(${topic.id})">
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