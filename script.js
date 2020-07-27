// Pages
const gamePage = document.getElementById('game-page')
const scorePage = document.getElementById('score-page')
const splashPage = document.getElementById('splash-page')
const countdownPage = document.getElementById('countdown-page')
// Splash Page
const startForm = document.getElementById('start-form')
const radioContainers = document.querySelectorAll('.radio-container')
const radioInputs = document.querySelectorAll('input')
const bestScores = document.querySelectorAll('.best-score-value')
// Countdown Page
const countdown = document.querySelector('.countdown')
// Game Page
const itemContainer = document.querySelector('.item-container')
// Score Page
const finalTimeEl = document.querySelector('.final-time')
const baseTimeEl = document.querySelector('.base-time')
const penaltyTimeEl = document.querySelector('.penalty-time')
const playAgainBtn = document.querySelector('.play-again')

// Equations
let questionAmount = 0
let equationsArray = []
let playerGuessArray = []
let bestScoreArray = []

// Game Page
let firstNumber = 0
let secondNumber = 0
let equationObject = {}
const wrongFormat = []

// Time
let timer //represents the time interval between start and stop
let timePlayed = 0 // increments every 10sec
let baseTime = 0 // start time - start time
let penaltyTime = 0 // based on wrong answers
let finalTime = 0 
let finalTimeDisplay = '0.0'

// Scroll
let valueY = 0 // this figure will change 80px everytime a user clicks on the Wrong or Right buttons

// Refresh Splash Page and display best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}`
  })
}

// Check local storage for best scores and then set the best scores
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores)
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay }
    ]
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }
  bestScoresToDOM()
}

// Update the best score array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct Best Score to update
    if (questionAmount == score.questions) {
      // Return the best score as a number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore)
      // Update only if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay
      }
    }
  })
  // Update the splash page
  bestScoresToDOM()
  // Save to localStorage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
}

// Reset Game
function playAgain() {
  gamePage.addEventListener('click', startTimer)
  scorePage.hidden = true
  splashPage.hidden = false
  equationsArray = []
  playerGuessArray = []
  valueY = 0
  playAgainBtn.hidden = true
}

// Show Score Page
function showScorePage() {
  // Show play again button after 1sec
  setTimeout(() => {
    playAgainBtn.hidden = false
  }, 1000)
  gamePage.hidden = true
  scorePage.hidden = false
}

// Format and display time in the DOM
function scoresToDom() {
  finalTimeDisplay = finalTime.toFixed(1)
  baseTime = timePlayed.toFixed(1)
  penaltyTime = penaltyTime.toFixed(1)
  baseTimeEl.textContent = `Base Time: ${baseTime}s`
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`
  finalTimeEl.textContent = `${finalTimeDisplay}s`
  updateBestScore()
  // Scroll back to the top of the item container
  itemContainer.scrollTo({ top: 0, behavior: 'instant'})
  showScorePage()
}

// Stop timer, process results and navigate to Score Page
function checkTime() {
  console.log(timePlayed)
  if (playerGuessArray.length == questionAmount) {
    console.log('player guess array:', playerGuessArray)
    clearInterval(timer)
    // Check for wrong guesses and add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct guess, no penalty
      } else {
        // Incorrect guess, add penalty
        penaltyTime += 0.5
      }
    })
    finalTime = timePlayed + penaltyTime
    // console.log('time', timePlayed, 'penalty:', penaltyTime, 'final:', finalTime)
    scoresToDom()
  }
}

// Add 10th of a second to timePlayed
function addTime() {
  timePlayed += 0.1
  checkTime()
}

// Start time when game page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0
  penaltyTime = 0
  finalTime = 0
  timer = setInterval(addTime, 100) // call 0.1s every 100ms
  gamePage.removeEventListener('click', startTimer) // To stop startTimer from triggering more than once
}

// Scroll and store the user selection in playerGuessArray
function select(guessedTrue) {
  // console.log('player guess array:', playerGuessArray)
  valueY += 80    // Scroll 80px
  itemContainer.scroll(0, valueY)
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false')
}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false
  countdownPage.hidden = true
}

// Get random number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount) // for the getRandomInt(max)
  console.log('correct equations', correctEquations)
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations
  console.log('wrong equations', wrongEquations)
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`
    equationObject = { value: equation, evaluated: 'true' }
    equationsArray.push(equationObject)
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice]
    equationObject = { value: equation, evaluated: 'false' }
    equationsArray.push(equationObject)
  }
  shuffle(equationsArray) // take the generated questions and shuffle them so that all the true questions aren't generated together
  // console.log('equations array:', equationsArray)
  // equationsToDom()
}

// Add questions to DOM
function equationsToDom() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div')
    item.classList.add('item')
    // Equation Text
    const equationText = document.createElement('h1')
    equationText.textContent = equation.value
    // Append
    item.appendChild(equationText)
    itemContainer.appendChild(item)
  })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = ''
  // Spacer
  const topSpacer = document.createElement('div')
  topSpacer.classList.add('height-240')
  // Selected Item
  const selectedItem = document.createElement('div')
  selectedItem.classList.add('selected-item') // a blue div that old answered questions will scroll into everytime user clicks a button
  // Append
  itemContainer.append(topSpacer, selectedItem)

  // Create Equations, Build Elements in DOM
  createEquations()
  equationsToDom()
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div')
  bottomSpacer.classList.add('height-500')
  itemContainer.appendChild(bottomSpacer)
}

// Display 3, 2, 1, GO!
function countdownStart() {
  let count = 3
  countdown.textContent = count
  const timeCountDown = setInterval(() => {
    count--
    if (count === 0) {
      countdown.textContent = 'GO!'
    } else if (count === -1) {
      showGamePage()
      clearInterval(timeCountDown)
    } else {
      countdown.textContent = count
    }
  }, 1000)
}

// To navigate from Splash Page to Countdown Page
function showCountdown() {
  countdownPage.hidden = false
  splashPage.hidden = true
  populateGamePage() 
  countdownStart()
}

// When User selects a game - get the game value from the selected radio button
function getRadioValue() {
  let radioValue
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value
    }
  })
  return radioValue // Has to be outside of the loop, else it will never send the value to selectQuestionAmount
}

// Function logging the value of the input form from the game selection that the user has made (getRadioValue)
function selectQuestionAmount(e) {
  e.preventDefault()
  questionAmount = getRadioValue()
  console.log('question amount: ', questionAmount)
  if (questionAmount) {  // If questionAmount is true/has a value/not undefined...
    showCountdown() // ...call the showCountdown function (if questionAmount is undefined, don't continue to call showCountdown)
  }
}

// Event Listener for the startForm - turns clicked items blue or non-white
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {  // for every radioContainer clicked...
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label') // remove the class that turns it blue
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) { // if the item is checked, add the blue label
      radioEl.classList.add('selected-label')
    }
  })
})

// Event Listener - listen for the Start Round button's submit
startForm.addEventListener('submit', selectQuestionAmount)
gamePage.addEventListener('click', startTimer)

// On Load
getSavedBestScores()
