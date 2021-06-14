const axios = require('axios'); // module to enable web requests
const prompt = require('prompt-sync')(); // module to prompt for user input
const dotenv = require('dotenv'); // module to process environment variables
dotenv.config();

let readingList = []; // empty array to store Reading List

// function to search Google Books API
function webSearch() {
	let searchTerm = prompt('Enter a term to search for a book: '); // user is prompted for search term
	const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=5&key=${process
		.env.BOOKS_API_KEY}`; // create url variable to insert user search term into Google Books API request
	axios.get(url).then((resp) => {
		console.log('** Search results: **');
		let searchResults = resp.data.items;
		// loop over searchResults to print in more readable format
		for (let i = 0; i < searchResults.length; i++) {
			console.log(`Item ${i + 1}`);
			console.log('Title: ' + searchResults[i].volumeInfo.title);
			for (let a = 0; a < searchResults[i].volumeInfo.authors.length; a++) {
				console.log('Author: ' + searchResults[i].volumeInfo.authors[a]);
			}
			console.log('Publisher: ' + searchResults[i].volumeInfo.publisher);
			console.log('\n');
		}
		let userChoice = prompt('Would you like to add a book to your reading list (y/n)?');

		while (userChoice !== 'y' || userChoice !== 'n') {
			let userChoice = prompt('Please only enter y or n');
		}
		if (userChoice == 'y') {
			let userInput = prompt('Choose a book to add to reading list (1-5): ');
			userInput = parseInt(userInput);
		} else if (userChoice == 'n') {
			console.log('Thank you');
		}

		// console.log(typeof userInput);
		// console.log(userInput);

		// while (
		// 	// parseInt(userInput) !== 1 ||
		// 	// parseInt(userInput) !== 2 ||
		// 	// parseInt(userInput) !== 3 ||
		// 	// parseInt(userInput) !== 4 ||
		// 	// parseInt(userInput) !== 5
		// 	userInput !== 1 ||
		// 	userInput !== 2 ||
		// 	userInput !== 3 ||
		// 	userInput !== 4 ||
		// 	userInput !== 5
		// ) {
		// 	let userInput = prompt('Your choice must be 1-5: ');
		// 	userInput = parseInt(userInput);
		// 	// console.log('inside loop ' + typeof userInput);
		// 	// return userInput;
		// }

		console.log(
			'\nYou added: ' + searchResults[parseInt(userInput) - 1].volumeInfo.title + ' to your Reading List!'
		);

		readingList.push(searchResults[parseInt(userInput) - 1].volumeInfo);
		// console.log('Here is your Reading List:');
		// console.log(readingList);

		// console.log(userInput);
		// console.log(searchResults[4]);
		// console.log(typeof userInput);
		// console.log(typeof parseInt(userInput));
		// console.log(searchResults[parseInt(userInput) - 1].volumeInfo.title);
	});
}

function displayReadingList() {
	console.log(readingList);
}
webSearch();
console.log('this is your hella cool reading list');
displayReadingList();
