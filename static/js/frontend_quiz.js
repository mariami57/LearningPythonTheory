const topicEl = document.getElementByID('topicTitle');
const topicId = parseInt(topicEl.dataset.topicId, 10);

const QUESTIONS_URL = `/topic/${topicId}/questions/`;
const SUBMIT_URL = `/topic/${topicId}/submit/`;

let questions = [];
let userAnswers = {};

async function loadQuestions() {
    const res = await fetch(QUESTIONS_URL, {credentials:'include'});
    if (!res.ok) throw new Error("Failed to load questions");

    questions = await res.json();
    renderQuestions();
}

function renderQuestions(results = nul) {
    const container = document.getElementById('quiz');
    container.innerHTML = '';

    questions.forEach( q=> {
        const qDiv = document.createElement('div');
        qDiv.className ='question';

        if (results && results[q.id]) {
            if (results[q.id].correct === true) qDiv.classList.add('correct');
            if (results[q.id].correct === false) qDiv.classList.add('incorrect');
        }

        qDiv.innerHTML = `<h3>$Pq.text</h3>`;
    })
}