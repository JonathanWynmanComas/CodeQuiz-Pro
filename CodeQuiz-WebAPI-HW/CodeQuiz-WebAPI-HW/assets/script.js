//Creatign a wrapper element to process all clicks on the page.
var wrapper = document.querySelector(".wrapper");
//start Button
var startBtn = null;
// variable for putting initial message with Start button and then the multiple choice questions dynamically
var initCard = document.querySelector("#init-card");
//Timer display
var timer = document.querySelector("#timerDisp");
//variable to to display result of each question as correct or wrong
var result = document.querySelector("#result");
//variable to store user entered initials
var initials = null;
//Variable to keep track of timer.  Each round get 75 seconds
var timeLeft = 75;
//Variable to keep track of number of questions
var numQues = 0;
//Variable to keep track of the score
var score = 0;
//Array to store (initials, score) pair in Local storage
var scoreList = [];

//array to store all the questions, theirs choices of answers and correct answer
var questionList = [
    {
        ques: "Commonly used data types do NOT include:",
        btn1: "1. strings",
        btn2: "2. boolean",
        btn3: "3. alerts",
        btn4: "4. numbers",
        ans: "3. alerts"
    },
    {
        ques: "Which keyword declares a variable?",
        btn1: "1. var",
        btn2: "2. int",
        btn3: "3. string",
        btn4: "4. float",
        ans: "1. var"
    },
    {
        ques: "Which symbol is for single-line comments?",
        btn1: "1. /* */",
        btn2: "2. //",
        btn3: "3. <!-- -->",
        btn4: "4. #",
        ans: "2. //"
    },
    {
        ques: "Which is a Boolean value?",
        btn1: "1. 'true'",
        btn2: "2. true",
        btn3: "3. 1",
        btn4: "4. yes",
        ans: "2. true"
    },
    {
        ques: "Which method parses JSON?",
        btn1: "1. JSON.parse()",
        btn2: "2. JSON.stringify()",
        btn3: "3. JSON.convert()",
        btn4: "4. JSON.object()",
        ans: "1. JSON.parse()"
    }
]

//Timer function  - it is executed when Start button is pressed
function startTimer() {
    timer.textContent = "Time: " + timeLeft;

    var timeInterval = setInterval(function () {
        timeLeft--;
        timer.textContent = "Time: " + timeLeft;

        if (timeLeft <= 0 || numQues === questionList.length) {
            clearInterval(timeInterval);
            timeLeft = 0;
            saveResults();
        }
    }, 1000);

    runQuiz();

}

//Function to run the quiz
function runQuiz() {
    if (numQues >= questionList.length) {
        saveResults();
        return;
    }

    var q = questionList[numQues];

    initCard.innerHTML =
        "<h3>" + q.ques + "</h3>" +
        "<button class='btn'>" + q.btn1 + "</button><br>" +
        "<button class='btn'>" + q.btn2 + "</button><br>" +
        "<button class='btn'>" + q.btn3 + "</button><br>" +
        "<button class='btn'>" + q.btn4 + "</button>";
}


// Function to save users score and initial - this is called when Timer is done or all the questions are done and timer is set to zero.
function saveResults() {
    initCard.innerHTML =
        "<h3>All done!</h3>" +
        "<p>Your final score is " + score + "</p>" +
        "<input type='text' id='initials' placeholder='Enter initials' />" +
        "<button class='btn'>Submit</button>";

    initials = document.querySelector("#initials");

}

//Get the list of Initials and score from Local Storage to display high scores from previous runs
//if link = true, we need to create a display string for alert popup when View High Score lin is clicked
//If link = false, we need to createa string to display high score on the card in the apge.
function getScoreListString(link) {
    //get stored initial/score pair from local storage
    var storedList = JSON.parse(localStorage.getItem("scoreList"));
    var values = "";

    for (var i = 0; i < storedList.length; i++) {
        var y = i+1;
        if(!link)
         values += "<span>" + y + ". " + storedList[i].initials + " - " + storedList[i].score + "</span><br>";
        else
        values +=  y + ". " + storedList[i].initials + " - " + storedList[i].score + "<br>";

    }

    return values;
}

//Function to calculate if the user selected correct response
function getResults(btnValue) {
    if (btnValue === questionList[numQues].ans) {
        return true;
    }
    return false
}

//Function to show results list in the card on the page
function showResults() {
    var values = getScoreListString(false);

    initCard.innerHTML =
        "<b>High Scores:</b><br>" +
        values +
        "<button class='btn'>Go Back</button>" +
        "<button class='btn'>Clear High Scores</button>";
}

//main Event listener for warpper element - it will parse all the clicks for links and various buttons on the page
wrapper.addEventListener("click", function (event) {
    var element = event.target;
    var answer = false;
    console.log(element);
    event.preventDefault();

    if (element.innerHTML === "View High Scores") {  //View High Scores
        console.log("View high score clicked");
        var newValues = getScoreListString(true);
        alert(newValues);

    } else if (element.innerHTML === "Start") { //Start Button
        console.log("Start button clicked");

        //start the timer when start button is clicked
        startTimer();

    } else if (element.innerHTML === "Submit") { //Submit Button

        console.log("Submit clicked");

        //userScore object to store scores in local storage
        var userScore = {
            initials: initials.value.trim(),
            score: score
        };

        //add the latest userScore to the ScoreList
        scoreList[scoreList.length] = userScore;

        //weite scoreList to local storage
        localStorage.setItem("scoreList", JSON.stringify(scoreList));

        //show all the scores stored in local storage so far
        showResults();

    } else if (element.innerHTML === "Go Back") { //Go back

        console.log("Go Back clicked");

        tiemLeft = 75;
        numQues = 0;
        score = 0;
        result.textContent = "";
        timer.textContent = "";

       location.reload();

    } else if (element.innerHTML === "Clear high Scores") {  //Clear High Score Button
 
        console.log("Clear High Score clicked");

       //empty out the scoreList
        scoreList.splice(0, scoreList.length);
        //store in local storage
        localStorage.setItem("scoreList", JSON.stringify(scoreList));
        //clear out the display on page
        initCard.innerHTML = "<b>High Scores:</b><br><span></span>\n <button id=\"goBack\" class=\"btn\">Go Back</button><button id=\"clearScores\" class=\"btn\">Clear High Scores</button>";

    } else if (element.innerHTML !== "Start") {       //Any of the Answer Button 

        console.log("One of the answer button clicked");

        //Return if all questions are done
        if(numQues === 5)
            return;
        
        //check if answer is correct or wrong
        answer = getResults(element.innerHTML);

        //answer is correct
        if (answer === true) {
            result.textContent = "Correct!";
            score += 15;
            numQues++;
            runQuiz();

        } else { //answer is wrong
            result.textContent = "Wrong!";
            timeLeft -= 15;
            if (timeLeft < 0) {
                timeLeft = 0;
            }
            numQues++;
            runQuiz();
        }
    } else {
        console.log("Ignore redundant clicks.");
    }
});


//Main fucntion
//It setups up the start message
//Also initialize the scoreList for the session with any initial/scores pairs stored in local storage from previous sessions
function init() {
    initCard.innerHTML = "Click Start button to start the timed quiz. Remember a wrong answer will detect time from the timer.<br><button id=\"start\" class\=\"btn\">Start</button>";
    startBtn = document.querySelector("#start");

    //get stored scores
    var storedList = JSON.parse(localStorage.getItem("scoreList"));
    if (storedList !== null) {
        scoreList = storedList;
    }
}

//Call init
init();

