const axios = require('axios');
const prompt = require('prompt-sync')();
let searchTerm = prompt('Enter a term to search for a book: ');
const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(volumeInfo(title,authors,publisher))&maxResults=1&key=MY_API_KEY`;

let readingList = [];

axios.get(url).then((resp) => {
	console.log('** Search results: **');
	let searchResults = resp.data.items;
	console.log(searchResults);
});
