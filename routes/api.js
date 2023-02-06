/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const mongoose = require('mongoose');
const Library = require('../models/library');
const mySecret = process.env['MONGO_URI'];

module.exports = function(app) {

  //Connect to database
  mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

  app.route('/api/books')
    .get(function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Library.find({}, function(err, books) {
        if (err) return console.log(err);
        if (books.length == 0) {
          res.send('No books found');
        } else {
          res.send(books);
        };
      });
    })

    .post(function(req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.send('missing required field title');
      }

      const newBook = Library({
        title: title
      });

      newBook.save(function(err, book) {
        if (err) return console.error(err);
        res.json({
          _id: book._id,
          title: book.title
        });
      })
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      Library.deleteMany({}, function(err, data) {
        if (err) return console.error(err);
        console.log(data, data.deletedCount);
        if (data.deletedCount > 0) {
          console.log('delete successful');
          res.send('complete delete successful');
        } else {
          res.send('no books to delete');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function(req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Library.findById(bookid, function(err, book) {
        if (err) return console.log(err);
        if (!book) {
          return res.send('no book exists');
        } else {
          return res.json(book);
        }
      })
    })

    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.send('missing required field comment');
      }

      Library.findById(bookid, function(err, book) {
        if (err) return console.log(err);
        if (!book) {
          return res.send('no book exists');
        }
        book.comments.push(comment);
        book.commentcount++;
        book.save((err, updatedBook) => {
          if (err) return console.log(err);
          if (updatedBook) {
            return res.json(updatedBook);
          } else {
            return res.send('could not update');
          }
        })
      });
    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Library.findByIdAndDelete(bookid, function(err, book) {
        if (err) return console.log(err);
        if (book) {
          return res.send('delete successful');
        } else {
          return res.send('no book exists');
        }
      });
    });

};
