// getting HTML elements
let questionElement = document.getElementById('question')
let answerOptions = document.querySelector('.answer-options')
let correctScore = document.getElementById('correct-score')
let totalQuestions = document.getElementById('total-questions')
let resultsElement = document.getElementById('results')
let nextButton = document.getElementById('next')
let playAgainButton = document.getElementById('play-again')

// global variables
let correctAnswer = ''
let counter = 0
let score = 0
let maxQuestions = 10
let questionCount = 0

// start quiz function
startQuiz()

function startQuiz() {
    // fetch api data
    fetchData()
    // HTML content - display score out of 10
    totalQuestions.textContent = maxQuestions
    // HTML content - display correct score out of 10
    correctScore.textContent = score
}

// api data
function fetchData() {
    // api url
    let url = 'https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple'
    // fetching
    fetch(url)
    .then( response => response.json() )
    .then( (data) => {
        // to access results object array to get information
        let dataResults = data.results
        // to show the objects array
        console.log(dataResults)
        // show current questions and answers in this function
        currentQuestionAnswers(dataResults)
        // show next questions and answers in this function
        nextQuestionAnswers(dataResults)
        // error handling
    }).catch( error => {
        console.log(error)
        alert('Sorry, something is wrong.')
    })
}

function currentQuestionAnswers(data) {
    // next button is disabled
    nextButton.disabled = true
    // show first question using the counter variable
    questionElement.innerHTML = `${counter + 1 + '. ' + data[counter].question}`
    // have the global correctAnswer varible equal to api correct answer
    correctAnswer = data[counter].correct_answer
    // incorrectAnswers variable equal to list of incorrect answers
    let incorrectAnswers = data[counter].incorrect_answers
    // optionList variable equal to list of incorrect answers object array
    let optionsList = incorrectAnswers
    // splice - have correct answer in random position of incorrect answers, remove 0
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length)), 0, correctAnswer)
    // answer options HTML list element equals to array map to show the list. .join removes the comma
    answerOptions.innerHTML = `${optionsList.map( option => `<li>${option}</li>`).join('')}`
    // calling function
    answerSelection()
    // to show current question and correct answer
    console.log(questionElement.innerHTML)
    console.log(correctAnswer)
}

function nextQuestionAnswers(data) {
    // get element by ID 'next', onclick - the following happens:
    document.getElementById('next').onclick = function() {
        // next button is disabled
        nextButton.disabled = true
        // have counter go up by 1
        counter++
        // show next question using the counter variable
        questionElement.innerHTML = `${counter + 1 + '. ' + data[counter].question}`
        // have the correctAnswer varible equal to api correct answer
        correctAnswer = data[counter].correct_answer
        // incorrectAnswers variable equal to list of incorrect answers
        let incorrectAnswers = data[counter].incorrect_answers
        let optionsList = incorrectAnswers
        // splice - have correct answer in random position of incorrect answers, remove 0
        optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length)), 0, correctAnswer)
        // answer options HTML list element equals to array map to show the list. .join removes the comma
        answerOptions.innerHTML = `${optionsList.map( option => `<li>${option}</li>`).join('')}`
        // calling function
        answerSelection()
        // to show next question and correct answer
        console.log(questionElement.innerHTML)
        console.log(correctAnswer)

    }
}

function answerSelection() {
    // for loop to select all items in list
    answerOptions.querySelectorAll('li').forEach( function(option) {
        // event listener when item is clicked
        option.addEventListener('click', () => {
            // add item to answer-selected classList
            option.classList.add('answer-selected')
            // add answerOptions to disabled classList so user can't select anymore
            answerOptions.classList.add('disabled')
            // next button is not disabled, so it shows
            nextButton.disabled = false
            // calling function
            checkAnswer()
        })
        // remove answerOptions from disabled classList for next question and answers
        answerOptions.classList.remove('disabled')
        // reset resultsElement HTML so it doesn't show the results
        resultsElement.innerHTML = ''
    })
}

function checkAnswer() {
    // if answerOptions is selected
    if (answerOptions.querySelector('.answer-selected')) {
        // have selectedAnswer variable equal to the text content of the query selector
        let selectedAnswer = answerOptions.querySelector('.answer-selected').textContent
        // if text content from selectedAnswer is equal to the correct answer
        if (selectedAnswer.trim() == correctAnswer) {
            // resultsElement will show correct
            resultsElement.innerHTML = 'Correct!'
            // add score by 1
            score++
        } else {
            // else, resultsElement will show incorrect with the correct answer variable
            resultsElement.innerHTML = `Incorrect. The answer is ${correctAnswer}.`
        }
        // calling function
        checkCount()
    }
}

function checkCount() {
    // questionCount variable add by 1
    questionCount++
    // calling function
    setCount()
    // if questionCount is equal to maxQuestion (10)
    if (questionCount == maxQuestions) {
        // have resultsElement show score and text
        resultsElement.innerHTML += ` <br><b> Your score is ${score}.</b>`
        // next button will not display
        nextButton.style.display = 'none'
        // play again button will display
        playAgainButton.style.display = 'block'
        // calling function
        restartQuiz()
    }
}

function setCount() {
    // have text content of totalQuestions HTML element equal to maxQuestions variable
    totalQuestions.textContent = maxQuestions
    // have text content of correctScore HTML element equal to score variable
    correctScore.textContent = score
    // if questionCount variable equals to maxQuestions variable
}

function restartQuiz() {
    // get element by ID 'play-again', onclick - the following happens:
    document.getElementById('play-again').onclick = function() {
        // reset global variables
        correctAnswer = ''
        counter = 0
        maxQuestions = 10
        questionCount = 0
        score = 0
        // next button will display
        nextButton.style.display = 'block'
        // play again button will not display
        playAgainButton.style.display = 'none'
        // calling function
        setCount()
        // calling function
        startQuiz()
    }
}