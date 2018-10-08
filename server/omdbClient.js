const request = require('request');

const OMDB_URL = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`;

class OmdbClient {
  /**
    * Get movie by title
    * @param title {string}
    * @return Promise
  **/
  static getData(title) {
    return new Promise((fullfill, reject) => {
      request({
        method: 'get',
        uri: `${OMDB_URL}&t=${title}`
      }, (error, response, body) => {
        if (error) {
          reject({
            statusCode: error.statusCode,
            statusMessage: error.statusMessage
          });
        } else {
          const bodyDecoded = OmdbClient.parseResponse(body);
          /*OMDB API returns 200 if
          'Movie not found!'
          or
          'Something went wrong.'
          */
          if (bodyDecoded.Error) {
            reject({
              statusCode: 400,
              statusMessage: bodyDecoded.Error
            });
          }

          fullfill(bodyDecoded);
        }
      });
    });
  }

  /**
    * Cast response to Object
    * @param response {mixed} - api response
    * @return response {Object}
  **/
  static parseResponse(response) {
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch (error) {
        return null;
      }
    }

    return response;
  }
};

module.exports = OmdbClient;
