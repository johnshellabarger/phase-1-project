
let startButton = document.getElementById('start-btn')
let nextButton = document.getElementById('next-btn')
let questionContainerElement = document.getElementById('question-container')
let questionElement = document.getElementById('question')
let shuffleQuestions = Math.floor(Math.random() * 6)
let answerButtonsElement = document.getElementById('answer-buttons')
let body = document.querySelector('body')
let p = document.getElementById('score')
let score = 0
let scoreCard = document.createElement('p')
let questionCard = document.createElement('p')
let question = 0 
let form = document.getElementById('submitScoreElement')
form.classList.add('hide')
let input = document.getElementById('nameSubmit')
let yourScore = document.getElementById('yourScore')
let viewScore = document.getElementById('view-score-btn')
let scoreList = document.getElementById('scoreList')
let scoreListContainer = document.getElementById('scoreListContainer')
scoreListContainer.classList.add('hide')


startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', (e) => resetQuestion(e))
form.addEventListener('submit', handleSubmit)
viewScore.addEventListener('click', getScores)


function startGame(){
    startButton.classList.add('hide')
    questionContainerElement.classList.remove('hide')
    viewScore.classList.add('hide')
    getQuestions()
    showScore()
    showQuestionCard()
}

function getQuestions(){
    fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
    .then(resp => resp.json())
    .then(data => showQuestion(data))
}

function showQuestion(data){
    questionElement.innerHTML = data.results[shuffleQuestions].question

    let allAnswers = [...data.results[shuffleQuestions].incorrect_answers, data.results[shuffleQuestions].correct_answer]
    let shuffleAnswers = [...allAnswers].sort(randomlySort)
    
    for(let i = 0; i < 4; i++){
        let button = document.createElement('button')
        button.classList.add('btn')
        button.innerText = shuffleAnswers[i]
        answerButtonsElement.append(button)
        button.addEventListener('click', (e) => selectAnswer(e, data.results[shuffleQuestions].correct_answer, data.results))
    }
}

function randomlySort(a, b){
    return 0.5 - Math.random()
}

function selectAnswer(e, correct_answer){
    answerButtonsElement.style.pointerEvents = 'none';
    if(e.target.textContent === correct_answer){
        correct(e, correct_answer)
    } else {
        wrong(e, correct_answer)
    }
}

function correct(e){
    score = score + 100
    scoreCard.innerHTML = `${score} points`
    nextButton.classList.remove('hide')
    e.target.classList.add('correctAnswer')
}

function wrong(e, correct_answer, data){
    nextButton.classList.remove('hide')
    e.target.classList.add('incorrectAnswer')
}

function resetQuestion(e){
    if(question < 10){
        answerButtonsElement.style.pointerEvents = 'auto';
        p.innerHTML = ''
        answerButtonsElement.innerHTML = ''
        nextButton.classList.add('hide')
        body.classList.remove('correct')
        body.classList.remove('incorrect')
        getQuestions()
        showScore()
        question++
        showQuestionCard()
    } else { 
    showFinalScore()
    }
}

function showFinalScore(){
    questionContainerElement.classList.add('hide')
    p.classList.add('hide')
    form.classList.remove('hide')
    nextButton.classList.add('hide')
    yourScore.innerHTML = `You Scored ${score} Points`
}

function showScore(){
    scoreCard.innerHTML = `${score} points`
    p.append(scoreCard)
}

function showQuestionCard(){
    questionCard.innerHTML = `${question}/10`
    p.append(questionCard)
}

function getScores(e){
    let header = document.getElementById('header')
    header.classList.add('hide')
    scoreListContainer.classList.remove('hide')
    startButton.classList.add('hide')
    viewScore.classList.add('hide')
    fetch('http://localhost:3000/scores')
    .then(resp => resp.json())
    .then(data => data.forEach(displayScore))
}

function displayScore(data){
    let scoreLi = document.createElement('li')
    scoreLi.style.textDecoration = 'none'
    let name = document.createElement('p')
    name.className = 'name'
    let score = document.createElement('p')
    score.className = 'score'
    name.innerHTML = data.name 
    score.innerHTML = data.score
    scoreLi.append(name, score)
    scoreList.append(scoreLi) 
}

function handleSubmit(){
    fetch('http://localhost:3000/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: input.value,
            score: score
        })
    })
}






