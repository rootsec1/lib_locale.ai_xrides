const { respond } = require('../util');

exports.createOrder = (request, response) => {
    const pool = global.pool;
    const requestBody = request.body;
    const values = Object.keys(requestBody).map(key => requestBody[key]);
    const preparedStatement = 'INSERT INTO orders VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *';
    pool.query(preparedStatement, values, (error, data) => respond(error, data.rows, request, response));
};

exports.getAllOrders = (request, response) => {
    const pool = global.pool;
    const numberOfRows = request.query.entries;
    const offset = request.query.offset;
    if(numberOfRows && offset && numberOfRows>=1 && offset>=0) {
        const preparedStatement = 'SELECT * FROM orders LIMIT $1 OFFSET $2';
        const values = [ request.query.entries, request.query.offset ];
        pool.query(preparedStatement, values, (error, data) => respond(error, data.rows, request, response));
    } else {
        const preparedStatement = 'SELECT * FROM orders LIMIT 25';
        pool.query(preparedStatement, (error, data) => respond(error, data.rows, request, response));
    }
};

exports.getOrder = (request, response) => pool.query('SELECT * FROM orders WHERE id=$1', [request.params.id], (error,data) => respond(error, data.rows[0], request, response));
