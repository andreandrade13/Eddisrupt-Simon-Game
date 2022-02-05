let sequence = []; //array to keep track of the original sequence
let humanSequence = []; //human sequence
let level = 0;

const startButton = document.querySelector('.js-start'); //get start button
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');

//=============displays an alert and restores the game to its original state.
function resetGame(text) {
    alert(text);
    sequence = [];
    humanSequence = [];
    level = 0;
    startButton.classList.remove('hidden');
    heading.textContent = 'Simon Game';
    info.classList.add('hidden');
    tileContainer.classList.add('unclickable');
}


//==============function that indicates that the computer is finished with the round, and that it’s time for the player to repeat the sequence
function humanTurn(level) {
    tileContainer.classList.remove('unclickable');
    info.textContent = `Your turn: ${level > 1 ? 's' : ''}`;
}


//=============function to play the next round by activating the tiles on the screen in the right order.
function activateTile(color) {
    const tile = document.querySelector(`[data-tile='${color}']`); //get the button with the passed parameter
    const sound = document.querySelector(`[data-sound='${color}']`); //get the song with the passed parameter

    tile.classList.add('activated'); //add the style .activated
    sound.play();

    setTimeout(() => {
        tile.classList.remove('activated');
    }, 300)
}

//============ takes a sequence array and iterates over it.
function playRound(nextSequence) {
    nextSequence.forEach((color, index) => {
        setTimeout(() => { //
            activateTile(color);
        }, (index + 1) * 600);
    });
}

//=============Add a new random button press to the sequence
function nextStep() {
    const tiles = ['red', 'green', 'blue', 'yellow']; //match the data-tile in HTML
    const random = tiles[Math.floor(Math.random() * tiles.length)]; //return a number between 0-3
    
    return random;
}

//=============Start the next sequence of clicks
function nextRound() { // function to start the next sequence of clicks
    level += 1;

    tileContainer.classList.add('unclickable');
    info.textContent = 'Wait for the computer';
    heading.textContent = `Level ${level} of 20`

    const nextSequence = [...sequence]; //copy all the elements of sequence into nextSequence
    nextSequence.push(nextStep()); //inserting values into array by calling the nextStep func
    playRound(nextSequence);

    sequence = [...nextSequence];
    setTimeout(() => {
        humanTurn(level);
    }, level * 600 + 1000);
}

//============ushes the tile value to the humanSequence array and stores its index in the index variable.
function handleClick(tile) {
    const index = humanSequence.push(tile) - 1;
    const sound = document.querySelector(`[data-sound='${tile}']`);
    sound.play();

    const remainingTaps = sequence.length - humanSequence.length;

    if (humanSequence[index] !== sequence[index]) {
        resetGame('Oops! Game over, you pressed the wrong tile');
        return;
    }

    if (humanSequence.length === sequence.length) {
        if (humanSequence.length === 20) {
            resetGame('Congrats! You completed all the levels');
            return
        }
        humanSequence = [];
        info.textContent = 'Succes! Keep going!';
        setTimeout(() => {
            nextRound();
        }, 1000);
        return;
    }

    info.textContent = `your turn: ${remainingTaps} Tap${remainingTaps > 1 ? 's' : ''}`;
}


//=============Start the game
function startGame() {
    startButton.classList.add('hidden'); //once the start button is pressed, it will be hidden
    info.classList.remove('hidden'); //remove the hidden class
    info.textContent = 'Wait for the computer' //show this message
    nextRound();
}

startButton.addEventListener('click', startGame); //start the game when the start button is clicked
tileContainer.addEventListener('click', event => { //detect the player’s button taps and decide whether to move to the next round or end the game.
    const { tile } = event.target.dataset;

    if (tile) handleClick(tile);
});



