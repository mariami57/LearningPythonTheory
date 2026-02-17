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


            div.className = 'topic flex items-center justify-between p-4 border-2 border-green-500 rounded-lg w-full bg-gray-50';

            const topicTitle = document.createElement('h3');
            topicTitle.className = 'text-lg font-bold text-gray-800';
            topicTitle.textContent = topic.title;

            const topicDescription = document.createElement('h5');
            topicDescription.className = 'text-sm text-gray-600 mt-1';
            topicDescription.textContent = topic.description;

            const topicInfo = document.createElement('div');
            topicInfo.className = 'topic-info flex flex-col flex-1'
            topicInfo.appendChild(topicTitle);
            topicInfo.appendChild(topicDescription);

            const button = document.createElement('button');
            button.className = 'ml-4 py-2 px-4'
            button.textContent = 'Start Quiz';
            button.addEventListener('click', () => {
                goToTopic(topic.id);
            })

            div.appendChild(topicInfo);
            div.appendChild(button);
            container.appendChild(div);
        });
    } else {

        const message = document.createElement('p');
        message.textContent = 'No topics available at the moment.';
        container.appendChild(message);
    }

}

function goToTopic(topicId) {
    window.location.href = `/topic/${topicId}/quiz/`;
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