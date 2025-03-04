
const cardObjectDefinitions = [
    {id:1, imagePath:'./images/card-KingHearts.png'},
    {id:2, imagePath:'./images/card-JackClubs.png'},
    {id:3, imagePath:'./images/card-QueenDiamonds.png'},
    {id:4, imagePath:'./images/card-AceSpades.png'}
]

const aceId = 4

const cardBackImgPath = './images/card-back-Blue.png'

let cards= []

const playGameButtonElem = document.getElementById('playGame')

const cardContainerElem = document.querySelector('.card-container')

const collapsedGridAreaTemplate = '"a a" "a a"'

const cardCollectionCellClass = ".card-pos-a"

const numCards = cardObjectDefinitions.length

let cardPositions = []

let gameInProcess = false
let shufflingInProgress = false
let cardsRevealed = false

const currentGameStatusElem = document.querySelector('.current-status')
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')


const winColor = "green"
const loseColor = "red"
const primaryColor = "black"

let roundNum = 0
let maxRounds = 4
let score = 0

// Start of main

loadGame()

function gameOver() {
    updateStatusElement(scoreContainerElem,"none")
    updateStatusElement(roundContainerElem,"none")

    const gameOverMessage = `Game Over! Final Score - <span class = 'badge'>${score}</span> Click 'Play Game' button to play again`
    
    updateStatusElement(currentGameStatusElem, "block", primaryColor, gameOverMessage)

    gameInProcess = false
    playGameButtonElem.disabled = false
}

function endRound() {
    setTimeout(() => {
        if(roundNum == maxRounds) {
            gameOver()
            return
        }
        else {
            startRound()
        }
    },3000)
}

function chooseCard(card) {
    if(canChooseCard()) {
        evaluateCardChoice(card)
        flipCard(card,false)

        setTimeout(() => {
            flipCards(false)
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Card positions revealed")
            endRound()
        },3000)
        cardsRevealed = true
    }

}

function calculateScoreToAdd(roundNum) {
    if(roundNum == 1) {
        return 100
    }
    else if(roundNum == 2) {
        return 50
    }
    else if(roundNum == 3) {
        return 25
    }
    else {
        return 10
    }

}

function calculateScore() {
    const scoreToAdd = calculateScoreToAdd(roundNum)
    score = score + scoreToAdd
}

function updateScore() {
    calculateScore()
    updateStatusElement(scoreElem, "block", primaryColor, `<span class='badge'>${score}</span>`)
}

function updateStatusElement(elem, display, color, innerHTML) {
    elem.style.display = display

    if(arguments.length > 2) {
        elem.style.color = color
        elem.innerHTML = innerHTML
    }

}

function outputChoiceFeedback(hit) {
    if(hit) {
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!")
    }
    else {
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!")
    }


}

function evaluateCardChoice(card) {
    if(card.id == aceId) {
        updateScore()
        outputChoiceFeedback(true)
    }
    else {
        outputChoiceFeedback(false)
    }

}

function canChooseCard() {
    return gameInProcess == true && !shufflingInProgress && !cardsRevealed
}

function loadGame() {
    createCards()   
    
    cards = document.querySelectorAll('.card')

    playGameButtonElem.addEventListener('click', () => startGame())

    updateStatusElement(scoreContainerElem,"none")
    updateStatusElement(roundContainerElem,"none")
}

function startGame() {
    initializeNewGame()
    startRound()
}

function initializeNewGame() {
    score = 0
    roundNum = 0

    shufflingInProgress = false

    updateStatusElement(scoreContainerElem,"flex")
    updateStatusElement(roundContainerElem,"flex")

    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`)
    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`)

}

function startRound() {
    initializeNewRound()
    collectCards()
    flipCards(true)
    shuffleCards()
}

