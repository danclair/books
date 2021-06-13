const axios = require('axios');
const prompt = require('prompt-sync')();
let searchTerm = prompt('Enter a term to search for a book: ');
const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=5&key=AIzaSyBOGGLkQOgeKByLPkFw463lF4THZ8Oo9aI`;

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
	}
});
