<h1>Books</h1>
<p>Welcome to the Books app!</p>
<p>Let's get you up and running.</p>

<h3>Set up</h3>
<p>First off, go ahead and clone this repo to your computer.</p>
<p>Next, you'll need to have npm installed. If it's not already installed on your system, find instructions on how to install it <a href='https://www.npmjs.com/get-npm'>here</a>.</p>


<p>Once npm is installed on your computer, go to the directory you just cloned and run this command:</p><br>

```npm init -y```

<br><p>...followed by this command:</p>

```npm install axios boxen chalk dotenv prompt-sync```


<h3>API Key</h3>
<p>Obtain a Google Books API Key. You can find out how to do this <a href='https://developers.google.com/books/docs/v1/using#APIKey'>here</a>.</p>
<p>Once you have your API Key, create a .env file in your main directory.</p>
<p>In the .env file, type:</p>

```BOOKS_API_KEY=```

<p>followed by your recently acquired API key. This will allow the Books app to make requests to the Google Books API.</p>


<h3>Running the app</h3>
<p>Open your terminal to the books directory, and type:</p>

```node app.js```


<p>Follow the onscreen instructions, and enjoy the Books app!</p>