function initializeNewRound() {
    roundNum++
    playGameButtonElem.disabled = true
    
    gameInProcess = true
    shufflingInProgress = true
    cardsRevealed = false

    updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shuffling..." )

    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`)

}

function collectCards() {
    transformGridArea(collapsedGridAreaTemplate)
    addCardsToGridAreaCell(cardCollectionCellClass)
}

function transformGridArea(areas) {
    cardContainerElem.style.gridTemplateAreas = areas
}

function flipCard(card, flipToBack) {
    const innerCardElem = card.firstChild

    if(flipToBack && !innerCardElem.classList.contains('flip-it')){
        innerCardElem.classList.add('flip-it')
    }
    else if(innerCardElem.classList.contains('flip-it')){
        innerCardElem.classList.remove('flip-it')
    }
}

function flipCards(flipToBack) {
    cards.forEach((card,index) => {
        setTimeout(() => {flipCard(card,flipToBack)},index * 100)
    })
}

function addCardsToGridAreaCell(cellPositionClassName) {
    const cellPositionElem = document.querySelector(cellPositionClassName)

    cards.forEach((card, index) =>{
        addChildElement(cellPositionElem, card)
    })
}

function shuffleCards() {
    let shuffleCount = 0
    const id = setInterval(shuffle, 12)

    function shuffle() {

        randomizeCardPositions()

        if(shuffleCount == 500) {
            clearInterval(id)
            shufflingInProgress = false
            dealCards()
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Please click the card you think is the ace of spades..." )

        }
        else {
            shuffleCount++
        }

    }
}

function randomizeCardPositions() {
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1
    const temp = cardPositions[random1 - 1]
    
    cardPositions[random1 - 1] = cardPositions[random2 - 1]
    cardPositions[random2 - 1] = temp

}

function dealCards() {
    addCardsToAppropriateCell()
    const areasTemplate = returnGridAreasMappedToCardPos()

    transformGridArea(areasTemplate)

}

function returnGridAreasMappedToCardPos() {
    let firstPart = ""
    let secondPart = ""
    let areas = ""

    cards.forEach((card, index) => {
        if(cardPositions[index] == 1) {
            areas = areas + "a "
        }
        else if(cardPositions[index] == 2) {
            areas = areas + "b "
        }
        else if(cardPositions[index] == 3) {
            areas = areas + "c "
        }
        else if(cardPositions[index] == 4) {
            areas = areas + "d "
        }
        if(index == 1) {
            firstPart = areas.substring(0, areas.length - 1)
            areas = "";
        }
        else if(index == 3){
            secondPart = areas.substring(0, areas.length - 1)
        }
        
    })

    return `"${firstPart}" "${secondPart}"`
}

function addCardsToAppropriateCell() {
    cards.forEach((card) => {addCardToGridCell(card)})

}

function createCards() {
    cardObjectDefinitions.forEach((cardItem)=>{createCard(cardItem)})
}

function createCard(card){

    // create div elements that make up a card
    const cardElem = createElement('div')
    const cardInnerElem = createElement('div')
    const cardFrontElem = createElement('div')
    const cardBackElem = createElement('div')

    // create front and back image elements for a card
    const cardFrontImgElem = createElement('img')
    const cardBackImgElem = createElement('img')

    // add class and id to card element
    addClassToElement(cardElem, 'card')
    addIdToElement(cardElem, card.id)

    // add class to inner card element
    addClassToElement(cardInnerElem, 'card-inner')

    // add class to front card element
    addClassToElement(cardFrontElem, 'card-front')

    // add class to back card element
    addClassToElement(cardBackElem, 'card-back')

    // add src attribute and appropriate value to img element - back of card
    addSrcToImageElem(cardBackImgElem, cardBackImgPath)

    // add src attribute and appropriate value to img element - front of card
    addSrcToImageElem(cardFrontImgElem, card.imagePath)

    // assign class to image element of back of card
    addClassToElement(cardBackImgElem, 'card-img')

    // assign class to image element of front of card
    addClassToElement(cardFrontImgElem, 'card-img')

    // add back image element as child element to back card element
    addChildElement(cardBackElem, cardBackImgElem)

    // add front image element as child element to front card element
    addChildElement(cardFrontElem, cardFrontImgElem)

    // add back card element as child element to inner card eleement
    addChildElement(cardInnerElem, cardBackElem)

    // add front card element as child element to inner card element
    addChildElement(cardInnerElem, cardFrontElem)

    // add inner card element as child to card element
    addChildElement(cardElem, cardInnerElem)

    // add card element as child element to appropriate grid cell
    addCardToGridCell(cardElem)

    // initialize the position of the card element
    initializeCardPositions(cardElem)

    // add click event handler to card element
    attatchClickEventHandlerToCard(cardElem)

}

function attatchClickEventHandlerToCard(card) {
    card.addEventListener('click', () => chooseCard(card))
}

function initializeCardPositions(card){
    cardPositions.push(card.id)
}

function createElement(elemType){
    return document.createElement(elemType)
}

function addClassToElement(elem, className){
    elem.classList.add(className)
}

function addIdToElement(elem, id){
    elem.id = id
}

function addSrcToImageElem(imgElem, src){
    imgElem.src = src
}

function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem)
}

function addCardToGridCell(card){
    const cardPositionClassName = mapCardIdToGridCell(card)

    const cardPosElem = document.querySelector(cardPositionClassName)

    addChildElement(cardPosElem, card)

}

function mapCardIdToGridCell(card){
    if(card.id == 1){
        return '.card-pos-a'
    }
    else if(card.id == 2){
        return '.card-pos-b'
    }
    else if(card.id == 3){
        return '.card-pos-c'
    }
    else if(card.id == 4){
        return '.card-pos-d'
    }
}