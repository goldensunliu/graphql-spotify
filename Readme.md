## A [Spotify API](https://beta.developer.spotify.com/documentation/web-api/reference/) GraphQL Schema Implementation Built with [GraphQL.js](https://github.com/graphql/graphql-js)
![](https://travis-ci.org/goldensunliu/graphql-spotify.svg?branch=master)
[![npm version](https://badge.fury.io/js/graphql-spotify.svg)](https://badge.fury.io/js/graphql-spotify)

Refer to [src/schema/RootQuery.js](src/schema/RootQuery.js) for operations currently supported.
## Getting started
```javascript
import { makeSchema } from "graphql-spotify"
let token;
//... somewhere the Spotify token is gotten from the context
const schema = makeSchema(token)
// pass the schema to your favorite server that accepts GraphQL.js Schemas
```
**Make sure the token obtained has the [correct scope](https://beta.developer.spotify.com/documentation/general/guides/scopes/), certain queries and mutations require [different scopes](https://beta.developer.spotify.com/documentation/general/guides/scopes/) from Spotify**
### Getting started with apollo-server-express
`npm install --save graphql dataloader graphql-tools isomorphic-fetch body-parser apollo-server-express express graphql-spotify`

##### ES6
```javascript
import { makeSchema } from "graphql-spotify";
import { graphqlExpress } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser'
// Initialize the app
const port = parseInt(process.env.PORT, 10) || 3000
const app = express();
// bodyParser is needed just for POST.
app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => {
        let token;
        //... somewhere the spotify token is gotten from the context
        const schema = makeSchema(token)
        return { schema }
    }));
// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}/graphql`)
})
```
##### ES5
```javascript
const makeSchema = require("graphql-spotify").makeSchema;
const graphqlExpress = require('apollo-server-express').graphqlExpress;
const express = require('express');
const bodyParser = require('body-parser')
// Initialize the app
const port = parseInt(process.env.PORT, 10) || 3000
const app = express();
// bodyParser is needed just for POST.
app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => {
        let token;
        //... somewhere the spotify token is gotten from the context
        const schema = makeSchema(token)
        return { schema }
    }));
// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}/graphql`)
})
```

## Contribute
Anyone is welcome! Take a look at [Roadmap.md](Roadmap.md) for PR ideas and file some issues!

## Used By
* [Graphql Spotify Example](https://github.com/goldensunliu/graphql-spotify-example)
* [Spotify Insight App](https://noise.sitianliu.com/login)
