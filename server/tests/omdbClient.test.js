const expect = require('expect');
const OmdbClient = require('../omdbClient');

describe('OMDB client GET', () => {
  const validTitle = 'Carrie';
  const invalidTitle = 'Salems Lot';

  it('should return a movie', (done) => {
    OmdbClient.getData(validTitle).then(data => {
      expect(typeof data).toBe('object');
      expect(data).toHaveProperty('Title');
      expect(data).not.toHaveProperty('Error');
      expect(data.Title).toBe(validTitle);
      done();
    });
  });

  it('should not find a movie', (done) => {
    OmdbClient.getData(invalidTitle).then(
      success => Promise.reject(new Error('Expected method to reject.')),
      error => {
        expect(error).toHaveProperty('statusMessage');
        done();
      }
    );
  });

});
