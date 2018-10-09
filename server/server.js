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

// POST /comments
app.post('/comments', (req, res) => {
  const {movieId, body} = req.body;

  if (movieId && ObjectID.isValid(movieId) && body) {

    return MongoClient.collection('movies').findOne({_id: ObjectID(movieId)}, (error, data) => {
      if (error) {
        return res.status(500).send(error);
      } else if (!data) {
        return res.status(404).send('Movie not found');
      }

      return handleCommentInsert(movieId, body)
      .then(data => res.status(200).send(data))
      .catch(error => res.status(500).send(error));

    });
  }
  return res.status(400).send('Request must contain movieId and body');

});



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

const handleCommentInsert = (movieId, body) => {
  return new Promise ((fullfill, reject) => {
    MongoClient.collection('comments').insertOne({movieId, body}, (error, result) => {
      if (error) {
        reject(error);
      }
      fullfill(result.ops[0]);
    })
  });
};

module.exports = {app};
