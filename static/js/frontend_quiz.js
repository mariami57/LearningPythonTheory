const topicEl = document.getElementById('topicTitle');
const topicId = parseInt(topicEl.dataset.topicId, 10);

const QUESTIONS_URL = `/topic/${topicId}/questions/`;
const SUBMIT_URL = `/topic/${topicId}/submit/`;

let questions = [];
let userAnswers = {};

// Load questions from API
async function loadQuestions() {
    const res = await fetch(QUESTIONS_URL, {credentials:'include'});
    if (!res.ok) throw new Error("Failed to load questions");

    questions = await res.json();
    renderQuestions();
}

// Render questions
function renderQuestions(results = null) {
    const container = document.getElementById('quiz');
    container.innerHTML = '';

    questions.forEach(q => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
        qDiv.innerHTML = `<h3>${q.text}</h3>`;

        // Closed questions
        if (q.choices && q.choices.length > 0) {
            if (!userAnswers[q.id]) userAnswers[q.id] = {choice_id: null};

            const choicesDiv = document.createElement('div');
            choicesDiv.className = 'choices';

            q.choices.forEach(choice => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${q.id}`;
                input.value = choice.id;

                if (userAnswers[q.id].choice_id === choice.id) input.checked = true;

                input.addEventListener('change', e => {
                    userAnswers[q.id] = {choice_id: parseInt(e.target.value)};
                });

                label.appendChild(input);
                label.appendChild(document.createTextNode(` ${choice.text}`));
                choicesDiv.appendChild(label);
            });

            qDiv.appendChild(choicesDiv);
        }

        // Open-ended questions
        else {
            const textarea = document.createElement('textarea');
            textarea.rows = 4;
            textarea.style.width = '100%';
            textarea.value = userAnswers[q.id]?.text_answer || '';

            textarea.addEventListener('input', () => {
                userAnswers[q.id] = {text_answer: textarea.value};
            });

            qDiv.appendChild(textarea);
        }

        // Show results if provided
        if (results && results[q.id]) {
            const r = results[q.id];

            if (r.correct !== undefined) {
                qDiv.classList.add(r.correct ? 'correct' : 'incorrect');
            }

            if (r.score !== undefined) {
                const scoreEl = document.createElement('div');
                scoreEl.textContent = `Score: ${r.score}`;
                qDiv.appendChild(scoreEl);
            }

            if (r.feedback) {
                const feedbackEl = document.createElement('div');
                feedbackEl.textContent = `Feedback: ${r.feedback}`;
                qDiv.appendChild(feedbackEl);
            }

            if (r.error) {
                const errorEl = document.createElement('div');
                errorEl.textContent = `Error: ${r.error}`;
                qDiv.appendChild(errorEl);
            }
        }

        container.appendChild(qDiv);
    });
}

// Submit all answers
document.getElementById('submitBtn').addEventListener('click', async () => {
    const payload = {
        answers: Object.entries(userAnswers).map(([qid, data]) => ({
            question_id: parseInt(qid),
            ...data
        }))
    };

    console.log("Submitting payload:", payload);

    const res = await fetch(SUBMIT_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Submission failed:", text);
        alert("Submission failed");
        return;
    }

    const resultData = await res.json();
    renderQuestions(resultData.results);
});

// Helper to get CSRF token
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

loadQuestions().catch(err => {
    console.error(err);
    alert("Failed to load questions");
});
