const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const MongoClient = require('./db/mongoClient');
const OmdbClient = require('./omdbClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /movies
app.post('/movies', (req, res) => {
  const keys = Object.keys(req.body);
  const title = req.body.title;

  if (title && keys.length === 1) {
    return OmdbClient.getData(title)
    .then(data => {
      MongoClient.collection('movies').insertOne((data), (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }
        return res.status(200).send(result.ops[0]);
      })
    })
    .catch(error => res.status(error.statusCode).send(error.statusMessage));
  }
  return res.status(400).send('Request body should contain only movie title');

});

// GET /movies
app.get('/movies', (req, res) => {
  let {sort, sortdir, ...query} = req.query;
  sort = sort || '_id';
  sortdir = sortdir || -1;
  MongoClient.collection('movies').find(query).sort({[sort]: parseInt(sortdir)}).toArray((error, arr) => {
    if (error) {
      return res.status(500).send(error);
    }
    return res.status(200).send(arr);
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
