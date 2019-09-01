'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const xssClean = require('xss-clean');
const helmet = require('helmet');
//LOCAL
const config = require('./config');
const { respond, setupDatabaseConnection, rateLimiter } = require('./util');

if(process.argv[2]==='dev') setupDatabaseConnection(config.development);
else if(process.argv[2]==='testing') setupDatabaseConnection(config.testing);
else if(process.argv[2]==='prod') setupDatabaseConnection(config.production);
else {
    console.log('[!SERVER] Environment not supplied as command line argument');
    console.log('[!SERVER] Usage: node index.js [prod|dev|test]');
    process.exit();
}

const app = express();
app.use(express.json({ limit: '1kb' }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(morgan('common', { stream: fs.createWriteStream('./access.log', {flags: 'a'}) }));
app.use(rateLimiter);
app.use(xssClean());
app.use(helmet());

app.get('/', (request, response) => respond(null, 'All requests should be directed to /api/v1 endpoint', request, response));
require('./routes/order.routes')(app);
app.listen(config.port, '0.0.0.0', () => console.log('[SERVER] Listening on port '+config.port));
