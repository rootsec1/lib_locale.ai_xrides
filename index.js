'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//LOCAL
const { respond } = require('./util');
const PORT = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (request, response) => respond(null, 'All requests should be directed to /api/v1 endpoint', request, response));
app.listen(PORT, '0.0.0.0', () => console.log('[SERVER] Listening on port '+PORT));
