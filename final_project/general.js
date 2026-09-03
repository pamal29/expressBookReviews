const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books using async/await with a callback function
async function getAllBooks() {
  function processResponse(response) {
    console.log("All Books:\n", JSON.stringify(response.data, null, 2));
  }
  try {
    const response = await axios.get(`${BASE_URL}/`);
    processResponse(response);
  } catch (error) {
    console.error("Error fetching all books:", error.message);
  }
}

// Search by ISBN using Promises
function getBookByISBN(isbn) {
  axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => {
      console.log(`Book with ISBN ${isbn}:\n`, JSON.stringify(response.data, null, 2));
    })
    .catch(error => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    });
}

// Search by Author using Promises
function getBooksByAuthor(author) {
  axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
    .then(response => {
      console.log(`Books by ${author}:\n`, JSON.stringify(response.data, null, 2));
    })
    .catch(error => {
      console.error(`Error fetching books by ${author}:`, error.message);
    });
}

// Search by Title using async/await
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(`Books titled "${title}":\n`, JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(`Error fetching books titled "${title}":`, error.message);
  }
}

// Run all four
(async () => {
  await getAllBooks();
  getBookByISBN(1);
  getBooksByAuthor("Jane Austen");
  await getBooksByTitle("Fairy tales");
})();

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };