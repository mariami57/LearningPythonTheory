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

                const textSpan = document.createElement('span');
                textSpan.textContent = ` ${choice.text}`;

                if (results && results[q.id]) {
                       const r = results[q.id];

                    if (choice.id === r.correct_choice_id) {
                        textSpan.classList.add("correct-choice");

                    }
                    if (r.correct === false && choice.id === userAnswers[q.id]?.choice_id) {
                        textSpan.classList.add("wrong-choice");

                    }
                    if (r.correct === true) qDiv.classList.add("correct");
                    if (r.correct === false) qDiv.classList.add("incorrect");
                }

                input.addEventListener('change', e => {
                    userAnswers[q.id] = {choice_id: parseInt(e.target.value)};
                });

                label.appendChild(input);
                label.appendChild(textSpan);
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

             if (results && results[q.id] && results[q.id].feedback !== undefined) {
                const feedback = document.createElement('div');
                feedback.className = 'feedback';
                feedback.textContent = `Score: ${results[q.id].score}`;
                qDiv.appendChild(feedback);

                const ref = document.createElement('div');
                ref.className = 'reference';
                ref.textContent = `Reference answer: ${results[q.id].feedback}`;
                qDiv.appendChild(ref);
            }

            qDiv.appendChild(textarea);
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

       try {
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
        console.log("Server returned results:", resultData);
        renderQuestions(resultData.results);

    } catch (err) {
        console.error(err);
        alert("An error occurred while submitting.");
    }

});

// Helper to get CSRF token
function getCSRFToken() {
     return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

loadQuestions().catch(err => {
    console.error(err);
    alert("Failed to load questions");
});
