import { getCSRFToken } from './utils.js';
import { handlePaginationButtons, updatePaginationInfo, updateQuizInfo, currentPage, renderPageNumbers  } from './pagination.js';

const topicEl = document.getElementById('topicTitle');
const topicId = parseInt(topicEl.dataset.topicId, 10);

const QUESTIONS_URL = `/topic/${topicId}/questions/`;
const SUBMIT_URL = `/topic/${topicId}/submit/`;

let allQuestions = {};
let currentPageQuestions = [];
let allResults = {};
let userAnswers = {};
let currentPageUrl = QUESTIONS_URL;

let unansweredQuestionsIds = new Set();
let correctClosedEnds = 0
let scoreOpenEnds = 0


const container = document.getElementById('quiz');
const submitBtn = document.getElementById('submitBtn');


async function loadQuestions(url) {
    try {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error("Failed to load questions");

        const data = await res.json();

        currentPageQuestions = data.results;


        currentPageQuestions.forEach(q => allQuestions[q.id] = q);

        renderQuestions(currentPageQuestions, allResults);

        const { totalPages, currentPage } = updatePaginationInfo(data, url);
        updateQuizInfo(data.count, totalPages, currentPage);
        renderPageNumbers(totalPages, currentPage, loadQuestions, QUESTIONS_URL);


        handlePaginationButtons(data, loadQuestions, userAnswers);

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.error(err);
        alert("Failed to load questions after pagination");
    }
}

// Render questions
function renderQuestions(questions, results) {
    container.innerHTML = '';

    if (!questions || questions.length === 0) {
        container.innerHTML = "<p>No questions available.</p>";
        return;
    }

    questions.forEach(q => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
        qDiv.dataset.id = q.id;

        if (unansweredQuestionsIds.has(q.id)){
            qDiv.classList.add('incorrect');
        }
        qDiv.innerHTML = `<h3>${q.text}</h3>`;

        // Closed questions
        if (q.choices && q.choices.length > 0) {
            const choicesDiv = document.createElement('div');
            choicesDiv.className = 'choices';

            q.choices.forEach(choice => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${q.id}`;
                input.value = choice.id;

                if (userAnswers[q.id]?.choice_id === choice.id) input.checked = true;

                const textSpan = document.createElement('span');
                textSpan.textContent = choice.text;

                const r = results[q.id];
                if (r) {
                    if (choice.id === r.correct_choice_id) {
                        textSpan.classList.add("correct-choice");
                    }
                    if (!r.correct && choice.id === userAnswers[q.id]?.choice_id) textSpan.classList.add("wrong-choice");
                }

                input.addEventListener('change', () => {
                    userAnswers[q.id] = { choice_id: parseInt(input.value) };
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
            textarea.className = 'w-full';
            textarea.value = userAnswers[q.id]?.text_answer || '';

            textarea.addEventListener('input', () => {
                userAnswers[q.id] = { text_answer: textarea.value };
            });

            const r = results[q.id];
            if (r) {
                const score = r.score;
                const scoreDiv = document.createElement('div');
                scoreDiv.className = 'feedback';
                scoreDiv.textContent = `Score: ${r.score}`;
                qDiv.appendChild(scoreDiv);

                const feedback = document.createElement('div');
                feedback.className = 'feedback';
                feedback.textContent = r.feedback;
                qDiv.appendChild(feedback);

                const reference = document.createElement('div');
                reference.className = 'reference';
                reference.textContent = r.reference_answer || '';
                qDiv.appendChild(reference);
            }

            qDiv.appendChild(textarea);
        }

        container.appendChild(qDiv);
    });
}

// Submit answers
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
       const pageSize = 5;
       if (!checkForUnansweredQuestions(userAnswers, allQuestions, pageSize)) {
           renderQuestions(currentPageQuestions, allResults);
           return;
       }
        const payload = {
            answers: Object.entries(userAnswers).map(([qid, data]) => ({
                question_id: parseInt(qid),
                ...data
            }))
        };

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
            Object.assign(allResults, resultData.results);


            renderQuestions(currentPageQuestions, allResults);
            const {earnedPoints, totalPoints} = calculateScore(allResults, allQuestions);


            alert(`You scored ${earnedPoints} out of ${totalPoints} points.`)


        } catch (err) {
            console.error(err);
            alert("An error occurred while submitting.");
        }
    });
}


loadQuestions(QUESTIONS_URL);

export function checkForUnansweredQuestions(userAnswers, allQuestions, pageSize) {
    unansweredQuestionsIds.clear();

    const questionIds = Object.keys(allQuestions).map(id => parseInt(id)).sort((a,b)=> a - b);

    const pagesWithMissing = new Set();

    questionIds.forEach((id, index) => {
        const q = allQuestions[id];
        const answer = userAnswers[q.id];

        const isUnanswered = q.choices && q.choices.length > 0 ? !answer || answer.choice_id == null : !answer || !answer.text_answer?.trim();

        if (isUnanswered) {
            unansweredQuestionsIds.add(id);

            const pageNumber = Math.ceil((index + 1 ) / pageSize);
            pagesWithMissing.add(pageNumber);
        }
    });

    if (pagesWithMissing.size > 0) {
        const pagesList = [...pagesWithMissing].sort((a,b) => a - b)
        alert(`You have unanswered questions on page(s): ${pagesList.join(', ')}`);
        return false;
    }

    return true;

}

function calculateScore(allResults, allQuestions) {
    let earnedPoints = 0;
    let totalPoints = 0;

    Object.values(allQuestions).forEach(q => {
        const result = allResults[q.id];
        if (!result) return;

        if (q.choices && q.choices.length > 0 ) {
            totalPoints += 1;
            if (result.correct) {
                earnedPoints += 1;
            }
        } else {
            totalPoints += 10;
            earnedPoints += result.score || 0 ;

        }
    });

    return { earnedPoints, totalPoints };
}