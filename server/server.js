const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const OmdbClient = require('./omdbClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
