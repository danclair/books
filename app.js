const axios = require('axios');
const prompt = require('prompt-sync')();
let searchTerm = prompt('Enter a term to search for a book: ');
const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=5&key=AIzaSyBOGGLkQOgeKByLPkFw463lF4THZ8Oo9aI`;

let readingList = [];

axios.get(url).then((resp) => {
	console.log('** Search results: **');
	let searchResults = resp.data.items;

	console.log('Title: ' + searchResults[0].volumeInfo.title);
	console.log('Author: ' + searchResults[0].volumeInfo.authors[0]);
	console.log('Publisher: ' + searchResults[0].volumeInfo.publisher);
});
