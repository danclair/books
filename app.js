const axios = require('axios');

const url = `https://www.googleapis.com/books/v1/volumes?q=pizza&key=AIzaSyBgc639eGVx__EC6uT1lVAkKKkghGQrJU4`;

axios.get(url).then((resp) => {
	console.log(resp.data.items);
});
