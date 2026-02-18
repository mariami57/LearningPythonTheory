export function getCSRFToken() {
     return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

export function checkForUnansweredQuestions(userAnswers, allQuestions, pageSize) {
    const allQuestionIds = Object.keys(allQuestions).map(id => parseInt(id));
    const pages = {};
    allQuestionIds.forEach((qId, index) => {
        const pageNum = Math.floor(index / pageSize) + 1;
        if (!pages[pageNum]) pages[pageNum] = [];
        pages[pageNum].push(allQuestions[qId]);
    });

    const unansweredPerPage = {};


    Object.entries(pages).forEach(([pageNum, questions]) => {
        const unanswered = questions.filter(q => {
            const answer = userAnswers[q.id];

            if (q.choices && q.choices.length > 0) {
                return !answer || answer.choice_id == null;
            }

            return !answer || !answer.text_answer?.trim();
        });

        if (unanswered.length > 0) {
            unansweredPerPage[pageNum] = unanswered;
        }
    });

    if (Object.keys(unansweredPerPage).length > 0) {
        Object.entries(unansweredPerPage).forEach(([pageNum, questions]) => {
            questions.forEach(q => {
                const qDiv = document.querySelector(`.question[data-id='${q.id}']`);
                if (qDiv) qDiv.classList.add("incorrect");
            });
        });

        // Create a summary message
        const pagesList = Object.keys(unansweredPerPage).join(", ");
        alert(`You did not answer questions on page(s): ${pagesList}`);
        return false;
    }

    return true;
}