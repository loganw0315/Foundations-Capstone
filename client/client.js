
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const resultsButton = document.getElementById('results-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const correctSound = new Audio('correct.wav')
const wrongSound = new Audio('wrong.mp3')
const resultsList = document.getElementById('question-results-list')
const selectQuizButton = document.getElementById('dropbtn')
const menuButton = document.getElementById('menu-btn')
let shuffledQuestions, currentQuestionIndex, questions, totalQuestions

document.getElementById('quiz-1').addEventListener("click", () => {
  selectQuizButton.textContent="Food"
  axios.put(`/api/quiz/quiz1`)
    .then(res =>{
      console.log(res.data);
    })
    document.getElementById("dropdown-content").classList.add('hide')
})
document.getElementById('quiz-2').addEventListener("click", () => {
  selectQuizButton.textContent="Science & Nature"
  axios.put(`/api/quiz/quiz2`)
    .then(res =>{
      console.log(res.data);
    })
  document.getElementById("dropdown-content").classList.add('hide')

})
document.getElementById('quiz-3').addEventListener("click", () => {
  selectQuizButton.textContent="Video Games"
  axios.put(`/api/quiz/quiz3`)
    .then(res =>{
      console.log(res.data);
    })
  document.getElementById("dropdown-content").classList.add('hide')

})

document.getElementById('dropbtn').addEventListener('click', () =>{
  document.getElementById("dropdown-content").classList.remove('hide')
})


menuButton.addEventListener('click', goToMainMenu)
startButton.addEventListener('click', startQuiz)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})
resultsButton.addEventListener('click', showResults)



function startQuiz() {
  totalQuestions = 0;
  if(selectQuizButton.textContent !== "Select Quiz"){
  startButton.classList.add('hide')
  selectQuizButton.classList.add('hide')
  menuButton.classList.remove('hide')
  axios.get(`/api/quiz`)
    .then(res =>{
      questions = res.data
      console.log(res.data);
      shuffledQuestions = questions.sort(() => Math.random() - .5)
      currentQuestionIndex = 0
      questionContainerElement.classList.remove('hide')
      setNextQuestion()
    })
  }else{
    alert("Please select a quiz");
  }
}

function goToMainMenu() {
  const resultsHeader = document.getElementById('results-header')
  if(resultsHeader){
    resultsHeader.innerHTML=""
  }
  
  resetPage()
  menuButton.classList.add('hide')
  selectQuizButton.classList.remove('hide')
  startButton.classList.remove('hide')
  resultsButton.classList.add('hide')
  questionContainerElement.classList.add('hide')
  
  selectQuizButton.textContent = "Select Quiz"
  startButton.textContent = "Begin Quiz"
  currentQuestionIndex = 0
  resultsList.innerHTML="" 
  Array.from(answerButtonsElement.children).forEach(button => {
    button.classList.add('hide')
  })
}

function setNextQuestion() {
  resetPage()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionContainerElement.classList.remove('hide')
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetPage() {
  const resultsHeader = document.getElementById('results-header')
  if(resultsHeader){
    resultsHeader.innerHTML=""
  }
  
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  questionElement.classList.remove('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
  Array.from(answerButtonsElement.children).forEach(button => {
    button.classList.remove('hide')
  })

  resultsList.classList.add('hide')
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  let answer = {
      question: questionElement.textContent,
      correct: correct
  }
  axios.post(`/api/stats/`, answer)
    .then(res => {
      console.log(res);
    })
  if(correct){
    correctSound.play()
    party.confetti(this, {
        count: party.variation.range(20, 40),
    });
    correctSound.play()
  }else{
    wrongSound.play()
  }
  
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
    button.removeEventListener('click', selectAnswer)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    resultsButton.classList.remove('hide')
  }
}
function showResults(){
    questionElement.classList.add('hide')
    resultsList.classList.remove('hide')
    // resultsHeader.classList.remove('hide')
    resultsButton.classList.add('hide')
    startButton.innerText = 'Restart'
    startButton.classList.remove('hide')
    let resultsHeader = document.createElement('div')
    resultsHeader.id = 'results-header'
    resultsHeader.textContent = 'Results'
    questionContainerElement.prepend(resultsHeader)
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.add('hide')
      })
    resultsList.innerHTML=""  
    
    axios.get(`/api/stats/`)
    .then(res => {
        
    for(let i=0; i<res.data[0].length;i++){
    let {question, correct} = res.data[0][i]    
    let questionResult = document.createElement('li')
    let questionResultQuestion = document.createElement('span')
    let questionResultPicture = document.createElement('img')
    questionResultQuestion.textContent= `${question} ` 
    questionResultPicture.classList.add('result-picture')
    if(correct){
      questionResultPicture.src="/images/greencheck.png"
    }else{
      questionResultPicture.src="/images/redx.png"
    }
    questionResult.appendChild(questionResultQuestion)
    questionResult.appendChild(questionResultPicture)
    resultsList.appendChild(questionResult)  
    }

    let correctCount = res.data[1]
    let wrongCount = res.data[2]
    totalQuestions = (+correctCount)+(+wrongCount)
    let resultsTotal = document.createElement('p')
    resultsTotal.textContent = `${correctCount}/${totalQuestions}`
    resultsHeader.appendChild(resultsTotal)
    axios.delete(`/api/stats/`)
    
    })


    
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

