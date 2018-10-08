const {MongoClient} = require('mongodb');
let db;
MongoClient.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/MovieApp',
  {useNewUrlParser: true},
  (error, client) => {
    if (error) {
      return error;
    }
    db = client.db();
    try {
      db.createCollection('movies');
      db.createCollection('comments');
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports.collection  = collectionName => db.collection(collectionName);
