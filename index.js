require('dotenv').config();
const https = require('https');
const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');

const { DB_URL, PORT } = process.env;

mongoose
  .connect(DB_URL)
  .then(() => console.log('mongo connected'), err => console.log(err));

const app = express();
app.listen(PORT || 8080, () =>
  console.log('Listening on port ' + (PORT || 8080))
);

app.use(require('cors')());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use('/api', require('./api'));

app.use(express.static(__dirname + '/src/build'));

setInterval(() => {
  https.get('https://bangladesh-smallpox.now.sh/');
}, 300000);
