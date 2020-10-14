const game = () => {
	let playerScore = 0;
	let computerScore = 0;

	const introScreen = document.querySelector('.intro');
	const match = document.querySelector('.match');
	const hands = document.querySelectorAll('.hands img');
	const options = document.querySelectorAll('.options button');
	const paragraphPlayerScore = document.querySelector('.player-score p');
	const paragraphComputerScore = document.querySelector('.computer-score p');
	const resetGameDiv = document.querySelector('.resetGame');
	const gameOverComponent = document.querySelector('.gameOver');

	//This function will be called when we need to show or hide any parts of the game
	const showAndHideComponents = (
		introVisibility,
		matchVisibility,
		resetGameDivVisibility,
		gameOverComponentVisibility
	) => {
		introScreen.style.visibility = introVisibility;
		match.style.visibility = matchVisibility;
		resetGameDiv.style.visibility = resetGameDivVisibility;
		gameOverComponent.style.visibility = gameOverComponentVisibility;
	};
	// We only show intro screen and hide match and resetGame div in the beginning
	showAndHideComponents('visible', 'hidden', 'hidden');
	//Function to start the game
	const startGame = () => {
		const playButton = document.querySelector('.intro button');
		playButton.addEventListener('click', () => {
			showAndHideComponents('hidden', 'visible', 'hidden', 'visible');
		});
	};

	// Play Match
	const playMatch = () => {
		const playerHand = document.querySelector('.player-hand');
		const computerHand = document.querySelector('.computer-hand');

		for (const hand of hands) {
			hand.addEventListener('animationend', () => {
				hand.style.animation = '';
			});
		}
		//Computer Options
		const ComputerOptions = [ 'rock', 'paper', 'scissors' ];
		for (const option of options) {
			option.addEventListener('click', () => {
				//Player choice
				const playerChoice = option.textContent;
				//Computer choice
				const computerNumber = Math.floor(Math.random() * 3);
				const computerChoice = ComputerOptions[computerNumber];
				// Function to disable buttons white hands shaking
				const disableButtons = (isDisable) => {
					for (let option of options) {
						option.disabled = isDisable;
					}
				};
				// When player start to click any button from option buttons, other buttons will be disabled
				disableButtons(true);
				setTimeout(() => {
					// Here is where we call compare hands
					compareHands(playerChoice, computerChoice);
					// Update images
					playerHand.src = `./imgs/${playerChoice}.png`;
					computerHand.src = `./imgs/${computerChoice}.png`;
					// Option buttons are back to normal
					disableButtons(false);
				}, 500);
				// Use rock image for all handshake animations
				for (hand of hands) {
					hand.src = `./imgs/rock.png`;
				}
				//Animation
				playerHand.style.animation = 'shakePlayer 0.5s ease';
				computerHand.style.animation = 'shakeComputer 0.5s ease';
			});
		}
	};
	// Function to update score
	const updateScore = () => {
		paragraphPlayerScore.textContent = playerScore;
		paragraphComputerScore.textContent = computerScore;
	};
	const winner = document.querySelector('.winner');

	let winHistory = [];
	// Function to compare Hands of player and computer
	const compareHands = (playerChoice, computerChoice) => {
		//Checking for a tie
		if (playerChoice === computerChoice) {
			winner.textContent = 'It is a tie';
			winHistory.push('t');
			console.log('winHistory: ', winHistory);
			return;
		}
		//Check for Rock
		if (playerChoice === 'rock') {
			if (computerChoice === 'scissors') {
				winner.textContent = 'Player Wins';
				playerScore++;
				winHistory.push('p');
			} else {
				computerScore++;
				winner.textContent = 'Computer Wins';
				winHistory.push('c');
			}
		}
		//Check for Paper
		if (playerChoice === 'paper') {
			if (computerChoice === 'scissors') {
				computerScore++;
				winner.textContent = 'Computer Wins';
				winHistory.push('c');
			} else {
				playerScore++;
				winner.textContent = 'Player Wins';
				winHistory.push('p');
			}
		}
		//Check for scissors
		if (playerChoice === 'scissors') {
			if (computerChoice === 'rock') {
				computerScore++;
				winner.textContent = 'Computer Wins';
				winHistory.push('c');
			} else {
				playerScore++;
				winner.textContent = 'Player Wins';
				winHistory.push('p');
			}
		}
		console.log('winHistory: ', winHistory);
		updateScore();
		gameEnd();
	};
	// This function is to check all options for the game to end:
	//Game ends after 10 times win for Player or Computer OR Game ends when Player or Computer wins 3 times in a row
	const gameEnd = () => {
		if (playerScore === 10) {
			winner.textContent = 'Game Over!!!Player won the game';
			gameOverScreen();
		} else if (computerScore === 10) {
			winner.textContent = 'Game Over!!!Computer won the game';
			gameOverScreen();
		} else if (checkWinsInARow(3)) {
			winner.textContent = 'Game over!!! ' + checkWinsInARow(3);
			gameOverScreen();
		} else {
			console.log('games continue');
		}
	};

	// Function checkWinsInARow to check if a player or computer wins n times in a row => Game end.
	const checkWinsInARow = (winCount) => {
		if (winHistory.length < winCount) {
			return false;
		}
		const itemsCompared = winHistory.slice(winHistory.length - winCount);

		const last = itemsCompared[winCount - 1];
		let counter = 1;

		for (let i = winCount - 2; i >= 0; i--) {
			if (itemsCompared[i] === last) {
				counter++;
			} else {
				break;
			}
			if (counter === winCount) {
				if (last === 'c') {
					return winCount + ' wins in a row for Computer';
				}
				if (last === 'p') {
					return winCount + ' wins in a row for Player';
				}
			}
		}
		return false;
	};

	//Function to hide hands images and buttons when game overs.
	const gameOverScreen = () => {
		showAndHideComponents('hidden', 'none', 'visible', 'hidden');
	};
	//Function to reset the game
	const resetGame = () => {
		winHistory = [];
		playerScore = 0;
		computerScore = 0;
		updateScore();
		showAndHideComponents('visible', 'hidden', 'hidden', 'hidden');
		winner.textContent = 'Choose an option';
	};
	document.querySelector('.resetGame button').addEventListener('click', () => {
		resetGame();
	});
	// Call all the inner function
	startGame();
	playMatch();
};

// start the game function
game();
