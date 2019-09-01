'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//LOCAL
const config = require('./config');
const { respond, setupSequelize } = require('./util');

if(process.argv[2]==='dev') setupSequelize(config.development);
else if(process.argv[2]==='testing') setupSequelize(config.testing);
else if(process.argv[2]==='prod') setupSequelize(config.production);
else {
    console.log('[!SERVER] Environment not supplied as command line argument');
    console.log('[!SERVER] Usage: node index.js [prod|dev|test]');
    process.exit();
}

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (request, response) => respond(null, 'All requests should be directed to /api/v1 endpoint', request, response));
app.listen(config.port, '0.0.0.0', () => console.log('[SERVER] Listening on port '+config.port));
