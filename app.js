const axios = require('axios'); // module to enable web requests
const prompt = require('prompt-sync')({ sigint: true }); // module to prompt for user input, also allowing exit with ctrl-C
const dotenv = require('dotenv'); // module to process environment variables
dotenv.config(); // execute config file to set env variables
const chalk = require('chalk'); // module to modify text and background color
const boxen = require('boxen'); // module to add borders around text
// define variable for box style options
const boxenOptions = {
	padding     : 0,
	margin      : 0,
	borderStyle : 'round',
	borderColor : 'green'
	// backgroundColor : '#555555'
};

let readingList = []; // empty array to store Reading List

// function to present user with Menu options
function menuDisplay() {
	console.log(boxen(chalk.white.bold('\n     Menu Options:     \n'), boxenOptions));
	console.log(chalk.white.bold('\n[1] - Search for a book'));
	console.log(chalk.white.bold('[2] - View your Reading List'));
	console.log(chalk.white.bold('[3] - Exit'));
	console.log('------------------------------\n');
	menuOptions();
	// }
}

// function to make choice from Menu options
function menuOptions(menuChoice) {
	menuChoice = parseInt(prompt('Choose by typing 1, 2, or 3: '));
	// menuChoice = parseInt(menuChoice);

	// while (menuChoice != 1 && menuChoice != 2 && menuChoice != 3) {
	// 	menuChoice = parseInt(prompt('Please try again. Only type 1, 2, or 3: '));
	// menuChoice = parseInt(menuChoice);
	if (menuChoice == 1) {
		webSearch();
	} else if (menuChoice == 2) {
		// } else {
		displayReadingList();

		// }
	} else if (menuChoice == 3) {
		console.log(chalk.yellow.bold('\nThanks and have a nice day!\n'));
		return;
	} else {
		console.log(chalk.red.bold('ERROR'));
		menuChoice = prompt('Please type only 1, 2, or 3: ');
		menuOptions(menuChoice);
	}
}

// function to search Google Books API
function webSearch(searchTerm) {
	console.log('\n');
	searchTerm = prompt('Enter a term to search for a book: '); // user is prompted for search term
	const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=5&key=${process
		.env.BOOKS_API_KEY}`; // create url variable to insert user search term into Google Books API request
	axios.get(url).then((resp) => {
		console.log(
			boxen(chalk.green.bold('** Search results: **'), {
				borderColor : 'green'
			})
		);
		let searchResults = resp.data.items;
		// console.log(searchResults);

		// loop over searchResults to print in more readable format
		for (let i = 0; i < searchResults.length; i++) {
			console.log(
				boxen(`Item ${i + 1}`, {
					borderColor : 'cyan'
				})
			);
			console.log('Title: ' + searchResults[i].volumeInfo.title);
			if (searchResults[i].volumeInfo.authors == undefined) {
				console.log('Author: ' + searchResults[i].volumeInfo.authors);
			} else {
				for (let a = 0; a < searchResults[i].volumeInfo.authors.length; a++) {
					console.log('Author: ' + searchResults[i].volumeInfo.authors[a]);
				}
			}
			console.log('Publisher: ' + searchResults[i].volumeInfo.publisher);
			console.log(chalk.yellow.bold('------------------------------'));
			// console.log('\n');
		}

		// loop to determine if user wants to add a book to the reading list
		// let userChoice = prompt('Would you like to add a book to your reading list (y/n)? ');

		// // check for correct answer of y or n
		// while (userChoice !== 'y' && userChoice !== 'n') {
		// 	userChoice = prompt('Please only enter y or n: ');
		// 	if (userChoice == 'y') {
		// 		let userInput = prompt('Choose a book to add to reading list (1-5): ');
		// 		userInput = parseInt(userInput);
		// 	} else if (userChoice == 'n') {
		// 		console.log('Thank you');
		// 	}
		// }

		// console.log(typeof userInput);
		// console.log(userInput);

		// prompting user to add book to reading list
		console.log('\n');
		let addToList = parseInt(prompt('Choose a book to add to reading list (1-5): '));

		if (addToList == 1 || addToList == 2 || addToList == 3 || addToList == 4 || addToList == 5) {
			readingList.push(searchResults[addToList - 1].volumeInfo);
			console.log('\nYou added: ' + searchResults[addToList - 1].volumeInfo.title + ' to your Reading List!');
			menuDisplay();
		} else {
			while (
				// parseInt(userInput) !== 1 ||
				// parseInt(userInput) !== 2 ||
				// parseInt(userInput) !== 3 ||
				// parseInt(userInput) !== 4 ||
				// parseInt(userInput) !== 5
				addToList != 1 ||
				addToList != 2 ||
				addToList != 3 ||
				addToList != 4 ||
				addToList != 5
			) {
				addToList = parseInt(prompt('Your choice must be 1-5: '));
			}
		}
	});
}

// function to display user's reading list
function displayReadingList() {
	if (readingList.length === 0) {
		console.log(
			boxen(chalk.red.bold('*** Your reading list is empty! ***'), {
				borderColor : 'red',
				padding     : 1
			})
		);
		console.log('\n');
	} else {
		console.log(
			boxen(chalk.green.bold('*** Your Reading List ***'), {
				borderColor : 'white',
				padding     : 1
			})
		);
		for (let i = 0; i < readingList.length; i++) {
			console.log(
				boxen(`Item ${i + 1}`, {
					borderColor : 'cyan'
				})
			);
			console.log('Title: ' + readingList[i].title);
			if (readingList[i].authors == undefined) {
				console.log('Author: ' + readingList[i].authors);
			} else {
				for (let a = 0; a < readingList[i].authors.length; a++) {
					console.log('Author: ' + readingList[i].authors[a]);
				}
			}
			// for (let a = 0; a < readingList[i].authors.length; a++) {
			// 	console.log('Author: ' + readingList[i].authors[a]);
			// }
			console.log('Publisher: ' + readingList[i].publisher);
			console.log(chalk.cyan.bold('------------------------------'));
			console.log('\n');
		}
	}

	returnToMenu();
	// console.log(readingList);
}

function returnToMenu(returnChoice) {
	returnChoice = prompt('Would you like to return to the main menu (y/n)? ');
	if (returnChoice.toLowerCase() == 'y') {
		menuDisplay();
	} else if (returnChoice.toLowerCase() == 'n') {
		console.log(chalk.yellow.bold('\nThanks and have a nice day!\n'));
		return;
	} else {
		console.log(chalk.red.bold('ERROR'));
		returnToMenu();
	}
}

console.log(chalk.green.bold('\nWelcome to Books!'));
menuDisplay();
// webSearch();
// console.log('this is your hella cool reading list');
// displayReadingList();
