// const MAX_TIME = 75
// const TIME_DEDUCT = 10
// const NUM_QUESTIONS = 5
const NUM_CHOICES = 4;

const QUESTION_SET = [
    { question: "1",
        correctAnswer: "a",
        incorrectAnswers: ["b","c","d"]
    },
    { question: "2",
    correctAnswer: "e",
    incorrectAnswers: ["f","g","h"]
    },
    { question: "3",
    correctAnswer: "i",
    incorrectAnswers: ["j","k","l"]
    },
    { question: "4",
    correctAnswer: "m",
    incorrectAnswers: ["n","o","p"]
    },
    { question: "5",
    correctAnswer: "q",
    incorrectAnswers: ["r","s","t"]
    }
]

var quizBoard = document.querySelector("#quiz_board");

var questionList;
var currentCorrectAnswer;
var score = 0;

var leaderboard = [];

init();

function init() {
    // Add an event listener to the start button
    var startQuizBtn = document.querySelector("#start_btn");
    startQuizBtn.addEventListener('click', startQuiz);

    // Load leaderboard from local storage if it exists
    var localLeaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    if (localLeaderboard !== null) {
      leaderboard = localLeaderboard;
    }
}

function startQuiz() {
    createBoard();
}

// Quiz initialisation function
function createBoard() {
    // Clear the quiz board
    while (quizBoard.childElementCount > 0) {
        quizBoard.children[0].remove();
    }

    // Create question heading and four choice buttons
    var questionHeading = document.createElement("h3");
    questionHeading.setAttribute("id", "question_heading")
    quizBoard.append(questionHeading);
    for (i = 0; i < NUM_CHOICES; i++) {
        var button = document.createElement("button");
        button.setAttribute("id", "choice_"+(i+1));
        quizBoard.append(button);
        quizBoard.append(document.createElement("br"));
    }

    // Randomise the order of the questions in the quiz
    questionList = shuffleList(QUESTION_SET);
    populateQuestion(questionList.shift());
}

// Quiz question population function
function populateQuestion(question) {
    currentCorrectAnswer = question.correctAnswer;

    // Create answer array
    var answerArray = question.incorrectAnswers.slice();
    answerArray.unshift(question.correctAnswer);
    answerArray = shuffleList(answerArray);

    // Populate question heading
    var questionHeading = document.querySelector("#question_heading");
    questionHeading.textContent = question.question;

    // Populate choice buttons
    for (i=0; i < NUM_CHOICES; i++) {
        var button = document.querySelector("#choice_"+(i+1));
        button.textContent = answerArray[i];
        button.addEventListener("click", selectAnswer);
    }
}

// Quiz end screen initialisation function
function endQuiz(heading) {
    // Clear the quiz board
    while (quizBoard.childElementCount > 0) {
        quizBoard.children[0].remove();
    }

    // Create and populate end screen content
    var endingHeading = document.createElement("h2");
    endingHeading.textContent = heading;
    quizBoard.append(endingHeading);

    var endingText = document.createElement("p");
    endingText.textContent = "Your final score is " + score + ". Enter your initials below to be added to the leaderboard!";
    quizBoard.append(endingText);

    var initialsForm = document.createElement("input");
    initialsForm.setAttribute("id", "initials");
    initialsForm.setAttribute("type", "text");
    initialsForm.setAttribute("placeholder", "Enter your initials here");
    quizBoard.append(initialsForm);

    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", saveAndReset);
    quizBoard.append(submitButton);
}

// Function to save scores to local memory and return to default start screen;
function saveAndReset() {
    var initialsForm = document.querySelector("#initials");
    if (initialsForm.value.trim()) {
        leaderboard.push({initials: initialsForm.value.trim(), score: score});
    }
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    score = 0;
    location.reload();
}

// Function to check if an answer is correct, and if the quiz should end
function selectAnswer() {
    if (this.textContent === currentCorrectAnswer) {
        score++;
    }

    if (questionList.length > 0) {
        populateQuestion(questionList.shift());
    } else {
        endQuiz("That's the end of the quiz!");
    }
}

// Function to randomise the order of a list
function shuffleList(list) {
    var shuffledList = [];
    while (list.length > 0) {
        var i = Math.floor(Math.random() * list.length);
        shuffledList.push(list[i]);
        list.splice(i, 1);
    }
    return shuffledList;
}