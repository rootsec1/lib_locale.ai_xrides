const { respond } = require('../util'); // Custom utility function to respond to requests

exports.createOrder = (request, response) => {
    const pool = global.pool;   // Database connection pool
    const requestBody = request.body;
    const values = Object.keys(requestBody).map(key => requestBody[key]);
    const preparedStatement = 'INSERT INTO orders VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *';
    pool.query(preparedStatement, values, (error, data) => respond(error, data.rows, request, response));
};

exports.getAllOrders = (request, response) => {
    const pool = global.pool;
    const numberOfRows = request.query.entries; // Limiting amount of data fetched to prevent overload on system
    const offset = request.query.offset;
    if(numberOfRows && offset && numberOfRows>=1 && offset>=0) {
        const preparedStatement = 'SELECT * FROM orders LIMIT $1 OFFSET $2'; // Prepared statement to optimize query
        const values = [ request.query.entries, request.query.offset ];
        pool.query(preparedStatement, values, (error, data) => respond(error, data.rows, request, response));
    } else {
        const preparedStatement = 'SELECT * FROM orders LIMIT 25';
        pool.query(preparedStatement, (error, data) => respond(error, data.rows, request, response));
    }
};

exports.getOrder = (request, response) => {
    const preparedStatement = 'SELECT * FROM orders WHERE id=$1';
    const values = [ request.params.id ];
    pool.query(preparedStatement, values, (error,data) => {
        if(data===null || data===undefined || data.length===0) respond(null, [], request, response);
        respond(error, data.rows[0], request, response);
    });
};
