'use strict';
require('dotenv').config();
const express    =    require('express');
const bodyParser =    require('body-parser');   // To parse request body
const morgan     =    require('morgan');   // Logger
const fs         =    require('fs');
const xssClean   =    require('xss-clean'); // Input sanizatization
const helmet     =    require('helmet');    // Additional headers added to response
//LOCAL
const config     =    require('./config');  // Configuration to create 3 environments dev/testing/prod
const {
    respond,
    setupDatabaseConnection,
    rateLimiter
} = require('./util');    // Custom middleware and utility functions

if(process.argv[2]==='dev') setupDatabaseConnection(config.development);
else if(process.argv[2]==='testing') setupDatabaseConnection(config.testing);
else if(process.argv[2]==='prod') setupDatabaseConnection(config.production);
else {
    console.log('[!SERVER] Environment not supplied as command line argument');
    console.log('[!SERVER] Usage: node index.js [prod|dev|test]');
    process.exit();
}

const app = express();
app.use(express.json({ limit: '1kb' }));    // Limiting request payload size
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(morgan('common', { stream: fs.createWriteStream('./access.log', {flags: 'a'}) }));
app.use(rateLimiter);   // Rate limiter
app.use(xssClean());    // Input sanitization to prevent XSS and SQL injection attacks
app.use(helmet());      // Additional headers added

app.get('/', (request, response) => respond(null, 'All requests should be directed to /api/v1 endpoint', request, response));
require('./routes/order.routes')(app);  // Router
app.listen(config.port, '0.0.0.0', () => console.log('[SERVER] Listening on port '+config.port));
