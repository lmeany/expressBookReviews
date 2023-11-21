const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        console.log(users)
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});
  
// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     res.send(JSON.stringify(books,null,4));
// });

// Get the book list available in the shop using promise
let getBookList = new Promise((resolve,reject) => {
    resolve(books);
})

public_users.get('/', (req,res) => {
    getBookList.then((books) => {
        res.send(JSON.stringify(books,null,4))
    });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',(req, res) => {
//     const isbn = req.params.isbn;
//     res.send(books[isbn]);
// });

// Get book details based on ISBN using promise
function getListBookIsbn(isbn) {
    let book = books[isbn];
    return new Promise((resolve,reject) => {
        if(book) {
            resolve(book);
        }else {
            reject("Unable to find Books!");
        };
    });
};

public_users.get("/isbn/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    getListBookIsbn(isbn).then(
        (book) => res.send(book),
        (err) => res.send(err)
    );
})

// Get book details based on author
// public_users.get('/author/:author', (req, res) => {
//     let author = []
//     for(const [key, values] of Object.entries(books)){
//         const book = Object.entries(values);
//         for(let i = 0; i < book.length ; i++){
//             if(book[i][0] == 'author' && book[i][1] == req.params.author){
//                 ans.push(books[key]);
//             }
//         }
//     }
//     if(author.length == 0){
//         return res.status(300).json({message: "Author not found"});
//     }
//     res.send(author);
// });

// Get book details based on author with promise
function getListFromAuthor(author){
    let authors = [];
    return new Promise((resolve,reject) => {
        for(var isbn in books) {
            let book = books[isbn];
            if(book.author === author){
                authors.push(book);
            }
        }
        if(authors.length>0){
            resolve(authors);
        }else{
            reject("Unable to find Author!");
        };
    });
};

public_users.get("/author/:author", (req,res) => {
    const author = req.params.author;
    getListFromAuthor(author).then(
        (book) => res.send(book),
        (err) => res.send(err)
    )
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     let title = [];
//     for(const [key,value] of Object.entries(books)){
//         const book = Object.entries(value);
//         for(let i = 0; i < book.length; i++){
//             if(book[i][0] == 'title' && book[i][1] == req.params.title){
//                 title.push(books[key]);
//             }
//         }
//     }
//     if(title.length == 0){
//         return res.status(300).json({message: "Title not found"});
//     }
//     res.send(title);
// });

function getListFromTitle(title){
    let titles = [];
    return new Promise((resolve,reject) => {
        for(var isbn in books) {
            let book = books[isbn];
            if(book.title === title){
                titles.push(book);
            }
        }
        if(titles.length>0){
            resolve(titles);
        }else{
            reject("Unable to find titles!");
        };
    });
};

public_users.get("/title/:title", (req,res) => {
    const title = req.params.title;
    getListFromTitle(title).then(
        (book) => res.send(book),
        (err) => res.send(err)
    )
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
