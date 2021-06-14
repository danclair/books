const axios = require('axios'); // module to enable web requests
const prompt = require('prompt-sync')(); // module to prompt for user input
const dotenv = require('dotenv'); // module to process environment variables
dotenv.config(); // execute config file to set env variables
const chalk = require('chalk'); // module to modify text and background color
const boxen = require('boxen'); // module to add borders around text
const boxenOptions = {
	padding         : 0,
	margin          : 0,
	borderStyle     : 'round',
	borderColor     : 'green',
	backgroundColor : '#555555'
};

let readingList = []; // empty array to store Reading List

// function to present user with Menu options
function menuOptions() {
	console.log(boxen(chalk.white.bold('\n     Options:     \n'), boxenOptions));

	console.log(chalk.white.bold('\n[1] - Search for a book'));
	console.log(chalk.white.bold('[2] - View your Reading List'));
	console.log(chalk.white.bold('[3] - Exit\n'));
	console.log('------------------------------');

	let menuChoice = prompt('Choose by typing 1, 2, or 3: ');
	menuChoice = parseInt(menuChoice);
	if (menuChoice == 1) {
		webSearch();
	} else if (menuChoice == 2) {
		if (readingList.length === 0) {
			console.log('\n*** Your reading list is empty! ***');
			menuOptions();
		} else {
			displayReadingList();
			menuOptions();
		}
	} else if (menuChoice == 3) {
		console.log('\nThanks and have a nice day!\n');
		return;
	}
}

// function to search Google Books API
function webSearch() {
	let searchTerm = prompt('Enter a term to search for a book: '); // user is prompted for search term
	const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=5&key=${process
		.env.BOOKS_API_KEY}`; // create url variable to insert user search term into Google Books API request
	axios.get(url).then((resp) => {
		console.log('** Search results: **');
		let searchResults = resp.data.items;
		console.log(searchResults);

		// loop over searchResults to print in more readable format
		for (let i = 0; i < searchResults.length; i++) {
			console.log(`Item ${i + 1}`);
			console.log('Title: ' + searchResults[i].volumeInfo.title);
			if (searchResults[i].volumeInfo.authors == undefined) {
				console.log('Author: ' + searchResults[i].volumeInfo.authors);
			} else {
				for (let a = 0; a < searchResults[i].volumeInfo.authors.length; a++) {
					console.log('Author: ' + searchResults[i].volumeInfo.authors[a]);
				}
			}
			console.log('Publisher: ' + searchResults[i].volumeInfo.publisher);
			console.log('\n');
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

		// prompting user to
		let userInput = prompt('Choose a book to add to reading list (1-5): ');
		userInput = parseInt(userInput);
		// while (
		// 	// parseInt(userInput) !== 1 ||
		// 	// parseInt(userInput) !== 2 ||
		// 	// parseInt(userInput) !== 3 ||
		// 	// parseInt(userInput) !== 4 ||
		// 	// parseInt(userInput) !== 5
		// 	userInput !== 1 &&
		// 	userInput !== 2 &&
		// 	userInput !== 3 &&
		// 	userInput !== 4 &&
		// 	userInput !== 5
		// ) {
		// 	let userInput = prompt('Your choice must be 1-5: ');
		// 	userInput = parseInt(userInput);
		// 	// console.log('inside loop ' + typeof userInput);
		// 	// userInput;
		// }

		console.log(
			'\nYou added: ' + searchResults[parseInt(userInput) - 1].volumeInfo.title + ' to your Reading List!'
		);

		readingList.push(searchResults[parseInt(userInput) - 1].volumeInfo);
		menuOptions();
		// console.log('** Reading List **\n');
		// console.log(readingList);
	});
}

function displayReadingList() {
	console.log('\nYour Reading List:\n');
	for (let i = 0; i < readingList.length; i++) {
		console.log(`Item ${i + 1}`);
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
		console.log('\n');
	}
	// console.log(readingList);
}

console.log(chalk.green.bold('\nWelcome to Books!'));
menuOptions();
// webSearch();
// console.log('this is your hella cool reading list');
// displayReadingList();
