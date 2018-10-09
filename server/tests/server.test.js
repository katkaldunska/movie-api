const expect = require('expect');
const supertest = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const MongoClient = require('../db/mongoClient');

const validTitle = 'Carrie';
const invalidTitle = 'Salems Lot';

describe('POST /movies', () => {

  beforeEach(done => MongoClient.collection('movies').deleteMany({}, (err => done())));

  it('should create a new movie', (done) => {

    supertest(app)
      .post('/movies')
      .send({title: validTitle})
      .expect(200)
      .expect((res) => {
        expect(res.body.Title).toBe(validTitle);
      })
      .end((err, res) => {
        expect(typeof res.body).toBe('object');
        MongoClient.collection('movies').find({}).toArray((err, arr) => {
          expect(arr.length).toBe(1);
          expect(arr[0]).toHaveProperty('Title');
          expect(arr[0].Title).toBe(validTitle);
        });
        done();
      });
  });

  it('should not create a new movie with invalid title', (done) => {

    supertest(app)
      .post('/movies')
      .send({title: invalidTitle})
      .expect(400)
      .end((err, res) => {
        expect(res).toHaveProperty('error');
        MongoClient.collection('movies').find({}).toArray((err, arr) => {
          expect(arr.length).toBe(0);
        });
        done();
      });
  });

  it('should not create a new movie with invalid body', (done) => {

    supertest(app)
      .post('/movies')
      .send({title: validTitle, test: 'test'})
      .expect(400)
      .end((err, res) => {
        expect(res).toHaveProperty('error');
        MongoClient.collection('movies').find({}).toArray((err, arr) => {
          expect(arr.length).toBe(0);
        });
        done();
      });
  });

});

describe('GET /movies', () => {
  before(done => MongoClient.collection('movies').insertOne({title: validTitle}, err => done()));
  it('should get movies', (done) => {

    supertest(app)
      .get('/movies')
      .expect(200)
      .end((err, res) => {
        expect(res.body.length).toBe(1);
        done();
      });
    });
});

describe('POST /comments', () => {
  let movieId;
  beforeEach(done => MongoClient.collection('comments').deleteMany({}, (err => done())));
  before(done => MongoClient.collection('movies').insertOne({title: validTitle}, err => done(), data => {
    movieId = data.ops[0]._id;
  }));

  it('should create a new comment', (done) => {

    supertest(app)
      .post('/comments')
      .send({movieId: movieId, body: 'test'})
      .expect(200)
      .expect((res) => {
        expect(res.body.movieId).toBe(movieId);
      });
        done();
    });

  it('should not create a new comment with invalid movieId', (done) => {

    supertest(app)
      .post('/movies')
      .send({movieId: new ObjectID(), body: 'test'})
      .expect(404)
      .end((err, res) => {
        expect(res).toHaveProperty('error');
        MongoClient.collection('comments').find({}).toArray((err, arr) => {
          expect(arr.length).toBe(0);
        });
        done();
      });
  });
  
});
