import { checkForUnansweredQuestions } from './frontend_quiz.js';

export let currentPage = 1;
export let totalPages = 1;

export function handlePaginationButtons(data, loadQuestions) {

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn2 = document.getElementById('nextBtn2');
    const prevBtn2 = document.getElementById('prevBtn2');
    const submitBtn = document.getElementById('submitBtn');

    if (nextBtn) {
        if (data.next) {
            nextBtn.classList.remove('hidden');
            nextBtn.onclick = () => loadQuestions(data.next);

        } else {
            nextBtn.classList.add('hidden');
        }
    }

    if (prevBtn) {
        if (data.previous) {
            prevBtn.classList.remove('hidden');
             prevBtn.onclick = () =>  loadQuestions(data.previous);
        } else {
            prevBtn.classList.add('hidden');

        }
    }

     if (nextBtn2) {
        if (data.next) {
            nextBtn2.classList.remove('hidden');
            nextBtn2.onclick = () => loadQuestions(data.next);

        } else {
            nextBtn2.classList.add('hidden');
        }
    }

    if (prevBtn2) {
        if (data.previous) {
            prevBtn2.classList.remove('hidden');
             prevBtn2.onclick = () =>  loadQuestions(data.previous);
        } else {
            prevBtn2.classList.add('hidden');

        }
    }

    if (submitBtn) {
        if (!data.next) {
            submitBtn.classList.remove('hidden');
        } else {
           submitBtn.classList.add('hidden');
        }
    }

}

export function updatePaginationInfo(data, url) {
    const totalQuestions = data.count;
    const pageSize = data.results.length;

    totalPages = Math.ceil(totalQuestions / pageSize);

    const urlObj = new URL(url, window.location.origin);
    const pageParam = urlObj.searchParams.get('page');
    currentPage = pageParam ? parseInt(pageParam) : 1;

    return {totalPages, currentPage };


}

export function updateQuizInfo(totalQuestions) {
    const infoDiv = document.getElementById('quizInfo');
    if (!infoDiv) return;

    const infoTotalQuestionsP = document.createElement('p');
    const infoPageP = document.createElement('p');

    infoDiv.replaceChildren();

    infoTotalQuestionsP.textContent = `
        Total questions: ${totalQuestions}`

    infoPageP.textContent = `
        Page ${currentPage} of ${totalPages}
    `

    infoDiv.appendChild(infoTotalQuestionsP);
    infoDiv.appendChild(infoPageP);

}

export function renderPageNumbers(totalPages, currentPage, loadQuestions, baseUrl) {
    console.log("Rendering page numbers...");
    const containers = document.querySelectorAll('.pageNumbers');

    if (!containers.length) return;

    containers.forEach(container => container.replaceChildren());

    for (let i = 1; i <= totalPages; i++) {
        containers.forEach(container => {
            const btn = document.createElement('button');
            btn.textContent = i;

            if (i === currentPage) {
                btn.classList.add('active-page');
            }

            btn.addEventListener('click', () => {
                const url = new URL(baseUrl, window.location.origin);
                url.searchParams.set('page', i);
                loadQuestions(url.toString());
            });

            container.appendChild(btn);
        });
    }
}