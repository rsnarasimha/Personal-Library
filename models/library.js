const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const librarySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  comments: {
    type: [String]
  },
  commentcount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Library', librarySchema);
