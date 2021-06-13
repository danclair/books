const axios = require('axios');
const prompt = require('prompt-sync')();

let searchTerm = prompt('Enter a term to search for a book: ');
const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=5&key=API_KEY`;
let readingList = [];

axios.get(url).then((resp) => {
	console.log('** Search results: **');
	let searchResults = resp.data.items;
	for (let i = 0; i < searchResults.length; i++) {
		console.log(`Item ${i + 1}`);
		console.log('Title: ' + searchResults[i].volumeInfo.title);
		for (let a = 0; a < searchResults[i].volumeInfo.authors.length; a++) {
			console.log('Author: ' + searchResults[i].volumeInfo.authors[a]);
		}
		console.log('Publisher: ' + searchResults[i].volumeInfo.publisher);
		console.log('\n');
	}
	let user_input = prompt('Choose a book to add to reading list (1-5): ');
	// while (
	// 	// parseInt(user_input) != 1 ||
	// 	// parseInt(user_input) != 2 ||
	// 	// parseInt(user_input) != 3 ||
	// 	// parseInt(user_input) != 4 ||
	// 	// parseInt(user_input) != 5
	// 	user_input != 1 ||
	// 	user_input != 2 ||
	// 	user_input != 3 ||
	// 	user_input != 4 ||
	// 	user_input != 5
	// ) {
	// 	let user_input = prompt('Your choice must be 1-5: ');
	// }

	console.log(
		'\nYou selected ' + searchResults[parseInt(user_input) - 1].volumeInfo.title + ' to add to your Reading List!'
	);
	readingList.push(searchResults[parseInt(user_input) - 1].volumeInfo);
	console.log('Here is your Reading List:');
	console.log(readingList);
	// console.log(user_input);
	// console.log(searchResults[4]);
	// console.log(typeof user_input);
	// console.log(typeof parseInt(user_input));
	// console.log(searchResults[parseInt(user_input) - 1].volumeInfo.title);
});
