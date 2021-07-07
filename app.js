const axios = require('axios');
const prompt = require('prompt-sync')({ sigint: true });
const dotenv = require('dotenv'); // module to process environment variables
dotenv.config(); // execute config file to set env variables
const chalk = require('chalk');
const boxen = require('boxen');
const boxenMenuOptions = {
	padding         : 0,
	margin          : 0,
	borderStyle     : 'round',
	borderColor     : 'green',
	backgroundColor : '#555555'
};

class BookCLI {
	constructor() {
		this.readingList = [];
	}

	// function to present user with Menu options
	menuDisplay() {
		console.log(boxen(chalk.white.bold('\n     Menu Options:     \n'), boxenMenuOptions));
		console.log(chalk.white.bold('\n[1] - Search for a book'));
		console.log(chalk.white.bold('[2] - View your Reading List'));
		console.log(chalk.white.bold('[3] - Exit'));
		console.log(chalk.bold('------------------------------\n'));
		this.menuOptions();
	}

	// function to make choice from Menu options
	menuOptions(menuChoice) {
		menuChoice = parseInt(prompt('Choose by typing 1, 2, or 3: '));

		while (true) {
			if (menuChoice == 1) {
				this.webSearch();
				break;
			} else if (menuChoice == 2) {
				this.displayReadingList();
				break;
			} else if (menuChoice == 3) {
				console.log(chalk.yellow.bold('\nThanks and have a nice day!\n'));
				return false;
			} else {
				console.log(chalk.red.bold('ERROR'));
				console.log(chalk.red.bold('Please type only 1, 2, or 3'));
				this.menuOptions();
				break;
			}
		}
	}

	// function to search Google Books API
	webSearch(searchTerm) {
		console.log('\n');
		searchTerm = prompt('Enter a term to search for a book: '); // user is prompted for search term

		const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=5&key=${process
			.env.BOOKS_API_KEY}`; // create url variable to insert user search term into Google Books API request
		this.displaySearch(url);
	}

	// function to display book search interface
	displaySearch(url) {
		axios
			.get(url)
			.then((resp) => {
				console.log(
					boxen(chalk.green.bold('** Search results: **'), {
						borderColor : 'green'
					})
				);
				let searchResults = resp.data.items;
				this.displaySearchList(searchResults);
				this.addToReadingList(searchResults);
			})
			.catch((error) => {
				console.log(
					boxen(chalk.red.bold('   *** ERROR ***   '), {
						borderColor : 'red'
					})
				);
				console.log(
					boxen(
						chalk.red.bold(
							' Something went wrong! Be sure you enter a valid search term, and that you have a valid API key. '
						),
						{
							borderColor : 'red'
						}
					)
				);
				this.menuDisplay();
			});
	}

	// loops over searchResults to print in more readable format
	displaySearchList(searchResults) {
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

	// function to add selection to Reading List
	addToReadingList(searchResults) {
		console.log('\n');
		let listChoice = prompt('Choose a book to add to reading list (1-5), or type m to return to Menu Options: ');
		while (true) {
			if (
				parseInt(listChoice) == 1 ||
				parseInt(listChoice) == 2 ||
				parseInt(listChoice) == 3 ||
				parseInt(listChoice) == 4 ||
				parseInt(listChoice) == 5
			) {
				this.readingList.push(searchResults[listChoice - 1].volumeInfo);
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
				this.menuDisplay();
				break;
			} else if (listChoice === 'm') {
				this.menuDisplay();
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
				this.displaySearchList(searchResults);
				this.addToReadingList(searchResults);
				break;
			}
		}
	}

	// function to display the Reading List
	displayReadingList() {
		if (this.readingList.length === 0) {
			console.log(
				boxen(chalk.yellow.bold('*** Your reading list is empty! ***'), {
					borderColor : 'yellow',
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
			for (let i = 0; i < this.readingList.length; i++) {
				console.log(
					boxen(`Book ${i + 1}`, {
						borderColor : 'cyan'
					})
				);
				console.log(chalk.yellow.bold('Title: ') + this.readingList[i].title);
				if (this.readingList[i].authors == undefined) {
					console.log(chalk.yellow.bold('Author: ') + this.readingList[i].authors);
				} else {
					for (let a = 0; a < this.readingList[i].authors.length; a++) {
						console.log(chalk.yellow.bold('Author: ') + this.readingList[i].authors[a]);
					}
				}

				console.log(chalk.yellow.bold('Publisher: ') + this.readingList[i].publisher);
				console.log(chalk.cyan.bold('------------------------------'));
				console.log('\n');
			}
		}

		this.returnToMenu();
	}

	returnToMenu(returnChoice) {
		returnChoice = prompt('Would you like to return to the main menu (y/n)? ');
		if (returnChoice.toLowerCase() == 'y') {
			this.menuDisplay();
		} else if (returnChoice.toLowerCase() == 'n') {
			console.log(chalk.yellow.bold('\nThanks and have a nice day!\n'));
			return false;
		} else {
			console.log(chalk.red.bold('ERROR'));
			this.returnToMenu();
		}
	}
}
let obj = new BookCLI();
console.log(chalk.green.bold('\nWelcome to Books!'));
obj.menuDisplay();
