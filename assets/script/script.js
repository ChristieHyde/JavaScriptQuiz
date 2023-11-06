// const MAX_TIME = 75
// const TIME_DEDUCT = 10
// const NUM_QUESTIONS = 5
const NUM_CHOICES = 4;

var startQuizBtn = document.querySelector("#start_btn");
var quizBoard = document.querySelector("#quiz_board");

startQuizBtn.addEventListener('click', startQuiz);

function startQuiz() {
    createBoard();
}

function createBoard() {
    // Clear the quiz board
    while (quizBoard.childElementCount > 0) {
        console.log(quizBoard.children[0]);
        quizBoard.children[0].remove();
    }

    // Create question heading and four choice buttons
    var question = document.createElement("h3");
    for (i = 0; i < NUM_CHOICES; i++) {
        question.append(document.createElement("br"));
        var button = document.createElement("button");
        button.setAttribute("id", "choice_"+(i+1));
        question.append(button)
    }
    quizBoard.append(question);
}