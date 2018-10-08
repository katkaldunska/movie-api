const expect = require('expect');
const supertest = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const MongoClient = require('../db/mongoClient');

describe('POST /movies', () => {
  const validTitle = 'Carrie';
  const invalidTitle = 'Salems Lot';
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
