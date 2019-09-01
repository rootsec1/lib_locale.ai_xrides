const {  Pool } = require('pg');
const expressRateLimit = require('express-rate-limit');

module.exports.respond = (error, data, request, response) => {
    if(error) {
        console.log('[!SERVER] '+request.method+' '+request.url+' ERROR: '+error);
        response.json({ 'success': false, 'error': error });
    } else response.json({ 'success': true, 'data': data });
};

module.exports.setupDatabaseConnection = (config) => {
    const pool = new Pool({
        user: config.DB_USER,
        password: config.DB_USER_PASSWORD,
        host: config.DB_HOST,
        database: config.DB_NAME 
    });
    pool.connect()
        .then(() => {
            console.log('[DB] Connection to DB success');
            global.pool = pool;
        })
        .catch(err => {
            console.log('[!DB] Connection to DB failed');
            console.log('[!DB] Error: '+err);
            console.log('[!DB] Exiting');
            process.exit();
        });
}

module.exports.rateLimiter = expressRateLimit({
    max: 12500,
    windowMs: 60*60*1000,
    message: 'Too many requests'
});
