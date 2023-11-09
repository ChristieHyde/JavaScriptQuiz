const MAX_TIME = 75
const TIME_DEDUCT = 10
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

var quizBoardEl = document.querySelector("#quiz_board");
var leaderboardEl = document.querySelector("#scoreboard");
var timerEl = document.querySelector("#timer");

var questionList;
var currentCorrectAnswer;
var timer;
var currentTime;

var score = 0;
var leaderboard = [];

init();

function init() {
    // Load leaderboard from local storage if it exists
    var localLeaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    if (localLeaderboard !== null) {
        leaderboard = localLeaderboard;
    }

    // If the page is the leaderboard, populate it
    if (location.pathname.endsWith("scoreboard.html")) {
        leaderboard.forEach(function(entry) {
            var entryEl = document.createElement("li");
            entryEl.textContent = entry.score.toLocaleString('en-US',
                {minimumIntegerDigits: 2, useGrouping: false}) + " - " +
                entry.initials;
            leaderboardEl.append(entryEl);
        });

        // Add an event listener for the clear-leaderboard button
        var clearBtn = document.querySelector("#clear_btn");
        console.log(clearBtn);
        clearBtn.addEventListener('click', function () {
            localStorage.removeItem("leaderboard");
            leaderboardEl.innerHTML = "";
        });
    // If the page is the index, set it up
    } else {
        // Add an event listener to the start button
        var startQuizBtn = document.querySelector("#start_btn");
        startQuizBtn.addEventListener('click', startQuiz);

        // Hide the timer elements until the quiz starts
        var timerHeadingEl = document.querySelector("#timer_heading");
        timerHeadingEl.setAttribute("style", "display: none")
    }
}

function startQuiz() {
    // Show the timer elements
    var timerHeadingEl = document.querySelector("#timer_heading");
    timerHeadingEl.removeAttribute("style");

    // Create and populate the quiz elements of the page
    createBoard();

    // Set up a timer to count down from the set time
    currentTime = MAX_TIME;
    timer = setInterval(function () {
        currentTime--;
        tick(currentTime);
        }, 1000);
}

// Quiz initialisation function
function createBoard() {
    // Clear the quiz board and disable leaderboard link
    quizBoardEl.innerHTML = "";
    var leaderboardLinkEl = document.querySelector("#scoreboard_link");
    leaderboardLinkEl.setAttribute("href", "javascript: void(0)");

    // Create question heading
    var headingEl = document.createElement("h3");
    headingEl.setAttribute("id", "question_heading")
    quizBoardEl.append(headingEl);

    // Create choice buttons in an unordered list
    var choiceListEl = document.createElement("ul");
    for (i = 0; i < NUM_CHOICES; i++) {
        var choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("id", "choice_"+(i+1));
        var choiceItemEl = document.createElement("li");
        choiceItemEl.append(choiceBtn);
        choiceListEl.append(choiceItemEl);
    }
    quizBoardEl.append(choiceListEl);

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
    var headingEl = document.querySelector("#question_heading");
    headingEl.textContent = question.question;

    // Populate choice buttons
    for (i=0; i < NUM_CHOICES; i++) {
        var choiceBtn = document.querySelector("#choice_"+(i+1));
        choiceBtn.textContent = answerArray[i];
        choiceBtn.addEventListener("click", selectAnswer);
    }
}

// Function to perform every second through the timer
function tick(timeLeft) {
    timerEl.textContent = Math.max(currentTime, 0);
    if (timeLeft <= 0) {
        clearInterval(timer);
        endQuiz("Time's up!");
        return;
    }
}

// Function to check if an answer is correct, and if the quiz should end
function selectAnswer() {
    if (this.textContent === currentCorrectAnswer) {
        score++;
    } else {
        currentTime -= 10;
        timerEl.textContent = Math.max(currentTime, 0);
        flash(timerEl);
    }

    if (questionList.length > 0) {
        populateQuestion(questionList.shift());
    } else {
        clearInterval(timer);
        endQuiz("That's the end of the quiz!");
    }
}

// Quiz end screen initialisation function
function endQuiz(heading) {
    // Clear the quiz board
    quizBoardEl.innerHTML = "";

    // Create and populate end screen content
    var headingEl = document.createElement("h2");
    headingEl.textContent = heading;
    quizBoardEl.append(headingEl);

    var textEl = document.createElement("p");
    textEl.textContent = "Your final score is " + score + 
        ". Enter your initials below to be added to the leaderboard!";
    quizBoardEl.append(textEl);

    var formEl = document.createElement("input");
    formEl.setAttribute("id", "initials");
    formEl.setAttribute("type", "text");
    formEl.setAttribute("placeholder", "Enter your initials here");
    quizBoardEl.append(formEl);

    var submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit";
    submitBtn.addEventListener("click", saveAndReset);
    quizBoardEl.append(submitBtn);
}

// Function to save scores to local memory and return to default start screen;
function saveAndReset() {
    // Save the score achieved and initials entered
    var formEl = document.querySelector("#initials");
    if (formEl.value.trim()) {
        leaderboard.push({initials: formEl.value.trim(), score: score});
    }
    // Sort the leaderboard in descending score order, and save to local
    // storage
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    // Reset the page;
    score = 0;
    location.reload();
}

// Function to make text flash for a set time
function flash(element) {
    var numFlashes = 3;
    var flashLength = 200;
    var flashColor = 'red';

    // Set the timer to make the text flash
    var defaultColor = window.getComputedStyle(element).getPropertyValue("color");
    numFlashes *= 2; // to account for setting the text to default between flashes
    var flashTimer = setInterval(function () {
        numFlashes--;
        var color = (window.getComputedStyle(element).getPropertyValue("color") == defaultColor ? flashColor : defaultColor)
        element.setAttribute("style", "color: " + color);

        if (numFlashes <= 0 ) {
            element.removeAttribute("style");
            clearInterval(flashTimer);
        }
    }, flashLength);
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