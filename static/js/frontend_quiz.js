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

        if (q.choices && q.choices.length > 0) {
        const choicesDiv = document.createElement('div');
            choicesDiv.className = 'choices';

            q.choices.forEach(choice => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="radio" name="q${q.id}" value="${choice.id}">${choice.text}`;
                label.querySelector('input').addEventListener('change', () => {
                    userAnswers[q.id] = {choice_id: choice_id};
                });
                choicesDiv.appendChild(label);
            });

            qDiv.appendChild(choicesDiv);
        }

        else {
            const textarea = document.createElement('textarea');
            textarea.rows =4;
            textarea.style.width = '100%';
            textarea.addEventListener('input', () => {
                userAnswers[q.id] = {text_answer: textarea.value};
            });
            qDiv.appendChild(textarea);
        }


        if (results && results[q.id]) {
            const r = results[q.id];

            if (r.feedback) {
            const feedback = document.createElement('div');
            feedback.className = 'feedback';
            feedback.textContent = `Score ${score}`;
            qDiv.appendChild(feedback);

            const ref = document.createElement('div');
            ref.className = 'reference';
            ref.textContent = r.feedback;
            qDiv.appendChild(ref);
            }
        }

        container.appendChild(qDiv);
    });
}