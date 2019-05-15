## GraphQL Spotify: [Spotify API](https://beta.developer.spotify.com/documentation/web-api/reference/) GraphQL Schema and Resolvers Built with [GraphQL.js](https://github.com/graphql/graphql-js)

[![Greenkeeper badge](https://badges.greenkeeper.io/goldensunliu/graphql-spotify.svg)](https://greenkeeper.io/)
![](https://travis-ci.org/goldensunliu/graphql-spotify.svg?branch=master)
[![npm version](https://badge.fury.io/js/graphql-spotify.svg)](https://badge.fury.io/js/graphql-spotify)

Refer to [src/schema/RootQuery.js](src/schema/RootQuery.js) for operations currently supported.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Blog on Why](#blog-on-why)
- [Demo](#demo)
- [Getting started](#getting-started)
  - [Getting started with apollo-server-express](#getting-started-with-apollo-server-express)
      - [ES6](#es6)
      - [ES5](#es5)
- [Contribute](#contribute)
- [Used By](#used-by)
  - [Created By](#created-by)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Blog on Why

[Check out the blog](https://medium.com/@sitianliu_57680/why-i-built-a-graphql-server-for-spotify-api-4f516836e4ec) on why graphql-spotify was built.
## Demo

****[Deployed Example App Powered By GraphQL Spotify](https://graphql-spotify-example-zzajohosbz.now.sh)**** And Its [Source Code Repo](https://github.com/goldensunliu/graphql-spotify-example)

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
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
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
const graphiqlExpress = require('apollo-server-express').graphiqlExpress;
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

## Created By
[Sitian Liu](https://www.sitianliu.com/)
