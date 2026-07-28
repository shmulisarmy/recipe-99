document.querySelectorAll("[data-quiz]").forEach((quiz) => {
  quiz.addEventListener("submit", (event) => {
    event.preventDefault();

    const questions = [...quiz.querySelectorAll("fieldset")];
    const correct = questions.filter((question) => {
      const selected = question.querySelector("input:checked");
      return selected?.value === question.dataset.answer;
    }).length;

    const feedback = quiz.querySelector(".feedback");
    feedback.textContent =
      correct === questions.length
        ? `${correct}/${questions.length}. You have the boundary right.`
        : `${correct}/${questions.length}. Revisit the ownership table, then try again.`;
    feedback.className =
      correct === questions.length ? "feedback correct" : "feedback incorrect";
  });
});
