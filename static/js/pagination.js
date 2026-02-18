let currentPage = 1;
let totalPages = 1;

export function handlePaginationButtons(data, loadQuestions) {

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
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

    updateQuizInfo(totalQuestions, currentPage, totalPages);


}

function updateQuizInfo(totalQuestions, currentPage, totalPages) {
    const infoDiv = document.getElementById('quizInfo');
    const infoTotalQuestionsP = document.createElement('p');
    const infoPageP = document.createElement('p');

    if (!infoDiv) return;

    infoDiv.replaceChildren();

    infoTotalQuestionsP.textContent = `
        Total questions: ${totalQuestions}`

     infoPageP.textContent = `
        Page ${currentPage} of ${totalPages}
    `

    infoDiv.appendChild(infoTotalQuestionsP);
    infoDiv.appendChild(infoPageP);

}