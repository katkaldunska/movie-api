# movie-api
Simple REST API - a basic movie database interacting with external API
API is hosted online by Heroku at https://stark-retreat-16685.herokuapp.com/

## Endpoints

### POST /movies
Request body can contain only title which is required.
Request response contain full movie object with data fetched from external API.

### GET /movies
Request response contain list of all movies from database.
Sorting available by adding to query params:
- _sort_  with value of movie param which to sort
- _sortdir_ param to query with value _1_ for ASC and _-1_ for DESC.

```
/movies?sort=Title&sortdir=1
```
Filtering available by adding movie param with value to query
```
/movies?Title=Carrie
```

### POST /comments
Request response must contain _movieId_, which corresponds to valid movie _id_, and _body_.
Request response contain added comment object.

### GET /comments
Request response contain list of all comments from database.
Filtering available by adding comment param with value to query
```
/movies?movieId=5bbd0c0b0811ec001532f991
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run app on local computer required are:

- installed Node.js
- API key for http://www.omdbapi.com/
- MongoDB URI

### Installing

After cloning the repository install dependencies:
```
npm install
```

Add OMDB API key to process env
```
export OMDB_API_KEY=<YOUR_OMDB_API_KEY>
```

Add MongoDB URI to process env
```
export MONGODB_URI=<YOUR_MONGODB_URI>
```

And run app
```
npm start
```

## Running the tests

Run tests by
```
npm test
```

## Built With
DB
- MongoDB v4.0.0
- DB hosted by Heroku addon mLab https://mlab.com/

Node.js v10.4.1

Modules used for deployment
- body-parser
- express
- mongodb
- request

Modules used for test
- expect
- mocha
- supertest

OMDb API (http://www.omdbapi.com/) - used for retrieving movies data.

## Authors

**Katarzyna Kałduńska**
(https://github.com/katkaldunska)


## License

This project is licensed under the MIT License
