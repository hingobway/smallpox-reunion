const db = require('mongoose');

exports.Entry = db.model(
  'Entry',
  db.Schema({
    user: String,
    before: [String],
    after: [String]
  })
);

exports.Image = db.model(
  'Image',
  db.Schema({
    url: String,
    caption: String
  })
);

exports.User = db.model(
  'User',
  db.Schema({
    name: String,
    email: String,
    scope: String,
    auth: String
  })
);
