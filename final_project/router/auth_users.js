const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Invalid username or password"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60* 60});

    req.session.authentication = {
      accessToken, username
    };
    return res.status(200).json({message: "Login successful"});
  } else{
    return res.status(208).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    const book = books[isbn];
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }
    if (!review) {
      return res.status(400).json({message: "Review text is required"});
    }

    book.reviews[username] = review;
    return res.status(200).json({message: "Review successfully added/updated", reviews: book.reviews});
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  if (book.reviews[username] !== undefined) {
    delete book.reviews[username];
    return res.status(200).json({message: "Review successfully deleted", reviews: book.reviews});
  } else {
    return res.status(404).json({message: "No review by this user to delete"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
