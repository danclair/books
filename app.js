const axios = require('axios'); // module to enable web requests ***
const prompt = require('prompt-sync')({ sigint: true }); // module to prompt for user input, also allowing exit with ctrl-C ***
const dotenv = require('dotenv'); // module to process environment variables
dotenv.config(); // execute config file to set env variables
const chalk = require('chalk'); // module to modify text and background color ***
const boxen = require('boxen'); // module to add borders around text ***
// define variable for boxen style of Menu Options ***
const boxenMenuOptions = {
	padding         : 0,
	margin          : 0,
	borderStyle     : 'round',
	borderColor     : 'green',
	backgroundColor : '#555555'
};

let readingList = []; // empty array to store Reading List ***

// function to present user with Menu options
function menuDisplay() {
	console.log(boxen(chalk.white.bold('\n     Menu Options:     \n'), boxenMenuOptions));
	console.log(chalk.white.bold('\n[1] - Search for a book'));
	console.log(chalk.white.bold('[2] - View your Reading List'));
	console.log(chalk.white.bold('[3] - Exit'));
	console.log(chalk.bold('------------------------------\n'));
	menuOptions();
}

// function to make choice from Menu options
function menuOptions(menuChoice) {
	menuChoice = parseInt(prompt('Choose by typing 1, 2, or 3: '));

	while (true) {
		if (menuChoice == 1) {
			webSearch();
			break;
		} else if (menuChoice == 2) {
			displayReadingList();
			break;
		} else if (menuChoice == 3) {
			console.log(chalk.yellow.bold('\nThanks and have a nice day!\n'));
			return;
		} else {
			console.log(chalk.red.bold('ERROR'));
			console.log(chalk.red.bold('Please type only 1, 2, or 3'));
			menuOptions();
			break;
		}
	}
}
// function to search Google Books API
function webSearch(searchTerm) {
	console.log('\n');
	searchTerm = prompt('Enter a term to search for a book: '); // user is prompted for search term
	// console.log(typeof searchTerm);

	// if (searchTerm.length != 0) {
	const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=5&key=${process
		.env.BOOKS_API_KEY}`; // create url variable to insert user search term into Google Books API request
	displaySearch(url);
	// } else {
	// 	console.log('GOTCHA');
	// }
}
function displaySearchList(searchResults) {
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
	}
}
function addToReadingList(searchResults) {
	console.log('\n');
	listChoice = prompt('Choose a book to add to reading list (1-5), or type m to return to Menu Options: ');
	while (true) {
		// checks listChoice for validity ***
		if (
			parseInt(listChoice) == 1 ||
			parseInt(listChoice) == 2 ||
			parseInt(listChoice) == 3 ||
			parseInt(listChoice) == 4 ||
			parseInt(listChoice) == 5
		) {
			readingList.push(searchResults[listChoice - 1].volumeInfo);
			console.log(
				boxen(
					chalk.bold(
						'You added: ' + searchResults[listChoice - 1].volumeInfo.title + ' to your Reading List!'
					),
					{
						padding     : 1,
						borderColor : 'cyan',
						borderStyle : 'double'
					}
				)
			);
			menuDisplay();
			break;
		} else if (listChoice === 'm') {
			menuDisplay();
			break;
		} else {
			console.log(
				boxen(chalk.red.bold('   *** ERROR ***   '), {
					borderColor : 'red'
				})
			);
			console.log(
				boxen(chalk.red.bold('Your choice must be 1-5'), {
					borderColor : 'red'
				})
			);
			displaySearchList(searchResults);
			addToReadingList(searchResults);
			// break;
		}
	}
}
// function to display book search interface
function displaySearch(url) {
	axios
		.get(url)
		.then((resp) => {
			console.log(
				boxen(chalk.green.bold('** Search results: **'), {
					borderColor : 'green'
				})
			);
			let searchResults = resp.data.items;

			displaySearchList(searchResults);
			// loop over searchResults to print in more readable format
			// for (let i = 0; i < searchResults.length; i++) {
			// 	console.log(
			// 		boxen(`Item ${i + 1}`, {
			// 			borderColor : 'cyan'
			// 		})
			// 	);
			// 	console.log('Title: ' + searchResults[i].volumeInfo.title);
			// 	if (searchResults[i].volumeInfo.authors == undefined) {
			// 		console.log('Author: ' + searchResults[i].volumeInfo.authors);
			// 	} else {
			// 		for (let a = 0; a < searchResults[i].volumeInfo.authors.length; a++) {
			// 			console.log('Author: ' + searchResults[i].volumeInfo.authors[a]);
			// 		}
			// 	}
			// 	console.log('Publisher: ' + searchResults[i].volumeInfo.publisher);
			// 	console.log(chalk.yellow.bold('------------------------------'));
			// }

			addToReadingList(searchResults);
			// prompting user to add book to reading list
			// console.log('\n');
			// listChoice = prompt('Choose a book to add to reading list (1-5), or type m to return to Menu Options: ');
			// while (true) {
			// 	// checks listChoice for validity
			// 	if (
			// 		parseInt(listChoice) == 1 ||
			// 		parseInt(listChoice) == 2 ||
			// 		parseInt(listChoice) == 3 ||
			// 		parseInt(listChoice) == 4 ||
			// 		parseInt(listChoice) == 5
			// 	) {
			// 		readingList.push(searchResults[listChoice - 1].volumeInfo);
			// 		console.log(
			// 			boxen(
			// 				chalk.bold(
			// 					'You added: ' + searchResults[listChoice - 1].volumeInfo.title + ' to your Reading List!'
			// 				),
			// 				{
			// 					padding     : 1,
			// 					borderColor : 'cyan',
			// 					borderStyle : 'double'
			// 				}
			// 			)
			// 		);
			// 		menuDisplay();
			// 		break;
			// 	} else if (listChoice === 'm') {
			// 		menuDisplay();
			// 		break;
			// 	} else {
			// 		console.log(
			// 			boxen(chalk.red.bold('   *** ERROR ***   '), {
			// 				borderColor : 'red'
			// 			})
			// 		);
			// 		console.log(
			// 			boxen(chalk.red.bold('Your choice must be 1-5'), {
			// 				borderColor : 'red'
			// 			})
			// 		);
			// 		displaySearch(url);
			// 		break;
			// 	}
			// }
		})
		.catch((error) => {
			console.log('ERROR');
			webSearch();
		});
}

// function to display the Reading List
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
				boxen(`Book ${i + 1}`, {
					borderColor : 'cyan'
				})
			);
			console.log(chalk.yellow.bold('Title: ') + readingList[i].title);
			if (readingList[i].authors == undefined) {
				console.log(chalk.yellow.bold('Author: ') + readingList[i].authors);
			} else {
				for (let a = 0; a < readingList[i].authors.length; a++) {
					console.log(chalk.yellow.bold('Author: ') + readingList[i].authors[a]);
				}
			}

			console.log(chalk.yellow.bold('Publisher: ') + readingList[i].publisher);
			console.log(chalk.cyan.bold('------------------------------'));
			console.log('\n');
		}
	}

	returnToMenu();
}
// function to go back to main Menu Options ***
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
